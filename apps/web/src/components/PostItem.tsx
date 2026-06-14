/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, @next/next/no-img-element */
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/components/AuthProvider";
import ReactionPicker from "./ReactionPicker";
import { MessageCircle, Share2, MoreHorizontal } from "lucide-react";

export default function PostItem({ post }: { post: any }) {
  const { accessToken, user } = useAuth();
  const [comments, setComments] = useState<any[]>([]);
  const [commentContent, setCommentContent] = useState("");
  const [showComments, setShowComments] = useState(false);
  const [currentReaction, setCurrentReaction] = useState<string | null>(null);
  const [totalReactions, setTotalReactions] = useState(0);
  const [reactionSummary, setReactionSummary] = useState<Record<string, number>>({});
  const [showOptions, setShowOptions] = useState(false);
  const [isDeleted, setIsDeleted] = useState(false);

  useEffect(() => {
    fetchReactions();
  }, [post.id, accessToken]);

  const fetchReactions = async () => {
    if (!accessToken) return;
    try {
      const res = await fetch(`http://localhost:3001/api/reactions?entityType=POST&entityId=${post.id}`, {
        headers: { Authorization: `Bearer ${accessToken}` }
      });
      if (res.ok) {
        const data = await res.json();
        setTotalReactions(data.total);
        setReactionSummary(data.summary);
        const myReaction = data.reactions.find((r: any) => r.userId === user?.id);
        setCurrentReaction(myReaction ? myReaction.reactionType : null);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleReact = async (type: string | null) => {
    if (!accessToken) return;
    try {
      if (!type) {
        // Delete reaction
        await fetch(`http://localhost:3001/api/posts/${post.id}/react`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        setCurrentReaction(null);
      } else {
        // Create/Update reaction
        await fetch(`http://localhost:3001/api/posts/${post.id}/react`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({ reactionType: type }),
        });
        setCurrentReaction(type);
      }
      fetchReactions(); // Refresh summary after reacting
    } catch (e) {
      console.error(e);
    }
  };

  const fetchComments = async () => {
    if (!accessToken) return;
    try {
      const res = await fetch(`http://localhost:3001/api/posts/${post.id}/comments`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      if (res.ok) {
        const data = await res.json();
        setComments(data.items);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleToggleComments = () => {
    setShowComments(!showComments);
    if (!showComments && comments.length === 0) {
      fetchComments();
    }
  };

  const handlePostComment = async () => {
    if (!commentContent.trim() || !accessToken) return;
    try {
      const res = await fetch(`http://localhost:3001/api/posts/${post.id}/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ content: commentContent }),
      });
      if (res.ok) {
        setCommentContent("");
        fetchComments(); // Refresh comments list
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeletePost = async () => {
    if (!accessToken) return;
    try {
      const res = await fetch(`http://localhost:3001/api/posts/${post.id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      if (res.ok) {
        setIsDeleted(true);
      }
    } catch (e) {
      console.error(e);
    }
  };

  if (isDeleted) return null;

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
      <div className="p-4 space-y-4">
        {/* Header */}
        <div className="flex justify-between items-start">
          <Link href={`/profile/${post.authorId}`} className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-800 shrink-0 overflow-hidden">
              {post.author?.avatarUrl && <img src={post.author.avatarUrl} alt="" className="w-full h-full object-cover" />}
            </div>
            <div>
              <h4 className="font-semibold text-[15px] group-hover:underline text-slate-900 dark:text-slate-100">
                {post.author ? `${post.author.firstName} ${post.author.lastName}` : 'Unknown'}
              </h4>
              <span className="text-[13px] text-slate-500 dark:text-slate-400 flex items-center gap-1">
                {new Date(post.createdAt).toLocaleString()} 
                <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-600"></span> 
                {post.privacy}
              </span>
            </div>
          </Link>
          {user?.id === post.authorId && (
            <div className="relative">
              <button 
                onClick={() => setShowOptions(!showOptions)}
                className="p-2 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
              >
                <MoreHorizontal size={20} />
              </button>
              {showOptions && (
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 overflow-hidden z-20">
                  <button 
                    onClick={handleDeletePost}
                    className="w-full text-left px-4 py-3 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 text-[15px] font-medium transition-colors"
                  >
                    Delete post
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Content */}
        <p className="text-[15px] text-slate-800 dark:text-slate-200 whitespace-pre-wrap leading-relaxed">{post.content}</p>
        
        {/* Media (Placeholder if any) */}
        {post.mediaUrl && (
          <div className="mt-3 -mx-4">
            <img src={post.mediaUrl} alt="" className="w-full max-h-[500px] object-cover" />
          </div>
        )}

        {/* Reaction Stats */}
        <div className="flex items-center justify-between text-[13px] text-slate-500 dark:text-slate-400 py-2 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-1">
            {Object.keys(reactionSummary).length > 0 ? (
              <div className="flex -space-x-1">
                {Object.keys(reactionSummary).slice(0, 3).map((type) => (
                  <span key={type} className="bg-slate-100 dark:bg-slate-800 rounded-full px-1 py-0.5 text-[10px] border border-white dark:border-slate-900 shadow-sm z-10 relative">
                    {type === 'LIKE' ? '👍' : type === 'LOVE' ? '❤️' : type === 'HAHA' ? '😆' : type === 'WOW' ? '😮' : type === 'SAD' ? '😢' : '😡'}
                  </span>
                ))}
              </div>
            ) : null}
            <span className="ml-1">{totalReactions} {totalReactions === 1 ? 'reaction' : 'reactions'}</span>
          </div>
          <div className="flex gap-3 cursor-pointer hover:underline" onClick={handleToggleComments}>
            <span>{comments.length} Comments</span>
          </div>
        </div>
        
        {/* Action Bar */}
        <div className="flex items-center justify-between pt-1">
          <div className="flex-1 flex justify-center">
            <ReactionPicker onReact={handleReact} currentReaction={currentReaction} />
          </div>
          <div className="flex-1 flex justify-center">
            <button 
              onClick={handleToggleComments}
              className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors font-medium text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 w-full justify-center"
            >
              <MessageCircle size={18} className="opacity-70" />
              <span>Comment</span>
            </button>
          </div>
          <div className="flex-1 flex justify-center">
            <button className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors font-medium text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 w-full justify-center">
              <Share2 size={18} className="opacity-70" />
              <span>Share</span>
            </button>
          </div>
        </div>
      </div>

      {/* Comments Section */}
      {showComments && (
        <div className="bg-slate-50 dark:bg-slate-800/50 p-4 border-t border-slate-100 dark:border-slate-800 space-y-4">
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 shrink-0 overflow-hidden">
               {user?.avatarUrl && <img src={user.avatarUrl} alt="" className="w-full h-full object-cover" />}
            </div>
            <div className="flex-1 relative">
              <input 
                type="text" 
                value={commentContent}
                onChange={(e) => setCommentContent(e.target.value)}
                placeholder="Write a comment..." 
                className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-sm rounded-full pl-4 pr-16 py-2 text-[14px] focus:outline-none focus:ring-2 focus:ring-slate-300 dark:focus:ring-slate-600 transition-shadow dark:text-white"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handlePostComment();
                }}
              />
              <button 
                onClick={handlePostComment}
                disabled={!commentContent.trim()}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-blue-600 font-semibold text-[13px] disabled:opacity-50 hover:bg-blue-50 px-2 py-1 rounded-full transition-colors"
              >
                Post
              </button>
            </div>
          </div>
          
          <div className="space-y-4 pt-2">
            {comments.map((c) => (
              <div key={c.id} className="flex gap-2 group/comment">
                <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 shrink-0 overflow-hidden mt-1">
                  {c.author?.avatarUrl && <img src={c.author.avatarUrl} alt="" className="w-full h-full object-cover" />}
                </div>
                <div className="flex-1">
                  <div className="inline-block bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl px-3 py-2 shadow-sm max-w-[90%]">
                    <Link href={`/profile/${c.authorId}`} className="font-semibold text-[13px] text-slate-900 dark:text-slate-100 hover:underline">
                      {c.author ? `${c.author.firstName} ${c.author.lastName}` : 'Unknown'}
                    </Link>
                    <p className="text-[14px] text-slate-800 dark:text-slate-200 mt-0.5 leading-snug whitespace-pre-wrap">{c.content}</p>
                  </div>
                  <div className="flex items-center gap-3 text-[12px] font-medium text-slate-500 dark:text-slate-400 mt-1 ml-2">
                    <button className="hover:text-slate-900 dark:hover:text-slate-200 transition-colors">Like</button>
                    <button className="hover:text-slate-900 dark:hover:text-slate-200 transition-colors">Reply</button>
                    <span className="text-slate-400 font-normal">{new Date(c.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
