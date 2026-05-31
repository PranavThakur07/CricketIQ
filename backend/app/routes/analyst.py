from fastapi import APIRouter, HTTPException
from app.models.schemas import ChatRequest, ChatResponse, AnalystQueryRequest, AnalystQueryResponse
from app.services.gemini import gem_service
from app.analytics.metrics import calculate_momentum_data, SAMPLE_MATCHES

router = APIRouter(
    prefix="/analyst",
    tags=["AI Match Analyst"]
)

@router.post("/query", response_model=AnalystQueryResponse)
async def query_match_analyst(req: AnalystQueryRequest):
    """
    Submit a custom natural language query about a specific match.
    Calculates dynamic over momentum metrics, builds full match context, 
    and returns Gemini-driven strategic summaries, evidence metrics, and key highlights.
    """
    if req.match_id not in SAMPLE_MATCHES:
        raise HTTPException(
            status_code=404,
            detail=f"Match ID '{req.match_id}' not found. Available presets: {list(SAMPLE_MATCHES.keys())}"
        )

    try:
        # 1. Fetch match and run momentum engine to build context
        match_data = SAMPLE_MATCHES[req.match_id]
        context_data = calculate_momentum_data(
            batting_team=match_data["batting_team"],
            bowling_team=match_data["bowling_team"],
            raw_overs=match_data["overs"]
        )

        # 2. Invoke Gemini service with query and fully populated metrics context
        analyst_response = await gem_service.query_analyst(req, context_data)
        
        return AnalystQueryResponse(
            answer=analyst_response["answer"],
            evidence=analyst_response["evidence"],
            key_events=analyst_response["key_events"],
            confidence=analyst_response["confidence"]
        )
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"AI Match Analyst failed to process query: {str(e)}"
        )

@router.post("/chat", response_model=ChatResponse)
async def chat_with_expert(req: ChatRequest):
    """
    Standard chat assistant endpoint for general queries.
    """
    try:
        response_data = await gem_service.chat_expert(req)
        return ChatResponse(
            reply=response_data["reply"],
            suggested_follow_ups=response_data["suggested_follow_ups"]
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"AI Match Analyst general chat failed: {str(e)}")
