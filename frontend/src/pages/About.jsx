import React from "react";
import "./About.css";

export default function About() {
  return (
    <div className="about-container">
      <div className="page-box about-content">
        <h1>About Online Clipboard</h1>
        <p>
          Online Clipboard is a lightweight tool for sharing short pieces of
          text quickly and securely. Create a clipboard entry and share its
          generated code with others. Optionally deliver a clipboard to a
          specific user so only they can retrieve it.
        </p>

        <h3>Features</h3>
        <ul>
          <li>Create temporary clipboards with expiry</li>
          <li>Optional recipient-only delivery</li>
          <li>Copy retrieval codes to clipboard</li>
          <li>Simple, privacy-minded design</li>
        </ul>

        <h3>About the Author</h3>
        <p>
          Built by Malay Bhavesh Pandya as a learning project to demonstrate a
          fullstack Node + React app with authentication and secure shared
          content.
        </p>

        <h3>Contact</h3>
        <p>
          For feedback or issues, open an issue in the repository or contact the
          author directly.
        </p>
      </div>
    </div>
  );
}
