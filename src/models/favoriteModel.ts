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
    
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});


favoriteSchema.index({ jobId: 1, userIdentifier: 1 }, { unique: true });

const FavoriteModel = mongoose.models.Favorite || mongoose.model("Favorite", favoriteSchema);
export default FavoriteModel;
