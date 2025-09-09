import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  avatar: {
    type: String,
    default: "",
  },
  bio: {
    type: String,
    default: "",
    maxlength: 500,
  },
  location: {
    type: String,
    default: "",
  },
  website: {
    type: String,
    default: "",
  },
  github: {
    type: String,
    default: "",
  },
  linkedin: {
    type: String,
    default: "",
  },
  twitter: {
    type: String,
    default: "",
  },
  skills: {
    type: [String],
    default: [],
  },
  experience: {
    type: String,
    enum: ["Fresher", "1-2 years", "3-5 years", "5-10 years", "10+ years"],
    default: "Fresher",
  },
  lookingFor: {
    type: [String],
    enum: ["Full Time", "Part Time", "Internship", "Contract", "Freelance"],
    default: [],
  },
  preferredLocations: {
    type: [String],
    default: [],
  },
  salaryExpectation: {
    min: { type: Number },
    max: { type: Number },
    currency: { type: String, default: "USD" },
  },
  emailVerified: {
    type: Boolean,
    default: false,
  },
  emailVerificationToken: {
    type: String,
  },
  passwordResetToken: {
    type: String,
  },
  passwordResetExpires: {
    type: Date,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  lastLogin: {
    type: Date,
  },
  notifications: {
    email: {
      newJobs: { type: Boolean, default: true },
      weeklyDigest: { type: Boolean, default: true },
      jobAlerts: { type: Boolean, default: true },
      messages: { type: Boolean, default: true },
    },
    push: {
      newJobs: { type: Boolean, default: false },
      messages: { type: Boolean, default: true },
    },
  },
  jobAlertPreferences: {
    keywords: { type: [String], default: [] },
    locations: { type: [String], default: [] },
    jobTypes: { type: [String], default: [] },
    frequency: { 
      type: String, 
      enum: ["immediate", "daily", "weekly"], 
      default: "daily" 
    },
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


userSchema.index({ email: 1 });
userSchema.index({ skills: 1 });
userSchema.index({ "jobAlertPreferences.keywords": 1 });


userSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});


userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error as Error);
  }
});


userSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch {
    return false;
  }
};


userSchema.methods.getPublicProfile = function() {
  return {
    _id: this._id,
    name: this.name,
    avatar: this.avatar,
    bio: this.bio,
    location: this.location,
    website: this.website,
    github: this.github,
    linkedin: this.linkedin,
    twitter: this.twitter,
    skills: this.skills,
    experience: this.experience,
    createdAt: this.createdAt,
  };
};

const UserModel = mongoose.models.User || mongoose.model("User", userSchema);
export default UserModel;
