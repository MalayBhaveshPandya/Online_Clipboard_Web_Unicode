import React from "react";

export default function ShareForm({
  message,
  setMessage,
  recipientUsername,
  setRecipientUsername,
  onSubmit,
  submitting,
  generatedCode,
  onCopy,
  lastRecipient,
}) {
  return (
    <div className="section share-section">
      <h2 className="section-title">Share Your Content</h2>
      <div className="input-group">
        <textarea
          className="textarea-field"
          placeholder="Enter your message, text, or any content you want to share..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
      </div>
      <div className="input-group">
        <input
          className="input-field"
          type="text"
          placeholder="Recipient username (deliver only to this user)"
          value={recipientUsername}
          onChange={(e) => setRecipientUsername(e.target.value)}
        />
      </div>
      <button
        className="btn btn-primary"
        onClick={onSubmit}
        disabled={submitting || !message.trim()}
      >
        {submitting ? "Sharing..." : "Share Content"}
      </button>

      {generatedCode && (
        <div className="success-message">
          <p>
            <strong>Content shared successfully!</strong>
          </p>
          <div className="code-display-container">
            <label>Your Retrieval Code:</label>
            <div className="code-display">
              <span className="generated-code">{generatedCode}</span>
              <button
                className="copy-btn"
                onClick={onCopy}
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
              {lastRecipient
                ? `Only user '${lastRecipient}' can retrieve this content.`
                : "Anyone with this code can retrieve the content."}
            </small>
          </p>
        </div>
      )}
    </div>
  );
}
