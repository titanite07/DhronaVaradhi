import mongoose from "mongoose";

// Connect to MongoDB
async function dbConnect() {
  const MONGODB_URI = "mongodb://localhost:27017/DhronaVaradhi";
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.log(error);
  }
}

// Job Schema
const jobSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  company: { type: String, required: true, trim: true },
  location: { type: String, default: "Remote" },
  link: { type: String, required: true, trim: true },
  tags: { type: [String], default: [] },
  description: { type: String, default: "" },
  createdAt: { type: Date, default: Date.now },
  type: {
    type: String,
    enum: ["Full Time", "Part Time", "Internship", "Contract"],
    default: "Full Time",
  },
});

const JobModel = mongoose.models.Job || mongoose.model("Job", jobSchema);

const sampleJobs = [
  {
    title: "Senior Frontend Developer",
    company: "TechCorp",
    location: "Remote",
    link: "https://example.com/job1",
    description: "Join our amazing team to build the next generation of web applications using React, TypeScript, and modern tools.",
    type: "Full Time",
    tags: ["React", "TypeScript", "Remote"]
  },
  {
    title: "UX/UI Designer",
    company: "Design Studio",
    location: "San Francisco",
    link: "https://example.com/job2", 
    description: "We're looking for a creative designer to help shape user experiences for our flagship products.",
    type: "Full Time",
    tags: ["Design", "Figma", "User Experience"]
  },
  {
    title: "Backend Engineer Intern",
    company: "StartupXYZ",
    location: "Hybrid",
    link: "https://example.com/job3",
    description: "Great opportunity for students to learn backend development with Node.js and databases.",
    type: "Internship", 
    tags: ["Node.js", "MongoDB", "Internship"]
  },
  {
    title: "Product Manager",
    company: "InnovateCo",
    location: "New York",
    link: "https://example.com/job4",
    description: "Lead product strategy and work with cross-functional teams to deliver amazing user experiences.",
    type: "Full Time",
    tags: ["Product Management", "Strategy", "Leadership"]
  },
  {
    title: "DevOps Consultant",
    company: "CloudSolutions",
    location: "Remote",
    link: "https://example.com/job5",
    description: "Help companies modernize their infrastructure with cloud-native solutions and CI/CD pipelines.",
    type: "Contract",
    tags: ["DevOps", "AWS", "Docker", "Remote"]
  }
];

async function seedJobs() {
  try {
    await dbConnect();
    console.log("Connected to MongoDB");
    
    // Clear existing jobs
    await JobModel.deleteMany({});
    console.log("Cleared existing jobs");
    
    // Insert sample jobs
    const insertedJobs = await JobModel.insertMany(sampleJobs);
    console.log(`Inserted ${insertedJobs.length} sample jobs`);
    
    process.exit(0);
  } catch (error) {
    console.error("Error seeding jobs:", error);
    process.exit(1);
  }
}

seedJobs();
