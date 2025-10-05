const express = require("express");
const Clipboard = require("../models/Clipboard");
const crypto = require("crypto");
const { authMiddleware } = require("../middleware/auth");

const router = express.Router();

router.post("/", authMiddleware, async (req, res) => {
  try {
    console.log("User from middleware:", req.user);
    const { text, tags, recipientUsername } = req.body;
    const code = crypto.randomBytes(4).toString("hex");
    const expiry = new Date(Date.now() + 2 * 60 * 1000);

    // Optionally resolve recipient username to user id
    let recipientId = null;
    if (recipientUsername) {
      const User = require('../models/User');
      const recipientUser = await User.findOne({ name: recipientUsername });
      if (!recipientUser) return res.status(400).json({ error: 'Recipient user not found' });
      recipientId = recipientUser._id;
    }

    const clipboard = await Clipboard.create({
      owner: req.user.id,
      recipient: recipientId,
      text,
      code,
      tags: tags || [],
      expiry
    });
    res.json({ message: "Saved", code });
  } catch (err) {
    console.error("Clipboard creation error:", err.message);
    res.status(400).json({ error: err.message });
  }
});


router.get("/", authMiddleware, async (req, res) => {
  try {
    console.log("Getting clipboards for user:", req.user);
    const clipboards = await Clipboard.find({ 
      owner: req.user.id,
      expiry: { $gt: Date.now() } 
    }).sort({ createdAt: -1 }).limit(10);
    
    res.json(clipboards.map(clip => ({
      id: clip._id,
      code: clip.code,
      text: clip.text.substring(0, 50) + (clip.text.length > 50 ? '...' : ''),
      tags: clip.tags,
      createdAt: clip.createdAt,
      expiry: clip.expiry,
      recipient: clip.recipient || null
    })));
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.get("/:code", async (req, res) => {
  try {
    const clipboard = await Clipboard.findOne({ code: req.params.code });
    if (!clipboard) return res.status(404).json({ error: "Not found" });
    if (clipboard.expiry < Date.now()) {
      await Clipboard.deleteOne({ _id: clipboard._id });
      return res.status(410).json({ error: "Expired" });
    }

    // If clipboard has a recipient set, require authentication and allow only the recipient
    if (clipboard.recipient) {
      // expect Authorization Bearer token
      const authHeader = req.headers['authorization'];
      if (!authHeader) return res.status(401).json({ error: 'Authorization required to access this clipboard' });
      try {
        const jwt = require('jsonwebtoken');
        const decoded = jwt.verify(authHeader.split(' ')[1], process.env.JWT_SECRET || 'IamMalayPandya');
        const requesterId = decoded.user?.id || decoded.id || null;
        if (!requesterId) return res.status(401).json({ error: 'Invalid token' });
        // Allow only if requester is the recipient
        if (requesterId.toString() !== clipboard.recipient.toString()) {
          return res.status(403).json({ error: 'Access denied: only the specified recipient can retrieve this clipboard' });
        }
      } catch (e) {
        return res.status(401).json({ error: 'Invalid token' });
      }
    }

    res.json({ text: clipboard.text });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
