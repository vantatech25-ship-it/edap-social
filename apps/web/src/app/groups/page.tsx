"use client";

import { useEffect, useState } from "react";
import Sidebar from "@/components/Sidebar";
import Link from "next/link";
import { useAuth } from "@/components/AuthProvider";

export default function GroupsPage() {
  const { accessToken } = useAuth();
  const [groups, setGroups] = useState<any[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [newGroupName, setNewGroupName] = useState("");
  const [newGroupDesc, setNewGroupDesc] = useState("");

  useEffect(() => {
    if (accessToken) {
      fetchGroups();
    }
  }, [accessToken]);

  const fetchGroups = async () => {
    try {
      const res = await fetch("http://localhost:3001/api/groups", {
        headers: { Authorization: `Bearer ${accessToken}` }
      });
      if (res.ok) {
        setGroups(await res.json());
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleCreateGroup = async () => {
    if (!newGroupName.trim() || !accessToken) return;
    try {
      const res = await fetch("http://localhost:3001/api/groups", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          name: newGroupName,
          description: newGroupDesc,
        }),
      });
      if (res.ok) {
        setNewGroupName("");
        setNewGroupDesc("");
        setIsCreating(false);
        fetchGroups();
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="flex max-w-7xl mx-auto min-h-screen">
      <Sidebar />
      <main className="flex-1 p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-slate-900">Discover Groups</h1>
          <button
            onClick={() => setIsCreating(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors font-medium text-sm"
          >
            Create Group
          </button>
        </div>

        {isCreating && (
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
            <h2 className="text-lg font-semibold">Create a New Group</h2>
            <input
              type="text"
              placeholder="Group Name"
              value={newGroupName}
              onChange={(e) => setNewGroupName(e.target.value)}
              className="w-full border border-slate-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 outline-none"
            />
            <textarea
              placeholder="Group Description"
              value={newGroupDesc}
              onChange={(e) => setNewGroupDesc(e.target.value)}
              className="w-full border border-slate-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 outline-none"
              rows={3}
            />
            <div className="flex gap-2 justify-end">
              <button onClick={() => setIsCreating(false)} className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-md">Cancel</button>
              <button onClick={handleCreateGroup} className="bg-black text-white px-4 py-2 rounded-md hover:bg-slate-800">Create</button>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {groups.map((group) => (
            <Link key={group.id} href={`/groups/${group.id}`} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-shadow group/card block">
              <div className="h-32 bg-gradient-to-r from-blue-500 to-indigo-600 relative">
                <div className="absolute inset-0 bg-black/10 group-hover/card:bg-transparent transition-colors"></div>
              </div>
              <div className="p-5">
                <h3 className="font-bold text-lg text-slate-900 mb-1">{group.name}</h3>
                <p className="text-sm text-slate-600 line-clamp-2 mb-4">{group.description || 'No description provided.'}</p>
                <div className="flex items-center justify-between text-sm text-slate-500">
                  <span>{group._count?.members || 0} members</span>
                  <span className="font-medium text-blue-600 group-hover/card:underline">View Group</span>
                </div>
              </div>
            </Link>
          ))}
          {groups.length === 0 && !isCreating && (
             <div className="col-span-full py-12 text-center text-slate-500 border-2 border-dashed border-slate-200 rounded-xl">
               No groups available right now. Be the first to create one!
             </div>
          )}
        </div>
      </main>
    </div>
  );
}
