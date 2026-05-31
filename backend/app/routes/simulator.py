from fastapi import APIRouter, HTTPException
from app.models.schemas import SimulatorRequest, SimulatorResponse
from app.services.gemini import gemini_service

router = APIRouter(
    prefix="/simulator",
    tags=["Alternate Universe Simulator"]
)

@router.post("/universe", response_model=SimulatorResponse)
async def simulate_universe(req: SimulatorRequest):
    """
    Simulate a custom historical or hypothetical cricket scenario
    and generate simulated match scorecards, critical turning points, and commentary.
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
