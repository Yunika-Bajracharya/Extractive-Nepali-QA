from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from transformers import pipeline

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class QARequest(BaseModel):
    context: str
    question: str

@app.post("/answer")
async def get_answer(qa_request: QARequest):
    qa_pipeline = pipeline("question-answering", model="Yunika/muril-squad-nepali")

    answer = qa_pipeline(question=qa_request.question, context=qa_request.context)

    return {"answer": answer}
