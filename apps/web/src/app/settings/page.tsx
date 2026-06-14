"use client";

import { useState, useEffect } from "react";
import Sidebar from "@/components/Sidebar";
import RightSidebar from "@/components/RightSidebar";
import { useAuth } from "@/components/AuthProvider";
import { Save } from "lucide-react";

export default function SettingsPage() {
  const { user, accessToken } = useAuth();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    bio: "",
    avatarUrl: "",
  });
  const [status, setStatus] = useState<"idle" | "saving" | "success" | "error">("idle");

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        bio: user.bio || "",
        avatarUrl: user.avatarUrl || "",
      });
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSave = async () => {
    if (!accessToken) return;
    setStatus("saving");
    try {
      const res = await fetch("http://localhost:3001/api/users/me", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setStatus("success");
        setTimeout(() => setStatus("idle"), 3000);
      } else {
        setStatus("error");
        setTimeout(() => setStatus("idle"), 3000);
      }
    } catch (e) {
      console.error(e);
      setStatus("error");
      setTimeout(() => setStatus("idle"), 3000);
    }
  };

  return (
    <div className="flex max-w-[1600px] justify-center mx-auto bg-slate-100 dark:bg-slate-950">
      <Sidebar />
      <main className="flex-1 max-w-[680px] p-4 sm:p-6 lg:p-8 min-h-screen">
        <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
          <div className="p-6 border-b border-slate-200 dark:border-slate-800">
            <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Settings & Profile</h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Update your personal information and profile settings.</p>
          </div>
          
          <div className="p-6 space-y-6">
            <div className="flex gap-6">
               <div className="w-24 h-24 rounded-full bg-slate-200 dark:bg-slate-800 shrink-0 overflow-hidden border border-slate-300 dark:border-slate-700">
                  {formData.avatarUrl ? (
                    <img src={formData.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-400">No Image</div>
                  )}
               </div>
               <div className="flex-1 space-y-2">
                 <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Avatar URL</label>
                 <input
                   type="text"
                   name="avatarUrl"
                   value={formData.avatarUrl}
                   onChange={handleChange}
                   placeholder="https://example.com/image.jpg"
                   className="w-full border border-slate-300 dark:border-slate-700 rounded-md p-2 bg-transparent focus:ring-2 focus:ring-blue-500 outline-none text-slate-900 dark:text-slate-100 text-sm"
                 />
                 <p className="text-[12px] text-slate-500 dark:text-slate-400">Provide a URL for your profile picture.</p>
               </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">First Name</label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className="w-full border border-slate-300 dark:border-slate-700 rounded-md p-2 bg-transparent focus:ring-2 focus:ring-blue-500 outline-none text-slate-900 dark:text-slate-100"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Last Name</label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className="w-full border border-slate-300 dark:border-slate-700 rounded-md p-2 bg-transparent focus:ring-2 focus:ring-blue-500 outline-none text-slate-900 dark:text-slate-100"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Bio</label>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                rows={4}
                placeholder="Tell us about yourself..."
                className="w-full border border-slate-300 dark:border-slate-700 rounded-md p-2 bg-transparent focus:ring-2 focus:ring-blue-500 outline-none text-slate-900 dark:text-slate-100 resize-none"
              />
            </div>

            <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex justify-end items-center gap-4">
              {status === "success" && <span className="text-sm text-green-600 dark:text-green-400 font-medium">Profile updated!</span>}
              {status === "error" && <span className="text-sm text-red-600 dark:text-red-400 font-medium">Failed to update</span>}
              <button
                onClick={handleSave}
                disabled={status === "saving"}
                className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2 rounded-md font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                <Save size={18} />
                {status === "saving" ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      </main>
      <RightSidebar />
    </div>
  );
}
