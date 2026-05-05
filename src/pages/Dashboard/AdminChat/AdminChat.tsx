import React, { useState, useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import useAuth from "../../../hooks/useAuth";
import { useSocket } from "../../../contexts/SocketContext";
import { FiMessageSquare, FiSend, FiUser, FiSearch, FiClock, FiCheck, FiPaperclip, FiImage } from "react-icons/fi";
import moment from "moment";
import { toast } from "sonner";

const AdminChat = () => {
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();
  const [role, setRole] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const { socket } = useSocket();
  const [activeConversation, setActiveConversation] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (user) {
      axiosSecure.get(`/users/${user.email}`).then((res) => {
        setRole(res.data.role);
      });
    }
  }, [user, axiosSecure]);

  const { data: conversations = [], refetch: refetchConversations } = useQuery({
    queryKey: ["conversations"],
    queryFn: async () => {
      const res = await axiosSecure.get("/messages/conversations");
      return res.data.data;
    },
    enabled: !!user,
  });

  useEffect(() => {
    if (activeConversation && socket && user) {
      socket.emit("join_chat", activeConversation._id);
      
      axiosSecure.get(`/messages/${activeConversation._id}`).then((res) => {
        setMessages(res.data.data);
      });

      const handleReceive = (msg: any) => {
        if (msg.conversationId === activeConversation._id) {
          setMessages((prev) => [...prev, msg]);
        }
        refetchConversations();
      };

      socket.on("receive_message", handleReceive);

      return () => {
        socket.off("receive_message", handleReceive);
      };
    }
  }, [activeConversation, socket, user, axiosSecure, refetchConversations]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = (e?: React.FormEvent, imageUrl?: string) => {
    e?.preventDefault();
    if ((!newMessage.trim() && !imageUrl) || !activeConversation || !socket || !user) return;

    const chatData = {
      senderEmail: user.email,
      senderName: user.displayName,
      senderRole: role,
      receiverEmail: activeConversation.lastMessage.senderEmail === user.email 
        ? activeConversation.lastMessage.receiverEmail 
        : activeConversation.lastMessage.senderEmail,
      message: newMessage.trim(),
      imageUrl: imageUrl || null,
      conversationId: activeConversation._id,
    };

    socket.emit("send_message", chatData);
    setNewMessage("");
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("image", file);

    try {
      const res = await axiosSecure.post("/upload", formData);
      handleSendMessage(undefined, res.data.url);
    } catch (error) {
      toast.error("Image upload failed.");
    } finally {
      setUploading(false);
    }
  };

  if (!user) return null;

  return (
    <div className="h-[calc(100vh-160px)] flex bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden font-outfit">
      {/* Sidebar: Conversation List */}
      <div className="w-80 border-r border-gray-100 flex flex-col bg-gray-50/30">
        <div className="p-6 border-b border-gray-100 bg-white">
          <h2 className="text-xl font-black text-gray-800 tracking-tight mb-4">Messages</h2>
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search conversations..." 
              className="w-full bg-gray-50 border-none rounded-xl pl-10 h-10 text-xs font-bold"
            />
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto">
          {conversations.map((conv: any) => (
            <button
              key={conv._id}
              onClick={() => setActiveConversation(conv)}
              className={`w-full p-4 flex gap-3 hover:bg-white transition-all border-b border-gray-50 text-left ${activeConversation?._id === conv._id ? "bg-white ring-2 ring-primary/5 z-10 shadow-sm" : ""}`}
            >
              <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 shrink-0">
                <FiUser className="text-xl" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-black text-sm text-gray-800 truncate">
                    {conv.lastMessage.senderEmail === user.email ? conv.lastMessage.receiverEmail : conv.lastMessage.senderName}
                  </span>
                  <span className="text-[9px] font-bold text-gray-400 uppercase">{moment(conv.lastMessage.timestamp).format("HH:mm")}</span>
                </div>
                <p className="text-[11px] text-gray-500 truncate font-medium">{conv.lastMessage.message}</p>
              </div>
              {conv.unreadCount > 0 && (
                <div className="w-5 h-5 bg-primary text-white text-[10px] font-black rounded-full flex items-center justify-center">
                  {conv.unreadCount}
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Main: Chat Area */}
      <div className="flex-1 flex flex-col bg-white">
        {activeConversation ? (
          <>
            {/* Chat Header */}
            <div className="px-8 py-4 border-b border-gray-50 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center">
                  <FiUser className="text-xl" />
                </div>
                <div>
                  <h3 className="font-black text-gray-800 text-sm">
                     {activeConversation.lastMessage.senderEmail === user.email ? activeConversation.lastMessage.receiverEmail : activeConversation.lastMessage.senderName}
                  </h3>
                  <p className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest flex items-center gap-1">
                    <FiClock /> Active Support Session
                  </p>
                </div>
              </div>
            </div>

            {/* Message Thread */}
            <div className="flex-1 overflow-y-auto p-8 space-y-6 bg-gray-50/20">
              {messages.map((msg: any, idx: number) => {
                const isMe = msg.senderEmail === user.email;
                return (
                  <div key={idx} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
                    <div className="flex flex-col gap-1 max-w-[70%]">
                      <div className={`p-4 rounded-2xl text-sm shadow-sm ${
                        isMe 
                          ? "bg-gray-900 text-white rounded-tr-none" 
                          : "bg-white text-gray-800 rounded-tl-none border border-gray-100"
                      }`}>
                        {msg.imageUrl && (
                          <img 
                            src={msg.imageUrl} 
                            alt="Shared" 
                            className="rounded-xl mb-2 w-full max-h-80 object-cover cursor-pointer hover:opacity-90 transition-opacity"
                            onClick={() => window.open(msg.imageUrl, '_blank')}
                          />
                        )}
                        {msg.message && <p className="leading-relaxed font-medium">{msg.message}</p>}
                      </div>
                      <div className={`flex items-center gap-1 text-[9px] font-bold text-gray-400 ${isMe ? "justify-end" : "justify-start"}`}>
                        {moment(msg.timestamp).format("hh:mm A")}
                        {isMe && <FiCheck className="text-primary" />}
                      </div>
                    </div>
                  </div>
                );
              })}
              <div ref={scrollRef} />
            </div>

            {/* Input Footer */}
            <form onSubmit={handleSendMessage} className="p-6 border-t border-gray-50 bg-white flex gap-4">
              <input 
                type="file" 
                className="hidden" 
                ref={fileInputRef} 
                accept="image/*"
                onChange={handleImageUpload}
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all ${
                  uploading ? "bg-gray-50 text-gray-300" : "bg-gray-50 text-gray-400 hover:text-primary hover:bg-primary/5"
                }`}
              >
                {uploading ? <FiImage className="animate-pulse" /> : <FiPaperclip className="text-xl" />}
              </button>
              <input
                type="text"
                placeholder="Type a professional response..."
                className="flex-1 bg-gray-50 border-none rounded-2xl px-6 h-14 text-sm font-medium focus:ring-4 focus:ring-primary/5 transition-all"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
              />
              <button
                type="submit"
                className="w-14 h-14 bg-primary text-white rounded-2xl flex items-center justify-center shadow-xl shadow-primary/20 hover:scale-105 active:scale-95 transition-transform"
              >
                <FiSend className="text-xl" />
              </button>
            </form>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-10 opacity-20">
            <FiMessageSquare className="text-8xl mb-4" />
            <h3 className="text-2xl font-black uppercase tracking-widest">Select a Conversation</h3>
            <p className="max-w-xs font-bold mt-2">Select a thread from the left to start coordinating in real-time.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminChat;
