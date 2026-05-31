from fastapi import APIRouter, HTTPException
from typing import List
from app.models.schemas import ProviderStatusResponse, LiveMatchBrief, LiveMatchDetail
from app.services.live_provider import live_provider_manager

router = APIRouter(
    prefix="/live",
    tags=["Live Analytics Mode"]
)

@router.get("/status", response_model=ProviderStatusResponse)
async def get_live_provider_status():
    """
    Exposes connection and configuration status for the external live cricket API.
    Used by the frontend to render connection badges and warning modals.
    """
    status_data = live_provider_manager.get_status()
    return ProviderStatusResponse(
        status=status_data["status"],
        provider_name=status_data["provider_name"],
        display_message=status_data["display_message"]
    )

@router.get("/matches", response_model=List[LiveMatchBrief])
async def list_active_live_matches():
    """
    Returns active live matches retrieved from the external provider.
    Fails gracefully returning an empty array if no provider key is configured.
    """
    provider = live_provider_manager.get_active_provider()
    if not provider.is_configured():
        return []
    
    try:
        raw_matches = await provider.get_live_matches()
        # Convert to Pydantic objects if available
        briefs = []
        for m in raw_matches:
            briefs.append(LiveMatchBrief(**m))
        return briefs
    except Exception as e:
        raise HTTPException(
            status_code=503,
            detail=f"Failed to fetch live matches from {provider.get_provider_name()}: {str(e)}"
        )

@router.get("/matches/{match_id}", response_model=LiveMatchDetail)
async def get_live_match_details(match_id: str):
    """
    Returns detailed real-time overs and scores for an active match.
    """
    provider = live_provider_manager.get_active_provider()
    if not provider.is_configured():
        raise HTTPException(
            status_code=400,
            detail="Live Provider is not configured. Real-time details unavailable."
        )
    
    try:
        detail_data = await provider.get_live_match_detail(match_id)
        if not detail_data:
            raise HTTPException(
                status_code=404,
                detail=f"Live match '{match_id}' not found."
            )
        return LiveMatchDetail(**detail_data)
    except HTTPException as he:
        raise he
    except Exception as e:
        raise HTTPException(
            status_code=503,
            detail=f"Error querying detailed live data: {str(e)}"
        )
