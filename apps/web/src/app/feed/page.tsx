/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, react-hooks/set-state-in-effect, react-hooks/exhaustive-deps, @next/next/no-img-element */
"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import RightSidebar from "@/components/RightSidebar";
import { useAuth } from "@/components/AuthProvider";
import Link from "next/link";
import PostItem from "@/components/PostItem";
import { Image as ImageIcon, X, Plus } from "lucide-react";

// Sleek Loading Skeleton Component
function PostSkeleton() {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 p-4 space-y-4 animate-pulse">
      <div className="flex gap-3">
        <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-800 shrink-0"></div>
        <div className="space-y-2 flex-1 pt-1">
          <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-1/4"></div>
          <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-1/6"></div>
        </div>
      </div>
      <div className="space-y-2 pt-2">
        <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-full"></div>
        <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-5/6"></div>
      </div>
      <div className="h-48 bg-slate-100 dark:bg-slate-800 rounded-lg mt-4 w-full"></div>
    </div>
  );
}

export default function Feed() {
  const { accessToken, user, authLoading } = useAuth();
  const router = useRouter();
  const [posts, setPosts] = useState<any[]>([]);
  const [content, setContent] = useState("");
  const [privacy, setPrivacy] = useState("PUBLIC");
  const [cursor, setCursor] = useState<string | null>(null);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [loading, setLoading] = useState(true);
  
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
      console.warn("Failed to fetch feed from API, loading mock data for preview.", e);
      if (posts.length === 0) {
        setPosts([
          {
            id: "mock-post-1",
            content: "Just completed an amazing training session at the High Performance Centre! The AI coaching video analysis gave me some great insights into my running posture. South African talent is rising! 🇿🇦🏃‍♂️",
            createdAt: new Date().toISOString(),
            author: {
              firstName: "Naledi",
              lastName: "Khumalo",
              avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=faces"
            },
            reactions: [
              { reactionType: "LOVE", user: { id: "u2" } },
              { reactionType: "LIKE", user: { id: "u3" } }
            ],
            comments: []
          },
          {
            id: "mock-post-2",
            content: "Check out the new computer literacy modules on the EDAP learning dashboard. Digital literacy is a superpower! 💻💪",
            createdAt: new Date(Date.now() - 3600000).toISOString(),
            author: {
              firstName: "Sipho",
              lastName: "Zulu",
              avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=faces"
            },
            reactions: [
              { reactionType: "LIKE", user: { id: "u4" } }
            ],
            comments: [
              {
                id: "mock-comment-1",
                content: "Totally agree! Super easy to follow.",
                createdAt: new Date(Date.now() - 1800000).toISOString(),
                author: {
                  firstName: "Lerato",
                  lastName: "Mokoena"
                }
              }
            ]
          }
        ]);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!authLoading) {
      if (!accessToken) {
        router.push("/login");
      } else {
        fetchFeed();
      }
    }
  }, [accessToken, authLoading, router]);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setPreviewImage(url);
    }
  };

  const clearPreview = () => {
    setPreviewImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleCreatePost = async () => {
    if (!content.trim() && !previewImage) return;
    if (!accessToken) return;
    
    // Note: In MVP, mediaUrl is mocked or ignored by backend until multipart/form-data is implemented
    const postData = {
      content,
      privacy,
      mediaUrl: previewImage // Mocking media URL for UI demonstration
    };

    try {
      const res = await fetch("http://localhost:3001/api/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(postData),
      });
      if (res.ok) {
        setContent("");
        setPrivacy("PUBLIC");
        clearPreview();
        fetchFeed();
      }
    } catch (e) {
      console.warn("Failed to create post on API, adding to local mock feed.", e);
      const newPost = {
        id: `mock-post-${Date.now()}`,
        content,
        privacy,
        mediaUrls: previewImage ? [previewImage] : null,
        createdAt: new Date().toISOString(),
        author: {
          id: user?.id || "mock-user-id",
          email: user?.email || "user@example.com",
          firstName: user?.firstName || "Sipho",
          lastName: user?.lastName || "Zulu",
          avatarUrl: user?.avatarUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=faces"
        },
        reactions: [],
        comments: []
      };
      setPosts((prev) => [newPost, ...prev]);
      setContent("");
      setPrivacy("PUBLIC");
      clearPreview();
    }
  };

  return (
    <div className="flex max-w-[1600px] justify-center mx-auto bg-slate-100 dark:bg-slate-950">
      <Sidebar />
      <main className="flex-1 max-w-[680px] p-4 sm:p-6 lg:p-8 min-h-screen">
        <div className="space-y-6">
          
          {/* Stories Carousel */}
          <div className="flex gap-3 overflow-x-auto pb-2 custom-scrollbar snap-x">
            {/* Create Story */}
            <div className="w-[112px] h-[200px] shrink-0 rounded-xl overflow-hidden bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 relative group cursor-pointer snap-start flex flex-col shadow-sm">
               <div className="h-2/3 bg-slate-200 dark:bg-slate-800 overflow-hidden">
                 {user?.avatarUrl && <img src={user.avatarUrl} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform" />}
               </div>
               <div className="h-1/3 flex flex-col items-center justify-end pb-3 relative">
                 <div className="absolute -top-5 w-10 h-10 bg-blue-600 rounded-full border-4 border-white dark:border-slate-900 flex items-center justify-center text-white">
                   <Plus size={20} />
                 </div>
                 <span className="text-[13px] font-semibold text-slate-900 dark:text-slate-100">Create story</span>
               </div>
            </div>

            {/* Mock Stories */}
            {[1, 2, 3, 4].map((i) => (
               <div key={i} className="w-[112px] h-[200px] shrink-0 rounded-xl overflow-hidden relative group cursor-pointer snap-start shadow-sm bg-slate-300 dark:bg-slate-800">
                 <div className="absolute top-3 left-3 w-10 h-10 rounded-full border-4 border-blue-500 overflow-hidden z-10 bg-slate-200 dark:bg-slate-700"></div>
                 <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors z-0"></div>
                 <span className="absolute bottom-3 left-3 text-[13px] font-semibold text-white z-10 drop-shadow-md">Story {i}</span>
               </div>
            ))}
          </div>

          {/* Create Post */}
          <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden transition-all duration-300 focus-within:shadow-md focus-within:border-slate-300 dark:focus-within:border-slate-700">
            <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex gap-3">
              <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-800 shrink-0 overflow-hidden">
                {user?.avatarUrl && <img src={user.avatarUrl} alt="" className="w-full h-full object-cover" />}
              </div>
              <textarea 
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="What's on your mind?" 
                className="flex-1 bg-transparent border-none p-2 min-h-[60px] text-[16px] text-slate-800 dark:text-slate-100 focus:outline-none resize-none placeholder-slate-500 dark:placeholder-slate-400 mt-1"
              />
            </div>
            
            {/* Image Preview */}
            {previewImage && (
              <div className="px-4 pb-2 relative">
                <div className="relative rounded-lg overflow-hidden border border-slate-200 bg-slate-50 max-h-[300px]">
                  <img src={previewImage} alt="Preview" className="w-full h-full object-contain max-h-[300px]" />
                  <button 
                    onClick={clearPreview}
                    className="absolute top-2 right-2 p-1 bg-black/60 text-white rounded-full hover:bg-black/80 transition-colors shadow-sm"
                  >
                    <X size={16} />
                  </button>
                </div>
              </div>
            )}

            <div className="px-4 py-3 bg-white dark:bg-slate-900 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleImageSelect} 
                  accept="image/*" 
                  className="hidden" 
                />
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 font-medium text-[15px] transition-colors"
                >
                  <ImageIcon size={24} className="text-green-500" />
                  <span>Photo/video</span>
                </button>
              </div>
              <div className="flex items-center gap-3">
                <select 
                  value={privacy} 
                  onChange={(e) => setPrivacy(e.target.value)}
                  className="text-[13px] font-medium border border-slate-200 dark:border-slate-700 rounded-md py-1.5 px-2 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="PUBLIC">🌎 Public</option>
                  <option value="FRIENDS">👥 Friends</option>
                  <option value="PRIVATE">🔒 Only me</option>
                </select>
                <button 
                  onClick={handleCreatePost}
                  disabled={!content.trim() && !previewImage}
                  className="px-6 py-1.5 bg-blue-600 text-white rounded-md text-[14px] font-semibold hover:bg-blue-700 transition-colors shadow-sm disabled:opacity-50 disabled:hover:bg-blue-600"
                >
                  Post
                </button>
              </div>
            </div>
          </div>

          {/* Feed Stream */}
          <div className="space-y-4">
            {loading && !posts.length ? (
              <>
                <PostSkeleton />
                <PostSkeleton />
              </>
            ) : !loading && !posts.length ? (
              <div className="text-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl py-12 px-4 shadow-sm">
                <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-3">
                  <ImageIcon size={24} className="text-slate-400 dark:text-slate-500" />
                </div>
                <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200">No posts yet</h3>
                <p className="text-slate-500 dark:text-slate-400 mt-1 text-[15px]">Be the first to share something with your network.</p>
              </div>
            ) : (
              posts.map((post) => (
                <PostItem key={post.id} post={post} />
              ))
            )}
            
            {hasNextPage && (
              <div className="flex justify-center pt-4 pb-8">
                <button 
                  onClick={() => cursor && fetchFeed(cursor)}
                  className="px-6 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 rounded-full text-[14px] font-semibold hover:bg-slate-50 dark:hover:bg-slate-700 shadow-sm transition-all hover:shadow"
                >
                  Load More
                </button>
              </div>
            )}
          </div>
        </div>
      </main>
      <RightSidebar />
    </div>
  );
}
