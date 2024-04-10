from fastapi import FastAPI, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from transformers import pipeline
from pathlib import Path
import uvicorn

# from DocSearch import BM25Search
from Scraper import scrape_from_url

app = FastAPI()
# docSearch = BM25Search([])

UPLOAD_DIR = Path() / "uploads"
# docSearch.build_courpus_from_directory(UPLOAD_DIR)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
qa_pipeline = pipeline("question-answering", model="Yunika/muril-squad-nepali")


class QRequest(BaseModel):
    question: str


class QWithContext(QRequest):
    context: str


class QWithUrl(QRequest):
    url: str


@app.post("/answer")
async def get_answer(qa_request: QWithContext):
    answer = qa_pipeline(question=qa_request.question, context=qa_request.context)  # type: ignore
    return {"answer": answer}


@app.post("/uploadfile/")
async def create_upload_file(file_upload: UploadFile):
    data = await file_upload.read()
    save_to = UPLOAD_DIR / (file_upload.filename or "untitled")
    with open(save_to, "wb") as f:
        f.write(data)

    return {"filenames": file_upload.filename}


# @app.post("/answerfromuploads")
# async def get_answer_from_uploads(q_request: QRequest):
#     top_n = docSearch.get_top_n(q_request.question, 4)
#     answers = []
#     for text in top_n:
#         answer = qa_pipeline(question=q_request.question, context=text)  # type: ignore
#         answers.append(answer)
#
#     return {"answers": answers}


@app.post("/scrape_search")
async def get_answer_by_scrapping(req: QWithUrl):
    print(req.url, req.question)
    paragraphs = await scrape_from_url(req.url)
    print(paragraphs)

    answer = qa_pipeline(question=req.question, context="\n".join(paragraphs))  # type: ignore
    print(answer)
    return {"answer": answer}


if __name__ == "__main__":
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
