import React, { useState } from "react";
import axios from "axios";
import "./QAComponent.css";

enum InputType {
  ContextText = 1,
  DocumentUpload,
  WebsiteLink,
}

const API_ENDPOINT = "http://127.0.0.1:8000"

const QAComponent = () => {
  const [context, setContext] = useState<string>("");
  const [question, setQuestion] = useState<string>("");
  const [answer, setAnswer] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [file, setFile] = useState<File | null>(null);
  const [inputType, setInputType] = useState<InputType>(InputType.ContextText);
  const [websiteLink, setWebsiteLink] = useState<string>("");

  const handleGetAnswer = async () => {
    setLoading(true);
    setError("");

    const data = {
      context: context,
      question: question,
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
        <h1>Nepali Question Answering System</h1>
      </header>
      <section className="input-section">
        <div>
          <button
            className={`input-section-button ${
              inputType == InputType.ContextText ? "blue" : ""
            }`}
            onClick={() => {
              setInputType(InputType.ContextText);
            }}
          >
            Context Text
          </button>
          <button
            className={`input-section-button ${
              inputType == InputType.DocumentUpload ? "blue" : ""
            }`}
            onClick={() => setInputType(InputType.DocumentUpload)}
          >
            Document Upload
          </button>
          <button
            className={`input-section-button ${
              inputType == InputType.WebsiteLink ? "blue" : ""
            }`}
            onClick={() => setInputType(InputType.WebsiteLink)}
          >
            Website Link
          </button>
        </div>

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
        {inputType == InputType.DocumentUpload && (
          <div className="fileupload-section">
            <form onSubmit={handleFileUpload}>
              <input
                type="file"
                onChange={handleFileInputChange}
                className="fileupload-input"
              />
              <button type="submit" className="fileupload-submit">
                Upload
              </button>
            </form>
          </div>
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
        <input
          className="input-field"
          type="text"
          placeholder="Enter your question"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
        />
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
