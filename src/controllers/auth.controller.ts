import { Request, Response } from "express";
import { User } from "../models/User";
import bcrypt from "bcrypt";
import crypto from "crypto";
import { VerificationToken } from "../models/VerificationToken";

export const registerUser = async (req: Request, res: Response) => {
  try {
    const { username, email, password, preferredLanguage } = req.body;

    if (!username || !email || !password || !preferredLanguage) {
      return res.status(400).json({ message: "All field are required" });
    }

    const existingUser = await User.findOne({
      $or: [{ email }, { username }],
    });

    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await User.create({
      username,
      email,
      passwordHash,
      preferredLanguage,
      isVerified: false,
    });

    const token = crypto.randomBytes(32).toString("hex");

    await VerificationToken.create({
      userId: user._id,
      token,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
    });

    const verificationLink = `http://localhost:${process.env.PORT}/auth/verify?token=${token}`;

    console.log("Verify user by visiting:", verificationLink);

    return res.status(201).json({
      message: "Signup successful. Please verify your email.",
    });
  } catch (error) {
    console.error("Signup error:", error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};
