"use client";

import { useState, useEffect, useRef } from "react";
import Sidebar from "@/components/Sidebar";
import { useAuth } from "@/components/AuthProvider";
import { io, Socket } from "socket.io-client";
import { Send } from "lucide-react";

export default function Messages() {
  const { accessToken, user } = useAuth();
  const [threads, setThreads] = useState<any[]>([]);
  const [activeThreadId, setActiveThreadId] = useState<string | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const socketRef = useRef<Socket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Fetch threads
  useEffect(() => {
    const fetchThreads = async () => {
      if (!accessToken) return;
      try {
        const res = await fetch("http://localhost:3001/api/chat/threads", {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        if (res.ok) {
          const data = await res.json();
          // The backend returns latest messages. We group them to form threads.
          setThreads(data);
          if (data.length > 0 && !activeThreadId) {
            setActiveThreadId(data[0].threadId);
          }
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchThreads();
  }, [accessToken, activeThreadId]);

  // Fetch messages for active thread
  useEffect(() => {
    const fetchMessages = async () => {
      if (!accessToken || !activeThreadId) return;
      try {
        const res = await fetch(`http://localhost:3001/api/chat/threads/${activeThreadId}`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        if (res.ok) {
          const data = await res.json();
          // Backend returns desc order (newest first). Reverse for display (oldest first).
          setMessages(data.messages.reverse());
          scrollToBottom();
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchMessages();
  }, [activeThreadId, accessToken]);

  // WebSocket Connection
  useEffect(() => {
    if (!accessToken) return;

    socketRef.current = io("http://localhost:3001", {
      auth: { token: accessToken },
    });

    socketRef.current.on("message:receive", (data: any) => {
      if (data.threadId === activeThreadId) {
        setMessages((prev) => [...prev, data]);
        scrollToBottom();
      } else {
        // Optional: Update thread list showing unread or latest message
      }
    });

    return () => {
      socketRef.current?.disconnect();
    };
  }, [accessToken, activeThreadId]);

  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  const handleSendMessage = () => {
    if (!newMessage.trim() || !activeThreadId || !socketRef.current) return;

    // Send via WebSocket
    socketRef.current.emit("message:send", {
      threadId: activeThreadId,
      content: newMessage,
    });

    setNewMessage("");
  };

  // Helper to extract the *other* user ID from a threadId (assuming userA_userB format)
  const getOtherParticipant = (threadId: string) => {
    if (!user) return threadId;
    return threadId.replace(user.id, "").replace("_", "");
  };

  return (
    <div className="flex h-screen overflow-hidden max-w-7xl mx-auto">
      <Sidebar />
      <main className="flex-1 flex border-l border-slate-200 h-full">
        {/* Threads Pane */}
        <div className="w-1/3 border-r border-slate-200 bg-white flex flex-col h-full overflow-y-auto">
          <div className="p-4 border-b border-slate-100 font-bold text-lg sticky top-0 bg-white/90 backdrop-blur-md z-10">
            Messages
          </div>
          <div className="divide-y divide-slate-100">
            {threads.map((t) => (
              <button
                key={t.id}
                onClick={() => setActiveThreadId(t.threadId)}
                className={`w-full text-left p-4 hover:bg-slate-50 transition-colors flex gap-3 ${activeThreadId === t.threadId ? 'bg-slate-50' : ''}`}
              >
                <div className="w-12 h-12 rounded-full bg-slate-200 shrink-0 overflow-hidden">
                  {/* Mock avatar */}
                </div>
                <div className="flex-1 overflow-hidden">
                  <div className="font-semibold text-sm truncate">
                    User {getOtherParticipant(t.threadId).slice(0, 8)}...
                  </div>
                  <div className="text-sm text-slate-500 truncate mt-0.5">{t.content}</div>
                </div>
              </button>
            ))}
            {threads.length === 0 && (
              <div className="p-4 text-center text-slate-500 text-sm mt-10">
                No active conversations.
              </div>
            )}
          </div>
        </div>

        {/* Active Chat Pane */}
        <div className="flex-1 bg-slate-50 flex flex-col h-full relative">
          {activeThreadId ? (
            <>
              {/* Chat Header */}
              <div className="p-4 bg-white border-b border-slate-200 shadow-sm flex items-center gap-3 z-10">
                <div className="w-10 h-10 rounded-full bg-slate-200 shrink-0 overflow-hidden">
                  {/* Mock avatar */}
                </div>
                <div className="font-semibold text-slate-900">
                  User {getOtherParticipant(activeThreadId).slice(0, 8)}...
                </div>
              </div>

              {/* Chat Messages */}
              <div className="flex-1 p-4 overflow-y-auto space-y-4">
                {messages.map((m, i) => {
                  const isMine = m.senderId === user?.id;
                  return (
                    <div key={i} className={`flex flex-col ${isMine ? 'items-end' : 'items-start'}`}>
                      <div
                        className={`max-w-[70%] px-4 py-2 rounded-2xl ${
                          isMine
                            ? 'bg-blue-600 text-white rounded-br-sm'
                            : 'bg-white border border-slate-200 text-slate-900 rounded-bl-sm shadow-sm'
                        }`}
                      >
                        {m.content}
                      </div>
                      <div className="text-[11px] text-slate-400 mt-1 px-1">
                        {new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>

              {/* Chat Input */}
              <div className="p-4 bg-white border-t border-slate-200">
                <div className="relative flex items-center">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleSendMessage();
                    }}
                    placeholder="Type a message..."
                    className="w-full bg-slate-100 border-none rounded-full pl-5 pr-12 py-3 text-[14px] focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={!newMessage.trim()}
                    className="absolute right-2 p-2 text-blue-600 disabled:opacity-40 hover:bg-blue-50 rounded-full transition-colors"
                  >
                    <Send size={18} />
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-slate-400">
              Select a thread to start messaging
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
