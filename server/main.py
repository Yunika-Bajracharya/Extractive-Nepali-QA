from fastapi import FastAPI, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from transformers import pipeline
from pathlib import Path
import uvicorn
import os
import dotenv

dotenv.load_dotenv()

# import fitz  # PyMuPDF
# import pdfplumber
# from pdfminer.high_level import extract_text
import pytesseract
from pdf2image import convert_from_path

# from DocSearch import BM25Search
from Scraper import scrape_from_url

app = FastAPI()
# docSearch = BM25Search([])

UPLOAD_DIR = Path() / "uploads"
# docSearch.build_courpus_from_directory(UPLOAD_DIR)

if not os.environ["ORIGIN"]:
    allowed_origins = ["*"]
else:
    allowed_origins = [os.environ["ORIGIN"]]

print(allowed_origins)
app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
# qa_pipeline = pipeline("question-answering", model="Yunika/muril-squad-nepali")
qa_pipeline = pipeline(
    "question-answering", model="suban244/muRIL-squad-nep-hi-translated-squad"
)


class QRequest(BaseModel):
    question: str


class QWithContext(QRequest):
    context: str
    fileName: str


class QWithUrl(QRequest):
    url: str


def create_folder_if_not_exists(folder_path):
    if not os.path.exists(folder_path):
        os.makedirs(folder_path)
        print(f"Folder '{folder_path}' created.")
    else:
        print(f"Folder '{folder_path}' already exists.")


def extract_text_from_pdf(file_path):
    pages = convert_from_path(file_path, 500)  # 500 dpi for higher quality conversion

    full_text = ""

    for page in pages:
        # Extract text from the image using Tesseract
        text = pytesseract.image_to_string(page, lang="nep")

        # Append the text to the full text string
        full_text += text

    return full_text


@app.post("/answer")
async def get_answer(qa_request: QWithContext):
    if qa_request.fileName:
        file_path = UPLOAD_DIR / qa_request.fileName
        pdf_text = extract_text_from_pdf(file_path)
        qa_request.context = pdf_text

    answer = qa_pipeline(question=qa_request.question, context=qa_request.context)  # type: ignore
    return {"answer": answer}


@app.post("/uploadfile/")
async def create_upload_file(file_upload: UploadFile):
    data = await file_upload.read()
    save_to = UPLOAD_DIR / (file_upload.filename or "untitled")
    create_folder_if_not_exists(UPLOAD_DIR)
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


@app.get("/")
async def hello():
    return {"answer": "world"}


if __name__ == "__main__":
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
