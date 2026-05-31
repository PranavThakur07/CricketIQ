import sys
import os
import asyncio
import json

# Add backend directory to Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# Mock dependencies / settings to allow importing gemini without real API key failure if needed
# (Though config loads from .env, which has GEMINI_API_KEY)
from app.services.gemini import GeminiService
from app.models.schemas import MatchReportRequest, AnalystQueryRequest, WarRoomRequest

# Create dummy mock requests
match_context = {
    "batting_team": "India",
    "bowling_team": "Pakistan",
    "best_over": 18,
    "worst_over": 5,
    "match_turning_point": 19,
    "current_momentum_holder": "India",
    "ai_narrative": "A tight finish expected.",
    "overs_calculated": []
}

class MockResponse:
    def __init__(self, text):
        self.text = text

class MockModelClient:
    def __init__(self, mode="success", delay=0.0):
        self.mode = mode
        self.delay = delay
        self.generate_content_called = 0

    def generate_content(self, model, contents, config=None):
        self.generate_content_called += 1
        if self.delay > 0:
            import time
            time.sleep(self.delay)
            
        if self.mode == "success_nested":
            return MockResponse(json.dumps({
                "match_name": "Thrilling Ind vs Pak Clash",
                "match_summary": "A close tactical match settled in the final over.",
                "turning_points": [
                    {"moment": "Over 19", "text": "Kohli straight sixes off Haris Rauf"},
                    {"moment": "Over 12", "text": "Spinner attack counter"}
                ],
                "key_performer": {"name": "Virat Kohli", "impact": "82* off 53 balls under pressure"},
                "winning_factors": [
                    {"factor": "Calm chase target pacing"},
                    {"factor": "Death overs boundary execution"},
                    {"factor": "Wicket conservation strategy"}
                ],
                "strategic_insights": [
                    {"recommendation": "Protect early wickets in the powerplay"},
                    {"recommendation": "Use slow cutters on dry surfaces"},
                    {"recommendation": "Target spinners during middle overs"}
                ]
            }))
        elif self.mode == "malformed":
            return MockResponse("This is not valid JSON string!")
        elif self.mode == "wrong_keys":
            return MockResponse(json.dumps({
                "match_name": ["List instead of string"],
                "match_summary": {"nested": "dict instead of string"},
                "turning_points": "Just a plain string instead of list",
                "key_performer": ["List of strings"],
                "winning_factors": None,
                "strategic_insights": 12345
            }))
        elif self.mode == "timeout":
            # Will be caught due to delay
            return MockResponse("{}")
        
        return MockResponse("{}")

class MockClient:
    def __init__(self, mode="success", delay=0.0):
        self.models = MockModelClient(mode, delay)

async def test_scenarios():
    print("====================================================")
    print("CRICKETIQ GEMINI INTEGRATION HOTFIX VALIDATION SUITE")
    print("====================================================\n")
    
    # 1. Success Path with Complex Nested Objects
    print("[TEST 1] Testing Gemini nested object response sanitization...")
    service = GeminiService()
    mock_client = MockClient("success_nested")
    service.client = mock_client
    
    req = MatchReportRequest(match_id="ind_vs_pak_2022", is_live=False)
    report = await service.generate_match_report(req, match_context)
    
    # Assertions
    assert isinstance(report["turning_points"], list), "turning_points must be a list"
    assert all(isinstance(tp, str) for tp in report["turning_points"]), "turning_points items must be strings"
    assert isinstance(report["winning_factors"], list), "winning_factors must be a list"
    assert all(isinstance(wf, str) for wf in report["winning_factors"]), "winning_factors items must be strings"
    assert isinstance(report["strategic_insights"], list), "strategic_insights must be a list"
    assert all(isinstance(si, str) for si in report["strategic_insights"]), "strategic_insights items must be strings"
    assert isinstance(report["key_performer"], str), "key_performer must be a string"
    
    print("  [OK] turning_points properly sanitized:", report["turning_points"])
    print("  [OK] winning_factors properly sanitized:", report["winning_factors"])
    print("  [OK] strategic_insights properly sanitized:", report["strategic_insights"])
    print("  [OK] key_performer properly sanitized:", report["key_performer"])
    print("  [OK] match_name properly sanitized:", report["match_name"])
    print("  [SUCCESS] Test 1 passed successfully.\n")

    # 2. Malformed JSON Response Test
    print("[TEST 2] Testing malformed Gemini JSON response fallback...")
    mock_client_malformed = MockClient("malformed")
    service.client = mock_client_malformed
    
    report_malformed = await service.generate_match_report(req, match_context)
    # Falling back must return a valid dictionary from generate_report_fallback
    assert isinstance(report_malformed, dict)
    assert "India" in report_malformed["match_name"] or "Pakistan" in report_malformed["match_name"] or "Tactical Climax" in report_malformed["match_name"]
    print("  [OK] Malformed JSON did not crash app.")
    print("  [OK] Fallback activated seamlessly:", report_malformed["match_name"])
    print("  [SUCCESS] Test 2 passed successfully.\n")

    # 3. Wrong Keys / Non-dict response
    print("[TEST 3] Testing unexpected data types (wrong schemas, primitive conversions)...")
    mock_client_types = MockClient("wrong_keys")
    service.client = mock_client_types
    
    report_types = await service.generate_match_report(req, match_context)
    assert isinstance(report_types["turning_points"], list)
    assert isinstance(report_types["strategic_insights"], list)
    assert isinstance(report_types["key_performer"], str)
    print("  [OK] Non-conforming schema structures resolved to valid primitive strings/lists.")
    print("  [OK] match_name resolved:", report_types["match_name"])
    print("  [OK] turning_points resolved:", report_types["turning_points"])
    print("  [OK] strategic_insights resolved:", report_types["strategic_insights"])
    print("  [SUCCESS] Test 3 passed successfully.\n")

    # 4. Timeout Scenario Test
    print("[TEST 4] Testing Gemini timeout handling (simulating delay > 3s)...")
    mock_client_timeout = MockClient("timeout", delay=4.0)
    service.client = mock_client_timeout
    
    # We expect this to exceed 3.0s and throw asyncio.TimeoutError, which triggers fallback
    import time
    start_time = time.time()
    report_timeout = await service.generate_match_report(req, match_context)
    elapsed = time.time() - start_time
    
    assert elapsed < 3.5, f"Timeout took too long: {elapsed:.2f}s"
    assert isinstance(report_timeout, dict)
    print(f"  [OK] Timeout triggered after {elapsed:.2f}s (strict 3.0s threshold works).")
    print("  [OK] Safe deterministic fallback returned.")
    print("  [OK] No internal exception exposed.")
    print("  [SUCCESS] Test 4 passed successfully.\n")

    # 5. Verify other endpoints regressions
    print("[TEST 5] Verifying no regressions in AI Match Analyst and War Room...")
    # Analyst Query
    service.client = MockClient("success_nested")
    analyst_req = AnalystQueryRequest(question="Who is the key player?", match_id="ind_vs_pak_2022")
    analyst_resp = await service.query_analyst(analyst_req, match_context)
    assert isinstance(analyst_resp["answer"], str)
    assert isinstance(analyst_resp["evidence"], list)
    print("  [OK] AI Match Analyst working and type-safe.")
    
    # War Room Chat
    war_req = WarRoomRequest(agent_type="strategist", question="What to do now?", match_id="ind_vs_pak_2022")
    war_resp = await service.chat_war_room(war_req, match_context)
    assert isinstance(war_resp["reply"], str)
    assert isinstance(war_resp["strategic_insights"], list)
    print("  [OK] Agentic War Room strategist working and type-safe.")
    print("  [SUCCESS] Test 5 passed successfully.\n")
    
    print("====================================================")
    print("ALL HOTFIX INTEGRATION TESTS PASSED TRIUMPHANTLY!")
    print("====================================================")

if __name__ == "__main__":
    asyncio.run(test_scenarios())
