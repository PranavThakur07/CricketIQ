from fastapi import APIRouter, HTTPException
from app.models.schemas import ChatRequest, ChatResponse
from app.services.gemini import gemini_service

router = APIRouter(
    prefix="/analyst",
    tags=["AI Match Analyst"]
)

@router.post("/chat", response_model=ChatResponse)
async def chat_with_expert(req: ChatRequest):
    """
    Submit cricket questions to our specialized AI Cricket Analyst
    and receive stats-focused replies with dynamic follow-up actions.
    """
    try:
        response_data = await gemini_service.chat_expert(req)
        return ChatResponse(
            reply=response_data["reply"],
            suggested_follow_ups=response_data["suggested_follow_ups"]
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"AI Match Analyst service error: {str(e)}")
