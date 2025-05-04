from pydantic import BaseModel, Field

class ChatRequest(BaseModel):
    question: str = Field(..., description="User's question about the culture")

class ChatResponse(BaseModel):
    answer: str = Field(..., description=" generated answer from AI")