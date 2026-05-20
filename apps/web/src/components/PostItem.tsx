/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, @next/next/no-img-element */
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/components/AuthProvider";

export default function PostItem({ post }: { post: any }) {
  const { accessToken } = useAuth();
  const [comments, setComments] = useState<any[]>([]);
  const [commentContent, setCommentContent] = useState("");
  const [showComments, setShowComments] = useState(false);
  const [hasLiked, setHasLiked] = useState(false); // In MVP, assume false initially unless backend provides it

  const handleLike = async () => {
    if (!accessToken) return;
    try {
      if (hasLiked) {
        await fetch(`http://localhost:3001/api/posts/${post.id}/react`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        setHasLiked(false);
      } else {
        await fetch(`http://localhost:3001/api/posts/${post.id}/react`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({ reactionType: "LIKE" }),
        });
        setHasLiked(true);
      }
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

  return (
    <div className="p-4 bg-white rounded-xl shadow-sm border border-slate-200 space-y-4">
      <div className="flex justify-between">
        <Link href={`/profile/${post.authorId}`} className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-full bg-slate-200 shrink-0 overflow-hidden">
            {post.author?.avatarUrl && <img src={post.author.avatarUrl} alt="" className="w-full h-full object-cover" />}
          </div>
          <div>
            <h4 className="font-semibold text-sm group-hover:underline">
              {post.author ? `${post.author.firstName} ${post.author.lastName}` : 'Unknown'}
            </h4>
            <span className="text-xs text-slate-500">{new Date(post.createdAt).toLocaleString()} • {post.privacy}</span>
          </div>
        </Link>
      </div>
      <p className="text-sm text-slate-700 whitespace-pre-wrap">{post.content}</p>
      
      <div className="flex items-center gap-6 pt-3 border-t border-slate-100">
        <button 
          onClick={handleLike}
          className={`text-sm font-medium ${hasLiked ? "text-blue-600" : "text-slate-600 hover:text-black"}`}
        >
          {hasLiked ? "Liked" : "Like"}
        </button>
        <button 
          onClick={handleToggleComments}
          className="text-sm text-slate-600 hover:text-black font-medium"
        >
          Comment
        </button>
      </div>

      {showComments && (
        <div className="pt-4 border-t border-slate-100 space-y-4">
          <div className="flex gap-3">
            <input 
              type="text" 
              value={commentContent}
              onChange={(e) => setCommentContent(e.target.value)}
              placeholder="Write a comment..." 
              className="flex-1 bg-slate-50 border border-slate-200 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-300"
            />
            <button 
              onClick={handlePostComment}
              disabled={!commentContent.trim()}
              className="px-4 py-2 bg-black text-white rounded-full text-sm font-medium hover:bg-black/90 disabled:opacity-50"
            >
              Post
            </button>
          </div>
          
          <div className="space-y-3">
            {comments.map((c) => (
              <div key={c.id} className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-slate-200 shrink-0 overflow-hidden">
                  {c.author?.avatarUrl && <img src={c.author.avatarUrl} alt="" className="w-full h-full object-cover" />}
                </div>
                <div className="flex-1 bg-slate-50 rounded-2xl p-3">
                  <Link href={`/profile/${c.authorId}`} className="font-semibold text-sm hover:underline">
                    {c.author ? `${c.author.firstName} ${c.author.lastName}` : 'Unknown'}
                  </Link>
                  <p className="text-sm text-slate-700 mt-1">{c.content}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
