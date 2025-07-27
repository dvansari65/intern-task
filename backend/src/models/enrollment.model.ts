import mongoose, { Document } from "mongoose";

export interface IEnroll extends Document {
  user: mongoose.Types.ObjectId;
  project: mongoose.Types.ObjectId;
  status: "pending" | "interview_scheduled" | "approved" | "rejected";
  interview: {
    scheduled: boolean;
    msTeamsEmail?: string;
    meetingLink?: string;
    scheduledAt?: Date;
  };
  llmScore: {
    type: number;
    reason: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

const EnrollScheme = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: [true, "User is required!"],
  },
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Project",
    required: [true, "Please select the project!"],
  },
  status: {
    type: String,
    enum: ["pending", "interview_scheduled", "approved", "rejected"],
    default: "pending",
  },
  interview: {
    scheduled: { 
      type: Boolean, 
      default: false 
    },
    msTeamsEmail: { 
      type: String,
      trim: true 
    },
    meetingLink: { 
      type: String,
      trim: true 
    },
    scheduledAt: { 
      type: Date 
    },
  },
  llmScore: {
    type: {
      type: Number,
      min: [0, "Score cannot be negative"],
      max: [100, "Score cannot exceed 100"]
    },
    reason: {
      type: String,
      minlength: [8, "Reason should be more than 8 characters"],
      trim: true
    }
  }
}, { timestamps: true });

// Prevent duplicate enrollments for the same user-project combination
EnrollScheme.index({ user: 1, project: 1 }, { unique: true });

export const Enroll = mongoose.model<IEnroll>('Enroll', EnrollScheme);