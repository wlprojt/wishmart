// src/models/User.ts
import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    name: String,
    email: { type: String, unique: true },
    password: String,

    emailVerified: {
      type: Boolean,
      default: false,
    },

    resetPasswordToken: String,
    resetPasswordExpires: Date,


    emailOTP: String,
    emailOTPExpires: Date,
  },
  { timestamps: true }
);

export default mongoose.models.User ||
  mongoose.model("User", UserSchema);