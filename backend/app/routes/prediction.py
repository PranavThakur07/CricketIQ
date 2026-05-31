from fastapi import APIRouter, HTTPException
from app.models.schemas import PredictionRequest, PredictionResponse
from app.analytics.metrics import calculate_live_probabilities
from app.services.gemini import gemini_service

router = APIRouter(
    prefix="/prediction",
    tags=["Win Predictor"]
)

@router.post("/win-probability", response_model=PredictionResponse)
async def predict_win_probability(req: PredictionRequest):
    """
    Calculate real-time win probability based on live game metrics
    and generate custom AI intelligence explaining the tactical match state.
    """
    try:
        # Calculate rates and mathematical probabilities
        probabilities = calculate_live_probabilities(req)
        
        # Query Gemini Service for rich analytics text insights
        ai_insights = await gemini_service.generate_match_insights(req)
        
        return PredictionResponse(
            batting_win_probability=probabilities["batting_win_probability"],
            bowling_win_probability=probabilities["bowling_win_probability"],
            required_run_rate=probabilities["required_run_rate"],
            current_run_rate=probabilities["current_run_rate"],
            ai_insights=ai_insights
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Win predictor service error: {str(e)}")
