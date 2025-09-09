import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
  jobId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Job",
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  content: {
    type: String,
    required: true,
    trim: true,
    maxlength: 1000,
  },
  parentCommentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Comment",
    default: null,
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  }],
  dislikes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  }],
  isEdited: {
    type: Boolean,
    default: false,
  },
  editedAt: {
    type: Date,
  },
  isDeleted: {
    type: Boolean,
    default: false,
  },
  deletedAt: {
    type: Date,
  },
  reportCount: {
    type: Number,
    default: 0,
  },
  isHidden: {
    type: Boolean,
    default: false,
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


commentSchema.index({ jobId: 1, createdAt: -1 });
commentSchema.index({ userId: 1 });
commentSchema.index({ parentCommentId: 1 });


commentSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});


commentSchema.virtual('replyCount', {
  ref: 'Comment',
  localField: '_id',
  foreignField: 'parentCommentId',
  count: true,
});


commentSchema.methods.getLikeCount = function() {
  return this.likes.length;
};


commentSchema.methods.getDislikeCount = function() {
  return this.dislikes.length;
};


commentSchema.methods.isLikedBy = function(userId: string) {
  return this.likes.includes(userId);
};


commentSchema.methods.isDislikedBy = function(userId: string) {
  return this.dislikes.includes(userId);
};

const CommentModel = mongoose.models.Comment || mongoose.model("Comment", commentSchema);
export default CommentModel;
