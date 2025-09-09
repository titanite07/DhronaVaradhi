import mongoose from "mongoose";


async function dbConnect() {
  const MONGODB_URI = "mongodb://localhost:27017/jobshare";
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.log(error);
  }
}


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
    link: "https://github.com/jobs",
    description: "Join our amazing team to build the next generation of web applications using React, TypeScript, and modern tools.",
    type: "Full Time",
    tags: ["React", "TypeScript", "Remote"]
  },
  {
    title: "UX/UI Designer",
    company: "Design Studio",
    location: "San Francisco",
    link: "https://stackoverflow.com/jobs", 
    description: "We're looking for a creative designer to help shape user experiences for our flagship products.",
    type: "Full Time",
    tags: ["Design", "Figma", "User Experience"]
  },
  {
    title: "Backend Engineer Intern",
    company: "StartupXYZ",
    location: "Hybrid",
    link: "https://linkedin.com/jobs",
    description: "Great opportunity for students to learn backend development with Node.js and databases.",
    type: "Internship", 
    tags: ["Node.js", "MongoDB", "Internship"]
  },
  {
    title: "Product Manager",
    company: "InnovateCo",
    location: "New York",
    link: "https://indeed.com",
    description: "Lead product strategy and work with cross-functional teams to deliver amazing user experiences.",
    type: "Full Time",
    tags: ["Product Management", "Strategy", "Leadership"]
  },
  {
    title: "DevOps Consultant",
    company: "CloudSolutions",
    location: "Remote",
    link: "https://glassdoor.com",
    description: "Help companies modernize their infrastructure with cloud-native solutions and CI/CD pipelines.",
    type: "Contract",
    tags: ["DevOps", "AWS", "Docker", "Remote"]
  },
  {
    title: "Full Stack Developer",
    company: "WebTech Solutions",
    location: "Boston",
    link: "https://google.com/careers",
    description: "Work on exciting projects using modern technologies including React, Node.js, and cloud platforms.",
    type: "Full Time",
    tags: ["JavaScript", "React", "Node.js", "Full Stack"]
  },
  {
    title: "Data Scientist",
    company: "DataVision Inc",
    location: "Remote",
    link: "https://microsoft.com/careers",
    description: "Analyze complex datasets and build machine learning models to drive business insights.",
    type: "Full Time",
    tags: ["Python", "Machine Learning", "Data Analysis", "Remote"]
  },
  {
    title: "Mobile App Developer",
    company: "AppForge",
    location: "Austin",
    link: "https://apple.com/careers",
    description: "Build innovative mobile applications for iOS and Android platforms using React Native.",
    type: "Full Time",
    tags: ["React Native", "Mobile", "iOS", "Android"]
  }
];

async function seedJobs() {
  try {
    await dbConnect();
    console.log("Connected to MongoDB");
    
    
    await JobModel.deleteMany({});
    console.log("Cleared existing jobs");
    
    
    const insertedJobs = await JobModel.insertMany(sampleJobs);
    console.log(`Inserted ${insertedJobs.length} sample jobs`);
    
    process.exit(0);
  } catch (error) {
    console.error("Error seeding jobs:", error);
    process.exit(1);
  }
}

seedJobs();
