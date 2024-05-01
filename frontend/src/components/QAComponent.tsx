import React, { useState } from "react";
import axios from "axios";
import "./QAComponent.css";

import { ReactTransliterate } from "react-transliterate";
// import "react-transliterate/dist/index.css";

enum InputType {
  DocumentUpload = 1,
  ContextText,
  WebsiteLink,
}

enum QuestionInput {
  Default = 1,
  NepaliTranliteration,
}

  const API_ENDPOINT = import.meta.env.VITE_SERVER_URL || "http://127.0.0.1:8000";

const QAComponent = () => {
  const [context, setContext] = useState<string>("");
  const [question, setQuestion] = useState<string>("");
  const [answer, setAnswer] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [file, setFile] = useState<File | null>(null);
  const [inputType, setInputType] = useState<InputType>(
    InputType.DocumentUpload
  );
  const [websiteLink, setWebsiteLink] = useState<string>("");
  const [uploadSuccess, setUploadSuccess] = useState<boolean>(false);

  // Transliteration states
  const [text, setText] = useState("");
  const lang = "ne";

  const [questionInput, setQuestionInput] = useState<QuestionInput>(
    QuestionInput.Default
  );

  const handleGetAnswer = async () => {
    setLoading(true);
    setError("");

    const data = {
      context: context,
      question: question,
      fileName: file ? file.name : "",
    };

    try {
      const response = await axios.post(API_ENDPOINT + "/answer", data);
      setAnswer(response.data.answer.answer);
    } catch (err) {
      setError("Failed to fetch answer. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleFileInputChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (event.target.files) {
      setFile(event.target.files[0]);
    }
  };

  const handleFileUpload = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData();
    file && formData.append("file_upload", file);

    try {
      const fileupload_endpoint = API_ENDPOINT + "/uploadfile/";

      const response = await fetch(fileupload_endpoint, {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        console.log("File upload success");
        setUploadSuccess(true);
      } else {
        console.log("Failed to upload file");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="container">
      <header>
        <h1>Extractive Nepali Question Answering System</h1>
      </header>
      <section className="input-section">
        <div>
          <button
            className={`input-section-button ${
              inputType == InputType.DocumentUpload ? "blue" : ""
            }`}
            onClick={() => {
              setInputType(InputType.DocumentUpload);
              setContext("");
            }}
          >
            Document Upload
          </button>
          <button
            className={`input-section-button ${
              inputType == InputType.ContextText ? "blue" : ""
            }`}
            onClick={() => {
              setInputType(InputType.ContextText);
              setFile(null);
              setUploadSuccess(false);
            }}
          >
            Context Text
          </button>
          {/* <button
            className={`input-section-button ${
              inputType == InputType.WebsiteLink ? "blue" : ""
            }`}
            onClick={() => setInputType(InputType.WebsiteLink)}
          >
            Website Link
          </button> */}
        </div>

        {inputType === InputType.DocumentUpload && (
          <div className="fileupload-section">
            <form onSubmit={handleFileUpload} className="fileupload-form">
              <label htmlFor="file-upload" className="file-upload-label">
                <span className="file-upload-icon">+</span> Choose File
              </label>
              <input
                type="file"
                id="file-upload"
                onChange={handleFileInputChange}
                className="file-upload-input"
                onClick={() => setUploadSuccess(false)}
              />
              <button
                type="submit"
                className={
                  uploadSuccess ? "uploaded-submit-button" : "fileupload-submit"
                }
              >
                {uploadSuccess ? "File Uploaded" : "Upload"}
              </button>
            </form>
            {file && (
              <p className="file-upload-info">
                Selected file: <span>{file.name}</span>
              </p>
            )}
          </div>
        )}

        {inputType == InputType.ContextText && (
          <textarea
            className="context-field"
            placeholder="Enter context paragraph"
            value={context}
            onChange={(e) => setContext(e.target.value)}
            rows={1}
            style={{ minHeight: "100px" }}
            onInput={(e) => {
              const target = e.target as HTMLTextAreaElement;
              target.style.height = "auto";
              target.style.height = `${target.scrollHeight}px`;
            }}
          />
        )}

        {inputType == InputType.WebsiteLink && (
          <>
            <input
              className="input-field"
              type="text"
              placeholder="Enter website link"
              value={websiteLink}
              onChange={(e) => setWebsiteLink(e.target.value)}
            />
          </>
        )}

        <p className="input-section-heading">Question</p>

        <div>
          <button
            className={`input-section-button ${
              questionInput == QuestionInput.Default ? "blue" : ""
            }`}
            onClick={() => setQuestionInput(QuestionInput.Default)}
          >
            Default
          </button>

          <button
            className={`input-section-button ${
              questionInput == QuestionInput.NepaliTranliteration ? "blue" : ""
            }`}
            onClick={() => setQuestionInput(QuestionInput.NepaliTranliteration)}
          >
            Nepali Transliteration
          </button>
        </div>

        {questionInput == QuestionInput.Default && (
          <input
            className="input-field"
            type="text"
            placeholder="Enter your question"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
          />
        )}

        {questionInput == QuestionInput.NepaliTranliteration && (
          <ReactTransliterate
            renderComponent={(props: any) => (
              <input className="input-field" {...props} />
            )}
            value={text}
            placeholder="Enter your question in romanized Nepali"
            onChangeText={(text: string) => {
              setText(text);
              setQuestion(text);
            }}
            lang={lang}
            className="input-field"
          />
        )}
        <button
          className="submit-btn"
          onClick={handleGetAnswer}
          disabled={loading}
        >
          {loading ? "Loading..." : "Submit"}
        </button>
      </section>
      <section className="output-section">
        {error && <p className="error">{error}</p>}
        {answer && <p className="answer">{answer}</p>}
      </section>
    </div>
  );
};

export default QAComponent;
