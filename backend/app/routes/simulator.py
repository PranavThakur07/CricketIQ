from fastapi import APIRouter, HTTPException
from app.models.schemas import SimulatorRequest, SimulatorResponse, AlternateUniverseRequest, AlternateUniverseResponse
from app.services.gemini import gemini_service
from app.analytics.metrics import calculate_momentum_data, SAMPLE_MATCHES

router = APIRouter(
    prefix="/simulator",
    tags=["Alternate Universe Simulator"]
)

@router.post("/alternate-universe", response_model=AlternateUniverseResponse)
async def simulate_alternate_reality_shift(req: AlternateUniverseRequest):
    """
    Simulate a custom historical reality shift on preset scorecards.
    Accepts match_id and hypothetical scenario variables, maps calculations context,
    and returns winning probabilities, impact ratings, and commentator diaries.
    """
    if req.match_id not in SAMPLE_MATCHES:
        raise HTTPException(
            status_code=404,
            detail=f"Match ID '{req.match_id}' not found. Choose from presets: {list(SAMPLE_MATCHES.keys())}"
        )
        
    try:
        # 1. Fetch match and run momentum engine calculations to get context logs
        match_data = SAMPLE_MATCHES[req.match_id]
        context_data = calculate_momentum_data(
            batting_team=match_data["batting_team"],
            bowling_team=match_data["bowling_team"],
            raw_overs=match_data["overs"]
        )
        
        # 2. Invoke Gemini Alternate Universe Simulation strategist
        sim_response = await gemini_service.simulate_alternate_reality(req, context_data)
        
        return AlternateUniverseResponse(
            original_winner=sim_response["original_winner"],
            simulated_winner=sim_response["simulated_winner"],
            win_probability_before=sim_response["win_probability_before"],
            win_probability_after=sim_response["win_probability_after"],
            impact_score=sim_response["impact_score"],
            alternate_story=sim_response["alternate_story"],
            key_changes=sim_response["key_changes"]
        )
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Alternate Universe Simulation Engine failed: {str(e)}"
        )

@router.post("/universe", response_model=SimulatorResponse)
async def simulate_universe(req: SimulatorRequest):
    """
    Standard preset simulator query endpoint.
    """
    try:
        simulation_data = await gemini_service.simulate_alternate_universe(req)
        return SimulatorResponse(
            scenario_title=simulation_data["scenario_title"],
            simulated_outcome=simulation_data["simulated_outcome"],
            detailed_scorecard=simulation_data["detailed_scorecard"],
            key_turning_points=simulation_data["key_turning_points"],
            ai_commentary=simulation_data["ai_commentary"]
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Universe simulator service error: {str(e)}")
