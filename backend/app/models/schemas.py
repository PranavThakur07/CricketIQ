from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any

class PredictionRequest(BaseModel):
    batting_team: str = Field(..., description="The team currently batting")
    bowling_team: str = Field(..., description="The team currently bowling")
    venue: str = Field(..., description="The stadium / venue of the match")
    target: int = Field(..., description="Runs needed to win")
    current_score: int = Field(..., description="Current runs scored")
    wickets_lost: int = Field(..., description="Current wickets down")
    overs_completed: float = Field(..., description="Overs completed so far (e.g. 14.2)")
    format: str = Field("T20", description="Match format (T20, ODI, Test)")

class PredictionResponse(BaseModel):
    batting_win_probability: float = Field(..., description="Win probability for the batting team (0.0 to 100.0)")
    bowling_win_probability: float = Field(..., description="Win probability for the bowling team (0.0 to 100.0)")
    required_run_rate: float = Field(..., description="Required run rate to win")
    current_run_rate: float = Field(..., description="Current run rate of the match")
    ai_insights: str = Field(..., description="Gemini-generated expert context and key match variables")

class SimulatorRequest(BaseModel):
    scenario_description: str = Field(..., description="The custom hypothetical scenario (e.g., 'What if MSD batted at #3 in the 2019 Semi Final?')")
    custom_rules: Optional[List[str]] = Field(None, description="Optional custom rules or parameters")
    historical_match_id: Optional[str] = Field(None, description="ID of a specific historical match to simulate from")

class SimulatorResponse(BaseModel):
    scenario_title: str = Field(..., description="Summary title of the simulation")
    simulated_outcome: str = Field(..., description="Short outcome of the simulated universe")
    detailed_scorecard: Dict[str, Any] = Field(..., description="Simulated key team scores, runs, overs, and wickets")
    key_turning_points: List[str] = Field(..., description="Bullet list of simulated turning points")
    ai_commentary: str = Field(..., description="AI narrative style summary of the alternate universe match")

class ChatMessage(BaseModel):
    role: str = Field(..., description="Role: 'user' or 'model' / 'assistant'")
    content: str = Field(..., description="The actual text content of the message")

class ChatRequest(BaseModel):
    prompt: str = Field(..., description="User query / prompt for the AI cricket expert")
    chat_history: Optional[List[ChatMessage]] = Field(default=[], description="Previous conversation history for contextual replies")

class ChatResponse(BaseModel):
    reply: str = Field(..., description="AI response text")
    suggested_follow_ups: List[str] = Field(default=[], description="Dynamic suggestions for follow-up prompts")

class OverMomentum(BaseModel):
    over_number: int
    batting_team_momentum: float = Field(..., description="Momentum index (-10 to 10)")
    bowling_team_momentum: float = Field(..., description="Momentum index (-10 to 10)")
    runs_scored: int
    wickets_lost: int
    highlights: Optional[str] = None

class MomentumResponse(BaseModel):
    match_id: str
    batting_team: str
    bowling_team: str
    overs_data: List[OverMomentum]
    current_momentum_owner: str = Field(..., description="The team currently dominating momentum")
    momentum_summary: str = Field(..., description="AI description of the momentum swings")

class OverData(BaseModel):
    over: int = Field(..., description="Over index number")
    runs: int = Field(..., description="Runs scored in this over")
    wickets: int = Field(..., description="Wickets lost in this over")

class MomentumCalculationRequest(BaseModel):
    batting_team: Optional[str] = Field("India", description="Name of the batting team")
    bowling_team: Optional[str] = Field("Pakistan", description="Name of the bowling team")
    overs: List[OverData] = Field(..., description="List of over stats for momentum calculations")

class CalculatedOverMomentum(BaseModel):
    over: int
    runs: int
    wickets: int
    current_run_rate: float
    average_run_rate: float
    momentum_score: float
    momentum_swing: float
    is_turning_point: bool
    highlight: Optional[str] = None

class MomentumCalculationResponse(BaseModel):
    batting_team: str
    bowling_team: str
    overs_calculated: List[CalculatedOverMomentum]
    best_over: int
    worst_over: int
    match_turning_point: int
    current_momentum_holder: str
    ai_narrative: str

class AnalystQueryRequest(BaseModel):
    question: str = Field(..., description="The query / question from the user")
    match_id: str = Field(..., description="The ID of the match to analyze")

class AnalystQueryResponse(BaseModel):
    answer: str = Field(..., description="Main direct analyst answer")
    evidence: List[str] = Field(..., description="Bullet points of supporting statistical evidence")
    key_events: List[str] = Field(..., description="List of key match over events")
    confidence: float = Field(0.95, description="Model analytical confidence ratio")

class AlternateUniverseRequest(BaseModel):
    match_id: str = Field(..., description="Match ID to simulate")
    scenario: str = Field(..., description="Hypothetical scenario prompt")

class AlternateUniverseResponse(BaseModel):
    original_winner: str = Field(..., description="Original winner of the match")
    simulated_winner: str = Field(..., description="Simulated alternate winner")
    win_probability_before: float = Field(..., description="Projected winning probability before the reality shift")
    win_probability_after: float = Field(..., description="Projected winning probability after the reality shift")
    impact_score: float = Field(..., description="Total index change of winning probability")
    alternate_story: str = Field(..., description="Cinematic TV-style commentary of the alternate reality shift")
    key_changes: List[str] = Field(..., description="Array of specific match changes that occurred")

class ProviderStatusResponse(BaseModel):
    status: str = Field(..., description="Status string: 'connected' or 'not_configured'")
    provider_name: str = Field(..., description="Active provider name")
    display_message: str = Field(..., description="Commentator status message, e.g. '✓ CricAPI Connected'")

class LiveMatchBrief(BaseModel):
    id: str
    match_name: str
    batting_team: str
    bowling_team: str
    current_score: int
    wickets_lost: int
    overs_completed: float
    target: int
    required_run_rate: float
    current_run_rate: float
    status_text: str
    last_updated: str

class LiveMatchDetail(BaseModel):
    id: str
    match_name: str
    batting_team: str
    bowling_team: str
    venue: str
    format: str
    target: int
    current_score: int
    wickets_lost: int
    overs_completed: float
    required_run_rate: float
    current_run_rate: float
    status_text: str
    last_updated: str
    overs: List[OverData]
    momentum: Optional[MomentumCalculationResponse] = None
    win_probability: Optional[Dict[str, float]] = None

class WarRoomRequest(BaseModel):
    agent_type: str = Field(..., description="Agent identifier: 'analyst', 'predictor', or 'strategist'")
    question: str = Field(..., description="User query / prompt for the agent")
    match_id: str = Field(..., description="Match ID being reviewed")
    is_live: bool = Field(False, description="Flag indicating if the match is live")

class WarRoomResponse(BaseModel):
    agent_type: str
    reply: str = Field(..., description="Chatbot agent commentary reply")
    strategic_insights: List[str] = Field(default=[], description="Bullet logs of technical suggestions")
    confidence_score: float = Field(0.95, description="Agent probability certainty score")

class MatchReportRequest(BaseModel):
    match_id: str = Field(..., description="Match ID to generate standard report")
    is_live: bool = Field(False, description="Flag indicating if match is live")

class MatchReportResponse(BaseModel):
    match_name: str
    match_summary: str = Field(..., description="Cinematic full match recap")
    turning_points: List[str] = Field(..., description="List of key turning point overs")
    key_performer: str = Field(..., description="MVP detailed performance stats")
    winning_factors: List[str] = Field(..., description="Winning factors lists")
    strategic_insights: List[str] = Field(..., description="Strategic recommendations for future matches")




