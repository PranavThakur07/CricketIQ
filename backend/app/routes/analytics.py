from fastapi import APIRouter, HTTPException, Query
from typing import Dict, Any, List
from app.models.schemas import MomentumCalculationRequest, MomentumCalculationResponse
from app.analytics.metrics import calculate_momentum_data, SAMPLE_MATCHES

router = APIRouter(
    prefix="/analytics",
    tags=["Analytics & Momentum"]
)

@router.get("/momentum", response_model=MomentumCalculationResponse)
async def get_momentum_presets(
    preset_id: str = Query("ind_vs_pak_2022", description="The ID of the historical preset match to load")
):
    """
    Get full momentum calculations, best/worst overs, and narratives for a historical preset match.
    Supported IDs: ind_vs_pak_2022, rcb_vs_srh_2016, ind_vs_aus_2023
    """
    if preset_id not in SAMPLE_MATCHES:
        raise HTTPException(
            status_code=404, 
            detail=f"Preset match '{preset_id}' not found. Choose from: {list(SAMPLE_MATCHES.keys())}"
        )
    
    match_data = SAMPLE_MATCHES[preset_id]
    
    try:
        calculated_response = calculate_momentum_data(
            batting_team=match_data["batting_team"],
            bowling_team=match_data["bowling_team"],
            raw_overs=match_data["overs"]
        )
        return MomentumCalculationResponse(**calculated_response)
    except Exception as e:
        raise HTTPException(
            status_code=500, 
            detail=f"Error processing preset momentum calculation: {str(e)}"
        )

@router.get("/presets-list")
async def list_presets():
    """
    Returns the key metadata list of all available sandbox match presets.
    """
    return [
        {"id": key, "name": val["match_name"], "batting_team": val["batting_team"], "bowling_team": val["bowling_team"]}
        for key, val in SAMPLE_MATCHES.items()
    ]

@router.post("/momentum/calculate", response_model=MomentumCalculationResponse)
async def calculate_custom_momentum(req: MomentumCalculationRequest):
    """
    Submit custom over-by-over cricket metrics (runs, wickets) to run the 
    Momentum Intelligence Engine and retrieve calculated swings, turning points, and AI narrative.
    """
    if not req.overs:
        raise HTTPException(
            status_code=400, 
            detail="Over data array cannot be empty."
        )
    
    try:
        raw_overs = [{"over": o.over, "runs": o.runs, "wickets": o.wickets} for o in req.overs]
        calculated_response = calculate_momentum_data(
            batting_team=req.batting_team,
            bowling_team=req.bowling_team,
            raw_overs=raw_overs
        )
        return MomentumCalculationResponse(**calculated_response)
    except Exception as e:
        raise HTTPException(
            status_code=500, 
            detail=f"Momentum calculation engine error: {str(e)}"
        )
