import mongoose from "mongoose";

const jobSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  company: {
    type: String,
    required: true,
    trim: true,
  },
  location: {
    type: String,
    default: "Remote",
  },
  link: {
    type: String,
    required: true,
    trim: true,
  },
  tags: {
    type: [String],
    default: [],
  },
  description: {
    type: String,
    default: "",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  type: {
    type: String,
    enum: ["Full Time", "Part Time", "Internship", "Contract"],
    default: "Full Time",
  },
  
  source: {
    type: String,
    default: "User Submitted",
  },
  isExternal: {
    type: Boolean,
    default: false,
  },
  externalPostedDate: {
    type: Date,
  },
  salary: {
    type: String,
  },
  views: {
    type: Number,
    default: 0,
  },
  verified: {
    type: Boolean,
    default: false,
  },
  featured: {
    type: Boolean,
    default: false,
  },
  
  postedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});


jobSchema.index({ title: 'text', company: 'text', description: 'text' });
jobSchema.index({ type: 1, location: 1 });
jobSchema.index({ tags: 1 });
jobSchema.index({ createdAt: -1 });
jobSchema.index({ source: 1, isExternal: 1 });

const JobModel = mongoose.models.Job || mongoose.model("Job", jobSchema);
export default JobModel;
