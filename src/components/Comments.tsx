import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { 
  MessageCircle, 
  Send, 
  ThumbsUp, 
  Reply, 
  X,
  Clock
} from "lucide-react";
import { toast } from "sonner";

interface Comment {
  _id: string;
  content: string;
  userId: {
    _id: string;
    name: string;
    avatar?: string;
  };
  likes: string[];
  dislikes: string[];
  replies?: Comment[];
  replyCount: number;
  likeCount: number;
  dislikeCount: number;
  isEdited: boolean;
  editedAt?: string;
  createdAt: string;
  parentCommentId?: string;
}

interface Job {
  _id: string;
  title: string;
  company: string;
}

interface CommentsProps {
  job: Job;
  currentUserId?: string;
  onClose: () => void;
}

export default function Comments({ job, currentUserId, onClose }: CommentsProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const fetchComments = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/comments?jobId=${job._id}`);
      setComments(response.data.comments);
    } catch (error) {
      console.error("Error fetching comments:", error);
      toast.error("Failed to load comments");
    } finally {
      setLoading(false);
    }
  }, [job._id]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  const handleSubmitComment = async () => {
    if (!newComment.trim() || !currentUserId) {
      toast.error("Please login to comment");
      return;
    }

    try {
      setSubmitting(true);
      const response = await axios.post("/api/comments", {
        jobId: job._id,
        userId: currentUserId,
        content: newComment.trim(),
      });

      if (response.data.success) {
        setComments(prev => [response.data.comment, ...prev]);
        setNewComment("");
        toast.success("Comment posted successfully!");
      }
    } catch (error) {
      console.error("Error posting comment:", error);
      toast.error("Failed to post comment");
    } finally {
      setSubmitting(false);
    }
  };

  const handleLikeComment = async (commentId: string) => {
    if (!currentUserId) {
      toast.error("Please login to like comments");
      return;
    }

    try {
      const response = await axios.post("/api/comments/reactions", {
        commentId,
        userId: currentUserId,
        action: "like",
      });

      if (response.data.success) {
        setComments(prev => prev.map(comment => 
          comment._id === commentId 
            ? { 
                ...comment, 
                likeCount: response.data.likeCount,
                dislikeCount: response.data.dislikeCount,
                likes: response.data.hasLiked ? [...comment.likes, currentUserId] : comment.likes.filter(id => id !== currentUserId),
                dislikes: comment.dislikes.filter(id => id !== currentUserId)
              }
            : comment
        ));
      }
    } catch (error) {
      console.error("Error liking comment:", error);
      toast.error("Failed to like comment");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] flex flex-col">
        <CardHeader className="border-b">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <MessageCircle className="h-5 w-5" />
              Comments for {job.title}
            </CardTitle>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {job.company} • {comments.length} comment{comments.length !== 1 ? 's' : ''}
          </p>
        </CardHeader>
        
        <CardContent className="flex-1 overflow-y-auto p-6">
          {}
          <div className="mb-6">
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-400 to-purple-400 flex items-center justify-center text-white font-medium text-sm">
                U
              </div>
              <div className="flex-1">
                <Textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Share your thoughts about this opportunity..."
                  className="min-h-[100px] mb-3"
                />
                <Button 
                  onClick={handleSubmitComment}
                  disabled={submitting || !newComment.trim()}
                  className="w-full"
                >
                  {submitting ? "Posting..." : "Post Comment"}
                  <Send className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </div>
          </div>
          
          {}
          {loading ? (
            <div className="text-center py-8">
              <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600 dark:text-gray-400">Loading comments...</p>
            </div>
          ) : comments.length === 0 ? (
            <div className="text-center py-12">
              <MessageCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 dark:text-gray-400 mb-2">No comments yet</p>
              <p className="text-sm text-gray-500">Be the first to share your thoughts!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {comments.map((comment) => (
                <div key={comment._id} className="flex items-start gap-3 p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-orange-400 to-rose-400 flex items-center justify-center text-white font-medium text-sm">
                    {comment.userId.name.charAt(0).toUpperCase()}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-medium text-gray-800 dark:text-gray-200">{comment.userId.name}</span>
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <Clock className="h-3 w-3" />
                        <span>{new Date(comment.createdAt).toLocaleDateString()}</span>
                      </div>
                      {comment.isEdited && (
                        <Badge variant="outline" className="text-xs">Edited</Badge>
                      )}
                    </div>
                    
                    <p className="text-gray-700 dark:text-gray-300 mb-3">{comment.content}</p>
                    
                    <div className="flex items-center gap-4">
                      <button
                        onClick={() => handleLikeComment(comment._id)}
                        className="flex items-center gap-1 text-sm text-gray-500 hover:text-blue-600 transition-colors"
                      >
                        <ThumbsUp className={`h-4 w-4 ${comment.likes.includes(currentUserId || '') ? 'text-blue-600 fill-current' : ''}`} />
                        <span>{comment.likeCount}</span>
                      </button>
                      
                      <button className="flex items-center gap-1 text-sm text-gray-500 hover:text-green-600 transition-colors">
                        <Reply className="h-4 w-4" />
                        <span>Reply</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
