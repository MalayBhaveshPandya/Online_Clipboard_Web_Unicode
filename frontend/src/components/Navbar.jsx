import { useState } from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="navbar">
      <div className="nav-container">
        <div className="logo">
          <h1>Online Clipboard</h1>
        </div>

        {/* Hamburger Icon */}
        <div
          className={`hamburger ${isOpen ? "open" : ""}`}
          onClick={() => setIsOpen(!isOpen)}
        >
          <span></span>
          <span></span>
          <span></span>
        </div>

        {/* Links */}
        <div className={`nav-links ${isOpen ? "show" : ""}`}>
          <Link to="/" onClick={() => setIsOpen(false)}>
            Home
          </Link>
          <Link to="/register" onClick={() => setIsOpen(false)}>
            Register
          </Link>
          <Link to="/login" onClick={() => setIsOpen(false)}>
            Login
          </Link>
        </div>
      </div>
    </nav>
  );
}
