import mongoose from "mongoose";

const trackedJobSchema = new mongoose.Schema({
  jobId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Job",
    required: true,
  },
  userIdentifier: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ["saved", "applied", "interviewing", "offered", "rejected"],
    default: "saved",
  },
  notes: {
    type: String,
    default: "",
  },
  applicationDate: {
    type: Date,
  },
  interviewDate: {
    type: Date,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Compound index to ensure one entry per user per job
trackedJobSchema.index({ jobId: 1, userIdentifier: 1 }, { unique: true });

const TrackedJobModel = mongoose.models.TrackedJob || mongoose.model("TrackedJob", trackedJobSchema);

export default TrackedJobModel;
