/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, @next/next/no-img-element */
"use client";

import { useState, useEffect } from "react";
import { useAuth } from "./AuthProvider";
import { io, Socket } from "socket.io-client";

export default function NotificationsWidget() {
  const { accessToken } = useAuth();
  const [unreadCount, setUnreadCount] = useState(0);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!accessToken) return;

    const fetchNotifications = async () => {
      try {
        const res = await fetch("http://localhost:3001/api/notifications?limit=10", {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        if (res.ok) {
          const data = await res.json();
          setNotifications(data.items);
          setUnreadCount(data.items.filter((n: any) => !n.isRead).length);
        }
      } catch (e) {
        console.error(e);
      }
    };
    fetchNotifications();

    const socket = io("http://localhost:3001", {
      auth: { token: accessToken },
    });

    socket.on("notification:new", (data) => {
      setUnreadCount(data.unreadCount);
      setNotifications((prev) => [data.notification, ...prev].slice(0, 10));
    });

    return () => {
      socket.disconnect();
    };
  }, [accessToken]);

  const markAllAsRead = async () => {
    if (!accessToken) return;
    try {
      await fetch("http://localhost:3001/api/notifications/read-all", {
        method: "POST",
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      setUnreadCount(0);
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    } catch (e) {
      console.error(e);
    }
  };

  const markAsRead = async (id: string) => {
    if (!accessToken) return;
    try {
      await fetch(`http://localhost:3001/api/notifications/${id}/read`, {
        method: "POST",
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (e) {
      console.error(e);
    }
  };

  if (!accessToken) return null;

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-slate-600 hover:text-black hover:bg-slate-100 rounded-full focus:outline-none"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
          <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
        </svg>
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 inline-flex items-center justify-center w-4 h-4 text-[10px] font-bold leading-none text-white bg-red-600 rounded-full">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white border border-slate-200 rounded-lg shadow-lg overflow-hidden z-50">
          <div className="flex justify-between items-center p-3 border-b border-slate-100 bg-slate-50">
            <h3 className="font-semibold text-sm">Notifications</h3>
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="text-xs text-blue-600 hover:underline"
              >
                Mark all as read
              </button>
            )}
          </div>
          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <p className="p-4 text-sm text-center text-slate-500">No notifications</p>
            ) : (
              notifications.map((n) => (
                <div
                  key={n.id}
                  onClick={() => !n.isRead && markAsRead(n.id)}
                  className={`p-3 border-b border-slate-50 flex gap-3 cursor-pointer hover:bg-slate-50 ${!n.isRead ? 'bg-blue-50/50' : ''}`}
                >
                  <div className="w-8 h-8 rounded-full bg-slate-200 shrink-0 overflow-hidden">
                    {n.actor?.avatarUrl && <img src={n.actor.avatarUrl} alt="" className="w-full h-full object-cover" />}
                  </div>
                  <div>
                    <p className="text-sm">
                      <span className="font-semibold">{n.actor?.firstName || "Someone"} {n.actor?.lastName || ""}</span>{' '}
                      {n.type === 'FOLLOW' ? 'started following you.' : n.type === 'REACTION' ? 'reacted to your post.' : 'commented on your post.'}
                    </p>
                    <p className="text-xs text-slate-500 mt-1">{new Date(n.createdAt).toLocaleString()}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
