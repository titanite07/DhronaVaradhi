import mongoose from "mongoose";

const favoriteSchema = new mongoose.Schema({
  jobId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Job",
    required: true,
  },
  userIdentifier: {
    type: String,
    required: true,
    // This can be IP address, session ID, or user ID when auth is implemented
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Create compound index to prevent duplicate favorites
favoriteSchema.index({ jobId: 1, userIdentifier: 1 }, { unique: true });

const FavoriteModel = mongoose.models.Favorite || mongoose.model("Favorite", favoriteSchema);
export default FavoriteModel;
