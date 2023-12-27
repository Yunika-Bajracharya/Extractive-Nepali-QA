from fastapi import FastAPI, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from transformers import pipeline
from pathlib import Path
import uvicorn

app = FastAPI()

UPLOAD_DIR = Path() / 'uploads'

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

@app.post("/uploadfile/")
async def create_upload_file(file_upload: UploadFile):
    
    data = await file_upload.read()
    save_to = UPLOAD_DIR / file_upload.filename
    with open(save_to, 'wb') as f:
        f.write(data)
        
    return {"filenames": file_upload.filename}

if __name__ == "__main__":
   uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)