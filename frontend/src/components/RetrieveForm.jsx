import React from "react";

export default function RetrieveForm({
  code,
  setCode,
  onRetrieve,
  retrieving,
  retrievedContent,
}) {
  return (
    <div className="section retrieve-section">
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
        onClick={onRetrieve}
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
  );
}
