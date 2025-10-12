import { useEffect, useState } from "react";
import { clipboardAPI } from "../utils/api";
import api from "../utils/api";
import "./Dashboard.css";
import ShareForm from "../components/ShareForm";
import RetrieveForm from "../components/RetrieveForm";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [message, setMessage] = useState("");
  const [code, setCode] = useState("");
  const [recipientUsername, setRecipientUsername] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [retrieving, setRetrieving] = useState(false);
  const [generatedCode, setGeneratedCode] = useState("");
  const [retrievedContent, setRetrievedContent] = useState("");
  const [error, setError] = useState("");
  const [lastRecipient, setLastRecipient] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      console.error("No token found");
      return;
    }
    console.log("Token being sent:", token);
    api
      .get("/auth/dashboard")
      .then((res) => {
        console.log("Dashboard response:", res.data);
        setUser(res.data);
      })
      .catch((err) => {
        console.error("Dashboard error:", err.response?.data || err.message);
      });
  }, []);

  const handleSubmit = async () => {
    if (!message.trim()) return;
    setSubmitting(true);
    setError("");
    setGeneratedCode("");

    try {
      const response = await clipboardAPI.createClipboard(
        message,
        [],
        recipientUsername || null
      );
      setGeneratedCode(response.code);
      setMessage("");
      setLastRecipient(recipientUsername || null);
      setRecipientUsername("");
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
    <div className="dashboard-container">
      <div className="page-box dashboard-content fade-in">
        <h1 className="dashboard-title">Online Clipboard</h1>
        {user ? (
          <p className="welcome-message">Welcome back, {user.name}!</p>
        ) : (
          <p className="welcome-message">Welcome to your dashboard!</p>
        )}

        <ShareForm
          message={message}
          setMessage={setMessage}
          recipientUsername={recipientUsername}
          setRecipientUsername={setRecipientUsername}
          onSubmit={handleSubmit}
          submitting={submitting}
          generatedCode={generatedCode}
          onCopy={() => navigator.clipboard.writeText(generatedCode)}
          lastRecipient={lastRecipient}
        />

        <RetrieveForm
          code={code}
          setCode={setCode}
          onRetrieve={handleRetrieve}
          retrieving={retrieving}
          retrievedContent={retrievedContent}
        />

        {error && (
          <div className="error-message">
            <p>
              <strong>❌Error:</strong> {error}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
