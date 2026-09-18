import express from "express";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import "dotenv/config";
import User from "../lib/models/User.ts";

const router = express.Router();

const generateToken = (userId: string) =>
  jwt.sign({ userId }, process.env.JWT_SECRET!, { expiresIn: "7d" });

// Emails are stored lowercase (see the User model), so normalise what the
// client sends before every lookup — "Jane@Mail.com" and "jane@mail.com"
// are the same account.
const normalizeEmail = (email: unknown) => String(email ?? "").trim().toLowerCase();

const publicUser = (u: any) => ({
  id: u._id,
  email: u.email,
  fullName: u.fullName,
});

router.post("/register", async (req, res) => {
  try {
    const { password, fullName } = req.body ?? {};
    const email = normalizeEmail(req.body?.email);
    if (!email || !password || !fullName) {
      return res.status(400).json({ message: "Please provide all required fields" });
    }
    if (String(password).length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters long" });
    }

    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: "An account with this email already exists" });

    const user = new User({ email, password, fullName: String(fullName).trim() });
    await user.save();

    const token = generateToken(user._id.toString());
    res.status(201).json({ token, user: publicUser(user) });
  } catch (error) {
    console.error("Error in register:", error);
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { password } = req.body ?? {};
    const email = normalizeEmail(req.body?.email);
    if (!email || !password) return res.status(400).json({ message: "Please provide email and password" });

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const ok = await user.comparePassword(String(password));
    if (!ok) return res.status(400).json({ message: "Invalid credentials" });

    const token = generateToken(user._id.toString());
    res.json({ token, user: publicUser(user) });
  } catch (error) {
    console.error("Error in login:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// POST /api/auth/forgot-password — generates a reset token.
//
// IMPORTANT: no email service is wired up yet, so this returns the raw
// token directly in the response for development. In production this
// token must be emailed to the user instead (e.g. via Resend, Postmark,
// or Nodemailer + SMTP) and never returned in the API response — returning
// it here is a deliberate, temporary shortcut for local testing, not a
// pattern to ship as-is.
router.post("/forgot-password", async (req, res) => {
  try {
    const email = normalizeEmail(req.body?.email);
    if (!email) return res.status(400).json({ message: "Email is required" });

    const user = await User.findOne({ email });
    // Always respond the same way whether or not the account exists, so a
    // caller can't use this endpoint to discover which emails are registered.
    if (!user) {
      return res.json({
        message: "If an account exists for that email, a reset code has been generated.",
      });
    }

    const rawToken = crypto.randomBytes(3).toString("hex").toUpperCase(); // e.g. "A1B2C3"
    const tokenHash = crypto.createHash("sha256").update(rawToken).digest("hex");

    user.resetPasswordTokenHash = tokenHash;
    user.resetPasswordExpires = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes
    await user.save();

    res.json({
      message: "If an account exists for that email, a reset code has been generated.",
      // DEV ONLY — remove this field once real email sending is wired up.
      devResetCode: rawToken,
    });
  } catch (error) {
    console.error("Error in forgot-password:", error);
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/reset-password", async (req, res) => {
  try {
    const { code, newPassword } = req.body ?? {};
    const email = normalizeEmail(req.body?.email);
    if (!email || !code || !newPassword) {
      return res.status(400).json({ message: "Email, code, and new password are required" });
    }
    if (String(newPassword).length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters long" });
    }

    const user = await User.findOne({ email }).select("+resetPasswordTokenHash +resetPasswordExpires");
    if (!user || !user.resetPasswordTokenHash || !user.resetPasswordExpires) {
      return res.status(400).json({ message: "Invalid or expired reset code" });
    }
    if (user.resetPasswordExpires.getTime() < Date.now()) {
      return res.status(400).json({ message: "Invalid or expired reset code" });
    }

    const candidateHash = crypto.createHash("sha256").update(String(code).toUpperCase()).digest("hex");
    if (candidateHash !== user.resetPasswordTokenHash) {
      return res.status(400).json({ message: "Invalid or expired reset code" });
    }

    user.password = String(newPassword); // re-hashed by the pre("save") hook
    user.resetPasswordTokenHash = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.json({ message: "Password updated — you can now sign in with your new password." });
  } catch (error) {
    console.error("Error in reset-password:", error);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
