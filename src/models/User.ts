import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
{
    username : {
        type : String,
        required : true,
        unique : true,
        trim : true,
        lowercase: true,
    },
     email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
    },
     passwordHash: {
        type: String,
        required: true,
    },
    preferredLanguage: {
        type: String,
        required: true,
        default: "en",
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
},
  { timestamps: true }
)

export const User = mongoose.model("User" , UserSchema)