/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, react-hooks/set-state-in-effect, react-hooks/exhaustive-deps */
"use client";

import { useState, useEffect } from "react";
import Sidebar from "@/components/Sidebar";
import { useAuth } from "@/components/AuthProvider";
import Link from "next/link";
import PostItem from "@/components/PostItem";

export default function Feed() {
  const { accessToken, user } = useAuth();
  const [posts, setPosts] = useState<any[]>([]);
  const [content, setContent] = useState("");
  const [privacy, setPrivacy] = useState("PUBLIC");
  const [cursor, setCursor] = useState<string | null>(null);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchFeed = async (nextCursor?: string) => {
    if (!accessToken) return;
    try {
      const url = new URL("http://localhost:3001/api/feed");
      url.searchParams.append("sort", "chronological");
      if (nextCursor) {
        url.searchParams.append("cursor", nextCursor);
      }
      
      const res = await fetch(url.toString(), {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      if (res.ok) {
        const data = await res.json();
        if (nextCursor) {
          setPosts((prev) => [...prev, ...data.items]);
        } else {
          setPosts(data.items);
        }
        setCursor(data.nextCursor);
        setHasNextPage(!!data.nextCursor);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (accessToken) {
      fetchFeed();
    }
  }, [accessToken]);

  const handleCreatePost = async () => {
    if (!content.trim() || !accessToken) return;
    try {
      const res = await fetch("http://localhost:3001/api/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ content, privacy }),
      });
      if (res.ok) {
        const newPost = await res.json();
        // MVP: refresh from start to see the new post correctly
        setContent("");
        setPrivacy("PUBLIC");
        fetchFeed();
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="flex max-w-7xl mx-auto">
      <Sidebar />
      <main className="flex-1 p-6">
        <div className="max-w-2xl mx-auto space-y-6">
          {/* Create Post */}
          <div className="p-4 bg-white rounded-xl shadow-sm border border-slate-200 space-y-4">
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-full bg-slate-200 shrink-0"></div>
              <textarea 
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Share your progress or thoughts..." 
                className="flex-1 bg-slate-50 border border-slate-200 rounded-lg p-3 min-h-[80px] focus:outline-none focus:ring-2 focus:ring-slate-300 resize-none"
              />
            </div>
            <div className="flex justify-between items-center">
              <select 
                value={privacy} 
                onChange={(e) => setPrivacy(e.target.value)}
                className="text-sm border border-slate-200 rounded-md p-2 bg-slate-50 focus:outline-none"
              >
                <option value="PUBLIC">Public</option>
                <option value="FRIENDS">Connections</option>
                <option value="PRIVATE">Private</option>
              </select>
              <button 
                onClick={handleCreatePost}
                disabled={!content.trim()}
                className="px-6 py-2 bg-black text-white rounded-md text-sm font-medium hover:bg-black/90 disabled:opacity-50"
              >
                Post
              </button>
            </div>
          </div>

          {/* Feed Stream */}
          <div className="space-y-4">
            {loading && !posts.length && <p className="text-center text-slate-500 py-8">Loading feed...</p>}
            {!loading && !posts.length && <p className="text-center text-slate-500 py-8">No posts to show.</p>}
            
            {posts.map((post) => (
              <PostItem key={post.id} post={post} />
            ))}
            
            {hasNextPage && (
              <div className="flex justify-center pt-4">
                <button 
                  onClick={() => cursor && fetchFeed(cursor)}
                  className="px-4 py-2 border border-slate-200 text-slate-700 rounded-md text-sm font-medium hover:bg-slate-50"
                >
                  Load More
                </button>
              </div>
            )}
          </div>
        </div>
      </main>
      <div className="hidden lg:block w-80 p-4">
        {/* Right sidebar for Monetisation/CSR */}
        <div className="p-4 bg-white rounded-xl shadow-sm border border-slate-200 space-y-4 sticky top-20">
          <h3 className="font-semibold">Elite Performance Tiers</h3>
          <p className="text-sm text-slate-600">Upgrade your account for AI video analysis and health tracking.</p>
          <button className="w-full px-4 py-2 border border-slate-300 text-black rounded-md text-sm font-medium hover:bg-slate-50">Learn More</button>
        </div>
      </div>
    </div>
  );
}
