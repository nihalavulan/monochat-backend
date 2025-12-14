import { VerificationToken } from "../models/VerificationToken";
import { User } from "../models/User";
import crypto from "crypto";
import { Types } from "mongoose";


export const createVerifcationToken = async (userId: Types.ObjectId) => {
  const token = crypto.randomBytes(32).toString("hex");

  await VerificationToken.create({
    userId: userId,
    token,
    expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
  });

  return token;
};

export const verifyUserByToken = async (token: string) => {
  const verificationToken = await VerificationToken.findOne({ token });

  if (!verificationToken) {
    throw new Error("Invalid or expired token");
  }

  if (verificationToken.expiresAt < new Date()) {
    await VerificationToken.deleteOne({ _id: verificationToken._id });
    throw new Error("Token expired");
  }

  await User.updateOne({ _id: verificationToken.userId }, { isVerified: true });

  await VerificationToken.deleteOne({ _id: verificationToken._id });
};
