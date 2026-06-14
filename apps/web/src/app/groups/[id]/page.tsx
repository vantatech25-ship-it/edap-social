"use client";

import { useEffect, useState } from "react";
import Sidebar from "@/components/Sidebar";
import { useAuth } from "@/components/AuthProvider";
import PostItem from "@/components/PostItem";

export default function GroupDetailPage({ params }: { params: { id: string } }) {
  const { id } = params;
  const { accessToken, user } = useAuth();
  const [group, setGroup] = useState<any>(null);
  const [isMember, setIsMember] = useState(false);
  const [newPostContent, setNewPostContent] = useState("");

  useEffect(() => {
    if (accessToken) fetchGroup();
  }, [id, accessToken]);

  const fetchGroup = async () => {
    try {
      const res = await fetch(`http://localhost:3001/api/groups/${id}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      if (res.ok) {
        const data = await res.json();
        setGroup(data);
        // Check if current user is in members array
        const member = data.members.find((m: any) => m.userId === user?.id);
        setIsMember(!!member);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleJoinLeave = async () => {
    if (!accessToken) return;
    try {
      if (isMember) {
        await fetch(`http://localhost:3001/api/groups/${id}/leave`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${accessToken}` },
        });
      } else {
        await fetch(`http://localhost:3001/api/groups/${id}/join`, {
          method: "POST",
          headers: { Authorization: `Bearer ${accessToken}` },
        });
      }
      fetchGroup(); // Refresh
    } catch (e) {
      console.error(e);
    }
  };

  const handleCreatePost = async () => {
    if (!newPostContent.trim() || !accessToken) return;
    try {
      // Create a post with groupId set
      const res = await fetch("http://localhost:3001/api/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          content: newPostContent,
          groupId: id,
        }),
      });
      if (res.ok) {
        setNewPostContent("");
        // A real app would refresh the group posts here, but since the group posts 
        // aren't separated in a generic /posts endpoint yet, we'll mock the refresh or navigate to feed
        alert("Post created in group!");
      }
    } catch (e) {
      console.error(e);
    }
  };

  if (!group) return <div className="p-10 text-center">Loading...</div>;

  return (
    <div className="flex max-w-7xl mx-auto min-h-screen">
      <Sidebar />
      <main className="flex-1">
        {/* Banner */}
        <div className="h-48 bg-gradient-to-r from-blue-600 to-indigo-800 w-full relative"></div>
        
        <div className="max-w-4xl mx-auto px-6">
          {/* Header Info */}
          <div className="bg-white p-6 rounded-b-xl shadow-sm border border-t-0 border-slate-200 mb-6 flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">{group.name}</h1>
              <p className="text-slate-600 mt-2 max-w-2xl">{group.description}</p>
              <div className="flex items-center gap-4 mt-4 text-sm text-slate-500">
                <span className="font-medium bg-slate-100 px-2 py-1 rounded-md">{group.privacy} Group</span>
                <span>{group.members?.length || 0} members</span>
                <span>{group._count?.posts || 0} posts</span>
              </div>
            </div>
            <button
              onClick={handleJoinLeave}
              className={`px-6 py-2 rounded-full font-semibold transition-colors ${
                isMember 
                  ? 'bg-slate-100 text-slate-700 hover:bg-slate-200' 
                  : 'bg-black text-white hover:bg-slate-800'
              }`}
            >
              {isMember ? 'Joined' : 'Join Group'}
            </button>
          </div>

          <div className="grid grid-cols-3 gap-6">
            {/* Feed Column */}
            <div className="col-span-2 space-y-6">
              {isMember ? (
                <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
                  <textarea
                    placeholder="Write something to the group..."
                    className="w-full border border-slate-200 rounded-lg p-3 outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                    rows={3}
                    value={newPostContent}
                    onChange={(e) => setNewPostContent(e.target.value)}
                  />
                  <div className="flex justify-end mt-2">
                    <button 
                      onClick={handleCreatePost}
                      disabled={!newPostContent.trim()}
                      className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 font-medium text-sm"
                    >
                      Post
                    </button>
                  </div>
                </div>
              ) : (
                <div className="bg-slate-50 p-8 rounded-xl text-center text-slate-500 border border-slate-200">
                  Join the group to view and create posts!
                </div>
              )}

              {/* Group Posts Placeholder */}
              {isMember && (
                <div className="text-center text-slate-500 py-10">
                  Posts endpoint needs a `?groupId=` filter to display them here!
                </div>
              )}
            </div>

            {/* Sidebar Column */}
            <div className="col-span-1 space-y-6">
               <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
                 <h3 className="font-bold mb-4">Members ({group.members?.length})</h3>
                 <div className="space-y-3">
                   {group.members?.slice(0, 5).map((m: any) => (
                     <div key={m.userId} className="flex items-center gap-3">
                       <div className="w-8 h-8 rounded-full bg-slate-200 overflow-hidden">
                         {m.user?.avatarUrl && <img src={m.user.avatarUrl} alt="" className="w-full h-full object-cover" />}
                       </div>
                       <div className="text-sm font-medium">
                         {m.user?.firstName} {m.user?.lastName}
                         {m.role === 'OWNER' && <span className="ml-2 text-[10px] bg-yellow-100 text-yellow-800 px-1 py-0.5 rounded">Owner</span>}
                       </div>
                     </div>
                   ))}
                 </div>
               </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
