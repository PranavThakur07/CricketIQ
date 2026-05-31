from fastapi import APIRouter, HTTPException
from app.models.schemas import WarRoomRequest, WarRoomResponse, MatchReportRequest, MatchReportResponse
from app.services.gemini import gemini_service
from app.services.live_provider import live_provider_manager
from app.analytics.metrics import calculate_momentum_data, SAMPLE_MATCHES

router = APIRouter(
    prefix="/war-room",
    tags=["Agentic War Room"]
)

async def _resolve_match_context(match_id: str, is_live: bool) -> dict:
    """
    Helper to fetch and calculate momentum context logs for both live and historical matches.
    """
    if not is_live:
        if match_id not in SAMPLE_MATCHES:
            raise HTTPException(
                status_code=404,
                detail=f"Historical Match ID '{match_id}' not found in presets."
            )
        match_data = SAMPLE_MATCHES[match_id]
        return calculate_momentum_data(
            batting_team=match_data["batting_team"],
            bowling_team=match_data["bowling_team"],
            raw_overs=match_data["overs"]
        )
    else:
        provider = live_provider_manager.get_active_provider()
        if not provider.is_configured():
            raise HTTPException(
                status_code=400,
                detail="Live provider is not configured. Cannot fetch live match context."
            )
        try:
            live_detail = await provider.get_live_match_detail(match_id)
            # Re-run momentum engine calculations over live overs completed
            return calculate_momentum_data(
                batting_team=live_detail.get("batting_team", "Batting Team"),
                bowling_team=live_detail.get("bowling_team", "Bowling Team"),
                raw_overs=live_detail.get("overs", [])
            )
        except Exception as e:
            raise HTTPException(
                status_code=503,
                detail=f"Failed to fetch live match context: {str(e)}"
            )

@router.post("/chat", response_model=WarRoomResponse)
async def chat_with_war_room_agent(req: WarRoomRequest):
    """
    Interact with one of three specialized AI agents (Analyst, Predictor, Strategist)
    injecting detailed real-time/historical momentum metrics as strategic context.
    """
    context_data = await _resolve_match_context(req.match_id, req.is_live)
    try:
        agent_data = await gemini_service.chat_war_room(req, context_data)
        return WarRoomResponse(**agent_data)
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"War Room Agent Service encountered an error: {str(e)}"
        )

@router.post("/match-report", response_model=MatchReportResponse)
async def generate_match_intelligence_report(req: MatchReportRequest):
    """
    Generate an exhaustive, highly tactical commentary and strategic match report.
    """
    context_data = await _resolve_match_context(req.match_id, req.is_live)
    try:
        report_data = await gemini_service.generate_match_report(req, context_data)
        return MatchReportResponse(**report_data)
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Match Report Generator encountered an error: {str(e)}"
        )
