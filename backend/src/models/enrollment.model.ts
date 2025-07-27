import mongoose from "mongoose";

const EnrollScheme = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "user is required!"],
    },
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: [true, "please select the project!"],
    },
    status: {
      type: String,
      enum: ["pending", "interview_scheduled", "approved", "rejected"],
      default: "pending",
    },
    interview: {
      scheduled: { type: Boolean, default: false },
      msTeamsEmail: { type: String },
      meetingLink: { type: String },
      scheduledAt: { type: Date },
    },
    llmScore:{
        type:Number,
        reason:String,
        minlength:[8,"reason should be more than 8 characters"]
    }
  },
  { timestamps: true }
);
export const Enroll = mongoose.model('Enroll', EnrollScheme);
