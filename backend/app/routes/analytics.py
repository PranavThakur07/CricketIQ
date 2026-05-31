from fastapi import APIRouter, Query
from app.models.schemas import MomentumResponse
from app.analytics.metrics import generate_momentum_swings

router = APIRouter(
    prefix="/analytics",
    tags=["Analytics & Momentum"]
)

@router.get("/momentum", response_model=MomentumResponse)
async def get_momentum(
    batting_team: str = Query("India", description="Batting team name"),
    bowling_team: str = Query("Australia", description="Bowling team name")
):
    """
    Get over-by-over momentum indices, run scoring metrics, and highlights
    for the momentum visualization engine.
    """
    return generate_momentum_swings(batting_team, bowling_team)
