import React, { useState } from "react";
import axios from "axios";
import "./QAComponent.css";

const QAComponent = () => {
  const [context, setContext] = useState("");
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    setLoading(true);
    setError("");

    try {
      // const response = await axios.post("API_ENDPOINT", {
      //   context,
      //   question,
      // });
      // setAnswer(response.data.answer);

      const temporaryAnswer = "This is a temporary answer.";
      setAnswer(temporaryAnswer);
    } catch (err) {
      setError("Failed to fetch answer. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <header>
        <h1>Nepali Question Answering System</h1>
      </header>
      <section className="input-section">
        <p className="input-section-heading">Context</p>
        <textarea
          className="context-field"
          placeholder="Enter context paragraph"
          value={context}
          onChange={(e) => setContext(e.target.value)}
          rows={1}
          style={{ minHeight: "100px" }}
          onInput={(e) => {
            e.target.style.height = "auto";
            e.target.style.height = `${e.target.scrollHeight}px`;
          }}
        />
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
          onClick={handleSubmit}
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
