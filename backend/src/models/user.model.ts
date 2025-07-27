import mongoose, { Document, Schema } from "mongoose";
import bcrypt from "bcrypt";
export interface IUser extends Document {
  userName: string;
  email: string;
  password: string;
}

const UserSchema = new mongoose.Schema(
  {
    userName: {
      type: String,
      unique: true,
      minlength: [3, "please enter minimum 3 characters"],
      required: true,
    },
    email: {
      type: String,
      unique: true,
      lowercase: true,
      required: [true, "Email is required"],
      trim: true,
    },
    password: {
      type: String,
      trim: true,
      required: [true, "password is required!"],
      minlength: [8, "Password must be at least 8 characters long"],
    },
    skills: [
      {
        type: String,
      },
    ],
    education: {
      type: String,
    },
    experience: {
      type: String,
    },
  },
  { timestamps: true }
);

UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  console.log("Password hashed successfully");
  next();
});

UserSchema.methods.isPasswordCorrect = async function (password: string) {
  try {
    const isMatch = await bcrypt.compare(password, this.password);
    console.log("Password comparison result:", isMatch);
    return isMatch;
  } catch (error) {
    console.error("Error comparing passwords:", error);
    throw error;
  }
};

export const User = mongoose.model<IUser>("User", UserSchema);
