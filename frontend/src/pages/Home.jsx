import React, { useState } from "react";
import { Link } from "react-router-dom";
import { clipboardAPI } from "../utils/api";
import "./Home.css";

export default function Home() {
  const [message, setMessage] = useState("");
  const [code, setCode] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [retrieving, setRetrieving] = useState(false);
  const [generatedCode, setGeneratedCode] = useState("");
  const [retrievedContent, setRetrievedContent] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    if (!message.trim()) return;
    setSubmitting(true);
    setError("");
    setGeneratedCode("");

    try {
      const response = await clipboardAPI.createClipboard(message);
      setGeneratedCode(response.code);
      setMessage("");
      console.log("Content shared successfully with code:", response.code);
    } catch (error) {
      console.error("Submit error:", error);
      setError(typeof error === "string" ? error : "Failed to share content");
    } finally {
      setSubmitting(false);
    }
  };

  const handleRetrieve = async () => {
    if (!code.trim()) return;
    setRetrieving(true);
    setError("");
    setRetrievedContent("");

    try {
      const response = await clipboardAPI.getClipboard(code);
      setRetrievedContent(response.text);
      setCode("");
      console.log("Content retrieved successfully:", response.text);
    } catch (error) {
      console.error("Retrieve error:", error);
      setError(
        typeof error === "string" ? error : "Failed to retrieve content"
      );
    } finally {
      setRetrieving(false);
    }
  };

  return (
    <div className="home-container">
      <div className="home-content">
        {/* <h1 className="home-title">Online Clipboard</h1> */}
        <p className="home-subtitle">Share and retrieve content instantly</p>

        {/* Share Section */}
        <div className="section">
          <h2 className="section-title">Share Your Content</h2>
          <div className="input-group">
            <textarea
              className="textarea-field"
              placeholder="Enter your message, text, or any content you want to share..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
          </div>
          <button
            className="btn btn-primary"
            onClick={handleSubmit}
            disabled={submitting || !message.trim()}
          >
            {submitting ? "Sharing..." : "Share Content"}
          </button>

          {generatedCode && (
            <div className="success-message">
              <p>
                <strong> Content shared successfully!</strong>
              </p>
              <div className="code-display-container">
                <label>Your Retrieval Code:</label>
                <div className="code-display">
                  <span className="generated-code">{generatedCode}</span>
                  <button
                    className="copy-btn"
                    onClick={() => {
                      navigator.clipboard.writeText(generatedCode);
                      console.log("Code copied to clipboard!");
                    }}
                    title="Copy to clipboard"
                  >
                    Copy
                  </button>
                </div>
              </div>
              <p className="expiry-warning">
                <small>Code will expire in 2 minutes</small>
              </p>
              <p className="share-instruction">
                <small>
                  Share this code with others to let them access your content!
                </small>
              </p>
            </div>
          )}
        </div>

        {/* Retrieve Section */}
        <div className="section">
          <h2 className="section-title">Retrieve Content</h2>
          <div className="input-group">
            <input
              className="input-field"
              type="text"
              placeholder="Enter the access code to retrieve content..."
              value={code}
              onChange={(e) => setCode(e.target.value)}
            />
          </div>
          <button
            className="btn btn-secondary"
            onClick={handleRetrieve}
            disabled={retrieving || !code.trim()}
          >
            {retrieving ? "Retrieving..." : "Retrieve Content"}
          </button>

          {retrievedContent && (
            <div className="retrieved-content">
              <h3>Retrieved Content:</h3>
              <div className="content-display">{retrievedContent}</div>
            </div>
          )}
        </div>

        {/* Error Display */}
        {error && (
          <div className="error-message">
            <p>
              <strong>Error:</strong> {error}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
