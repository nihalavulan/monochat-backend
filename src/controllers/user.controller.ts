import { Request, Response } from "express";
import { User } from "../models/User";


interface AuthRequest extends Request {
  userId?: string;
}

export const searchWithUsername = async (req : AuthRequest, res: Response) => {
  try {
    const { username } = req.query;

    if (!username || typeof username !== "string") {
      return res.status(400).json({ message: "Username query parameter is required" });
    }

    const users = await User.find({
      username: { $regex: new RegExp(username, "i") },
    }).select("_id username createdAt updatedAt");


    const filteredUsers = users.filter(user => user._id.toString() !== req.userId);

    return res.status(200).json({ users: filteredUsers });
  } catch (error) {
    console.error("Search users error:", error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
}


export const getUserDetails = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.params.id;

    const user = await User.findById(userId).select(
      "_id username email preferredLanguage isVerified createdAt updatedAt"
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({ user });
  } catch (error) {
    console.error("Get user details error:", error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
}