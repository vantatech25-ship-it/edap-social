/* eslint-disable @typescript-eslint/no-explicit-any, react-hooks/set-state-in-effect */
"use client";

import { useEffect, useState } from "react";
import Sidebar from "@/components/Sidebar";
import { useAuth } from "@/components/AuthProvider";

export default function Profile({ params }: { params: { id: string } }) {
  const { id } = params;
  const { accessToken, user: currentUser } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch(`http://localhost:3001/api/users/${id}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        if (res.ok) {
          const data = await res.json();
          setProfile(data);
        }

        if (currentUser && currentUser.id !== id) {
          const followRes = await fetch(`http://localhost:3001/api/users/${currentUser.id}/connections?type=following`, {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          });
          if (followRes.ok) {
            const followData = await followRes.json();
            const followingIds = followData.connections.map((c: any) => c.id);
            if (followingIds.includes(id)) {
              setIsFollowing(true);
            }
          }
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (accessToken) {
      fetchProfile();
    } else {
      setLoading(false);
    }
  }, [id, accessToken, currentUser]);

  const toggleFollow = async () => {
    if (!accessToken || !currentUser) return;
    try {
      if (isFollowing) {
        await fetch(`http://localhost:3001/api/users/${id}/follow`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        setIsFollowing(false);
      } else {
        await fetch(`http://localhost:3001/api/users/${id}/follow`, {
          method: "POST",
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        setIsFollowing(true);
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return <div className="flex justify-center mt-20">Loading...</div>;
  }

  return (
    <div className="flex max-w-7xl mx-auto">
      <Sidebar />
      <main className="flex-1">
        <div className="w-full h-48 bg-slate-200"></div>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative -mt-16 sm:-mt-24 flex items-end gap-5">
            <div className="w-32 h-32 rounded-full border-4 border-white bg-slate-300"></div>
            <div className="mb-4 flex-1 flex justify-between items-end">
              <div>
                <h1 className="text-2xl font-bold truncate">
                  {profile ? `${profile.firstName} ${profile.lastName}` : `User ${id}`}
                </h1>
                <p className="text-slate-500">@{profile ? profile.email.split('@')[0] : `user_${id}`}</p>
              </div>
              {currentUser && currentUser.id !== id && (
                <button 
                  onClick={toggleFollow}
                  className={`px-4 py-2 rounded-md text-sm font-medium ${isFollowing ? 'bg-slate-200 text-slate-800 hover:bg-slate-300' : 'bg-black text-white hover:bg-black/90'}`}
                >
                  {isFollowing ? 'Unfollow' : 'Follow'}
                </button>
              )}
            </div>
          </div>
          
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="col-span-1 space-y-4">
              <div className="p-4 bg-white rounded-xl shadow-sm border border-slate-200">
                <h3 className="font-semibold mb-2">Intro</h3>
                <p className="text-sm text-slate-600">Transforming South African talent via AI coaching. #EDAP</p>
              </div>
            </div>
            <div className="col-span-1 md:col-span-2 space-y-4">
               {/* User's Posts Placeholder */}
               <div className="p-4 bg-white rounded-xl shadow-sm border border-slate-200 space-y-4 text-center py-12">
                  <p className="text-sm text-slate-500">No posts yet.</p>
               </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
