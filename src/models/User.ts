// src/models/User.ts
import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, trim: true },

    email: {
      type: String,
      required: true,
      unique: true,
      index: true,
      lowercase: true,
      trim: true,
    },

    // 🔐 Password (local auth)
    passwordHash: { type: String },

    provider: {
      type: String,
      enum: ["local", "google"],
      default: "local",
    },

    image: { type: String },

    // 📧 Email verification
    emailVerified: {
      type: Boolean,
      default: false,
    },

    emailOTP: {
      type: String,
    },

    emailOTPExpires: {
      type: Date,
    },
  },
  { timestamps: true }
);

// 🔐 Enforce uniqueness at DB level
UserSchema.index({ email: 1 }, { unique: true });

export default mongoose.models.User ||
  mongoose.model("User", UserSchema);



  