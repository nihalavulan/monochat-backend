import { Request, Response } from "express";
import { User } from "../models/User";
import crypto from "crypto";
import { VerificationToken } from "../models/VerificationToken";
import { comparePassword, hashPassword } from "../helpers/password.helper";
import {
  createVerifcationToken,
  verifyUserByToken,
} from "../helpers/verification.helper";
import { generateJWT } from "../helpers/jwt.helper";

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

    const passwordHash = await hashPassword(password);

    const user = await User.create({
      username,
      email,
      passwordHash,
      preferredLanguage,
      isVerified: false,
    });

    const token = await createVerifcationToken(user._id);

    const verificationLink = `http://localhost:${process.env.PORT}/api/v1/auth/verify?token=${token}`;

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

export const verifyUser = async (req: Request, res: Response) => {
  try {
    const { token } = req.query;

    if (!token || typeof token !== "string") {
      return res.status(400).json({
        message: "Verification token is required",
      });
    }

    await verifyUserByToken(token);

    return res.status(200).json({
      message: "Account verified successfully. You can now log in.",
    });
  } catch (error) {
    console.error("Signup error:", error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const loginUser = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: "All field are required" });
    }

    const userDetails = await User.findOne({ username });

    if (!userDetails || !userDetails.isVerified) {
      return res.status(400).json({ message: "No user found or not verified" });
    }

    const passwordMatch = await comparePassword(
      password,
      userDetails.passwordHash
    );

    if (!passwordMatch) {
      return res.status(400).json({ message: "Passowrd does not match" });
    }

    const token = generateJWT({
      userId: userDetails._id.toString(),
    });

    return res.status(200).json({
      token,
      user: {
        id: userDetails._id,
        username: userDetails.username,
        email: userDetails.email,
        preferredLanguage: userDetails.preferredLanguage,
      },
    });
  } catch (error) {
    console.error("Signup error:", error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};
