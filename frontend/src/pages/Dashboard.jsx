import { useEffect, useState } from "react";
import { clipboardAPI } from "../utils/api";
import api from "../utils/api";
import "./Dashboard.css";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [code, setCode] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [retrieving, setRetrieving] = useState(false);
  const [generatedCode, setGeneratedCode] = useState("");
  const [retrievedContent, setRetrievedContent] = useState("");
  const [error, setError] = useState("");
  const [userClipboards, setUserClipboards] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      console.error("No token found");
      setLoading(false);
      return;
    }
    console.log("Token being sent:", token);
    api
      .get("/auth/dashboard")
      .then((res) => {
        console.log("Dashboard response:", res.data);
        setUser(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Dashboard error:", err.response?.data || err.message);
        setLoading(false);
      });
  }, []);

  const loadUserClipboards = async () => {
    setLoadingHistory(true);
    try {
      const clipboards = await clipboardAPI.getUserClipboards();
      setUserClipboards(clipboards);
    } catch (error) {
      console.error("Error loading clipboard history:", error);
      setError(
        typeof error === "string" ? error : "Failed to load clipboard history"
      );
    } finally {
      setLoadingHistory(false);
    }
  };

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
      // Refresh clipboard history
      loadUserClipboards();
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

  if (loading) {
    return (
      <div className="dashboard-container">
        <div className="dashboard-content">
          <p className="loading-message">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-content fade-in">
        <h1 className="dashboard-title">Online Clipboard</h1>
        {user ? (
          <p className="welcome-message">Welcome back, {user.name}!</p>
        ) : (
          <p className="welcome-message">Welcome to your dashboard!</p>
        )}

        {/* Share Section */}
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
                <strong>Content shared successfully!</strong>
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

        {/* Clipboard History Section */}
        <div className="section history-section">
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "20px",
            }}
          >
            <h2 className="section-title" style={{ margin: 0 }}>
              Your Recent Clipboards
            </h2>
            <button
              className="btn btn-outline"
              onClick={loadUserClipboards}
              disabled={loadingHistory}
              style={{ width: "auto", padding: "8px 16px", fontSize: "14px" }}
            >
              {loadingHistory ? "Loading..." : "Refresh"}
            </button>
          </div>

          {userClipboards.length > 0 ? (
            <div className="clipboard-history">
              {userClipboards.map((clip) => (
                <div key={clip.id} className="clipboard-item">
                  <div className="clipboard-header">
                    <span className="clipboard-code">Code: {clip.code}</span>
                    <span className="clipboard-date">
                      {new Date(clip.createdAt).toLocaleString()}
                    </span>
                  </div>
                  <div className="clipboard-preview">{clip.text}</div>
                  {clip.tags && clip.tags.length > 0 && (
                    <div className="clipboard-tags">
                      {clip.tags.map((tag, index) => (
                        <span key={index} className="tag">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                  <div className="clipboard-expiry">
                    Expires: {new Date(clip.expiry).toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="no-history">
              No clipboard entries found. Create your first one above!
            </p>
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
