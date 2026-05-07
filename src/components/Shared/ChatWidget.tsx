import React, { useState, useEffect, useRef } from "react";
import {
  FiMessageSquare,
  FiX,
  FiSend,
  FiUser,
  FiCircle,
  FiPaperclip,
  FiImage,
} from "react-icons/fi";
import { useSocketStore } from "../../store/useSocketStore";
import { useAuthStore } from "../../features/auth/authStore";
import { axiosSecure } from "../../api/axios";
import moment from "moment";
import { toast } from "sonner";

import { Message } from "../../features/chat/types";

const ChatWidget = () => {
  const { user } = useAuthStore();
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [role, setRole] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const { socket, connected } = useSocketStore();
  const scrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const ADMIN_EMAIL = "admin@gram2city.com";
  const conversationId = user ? [user.email, ADMIN_EMAIL].sort().join("_") : "";

  useEffect(() => {
    if (user) {
      axiosSecure.get(`/users/${user.email}`).then((res) => {
        setRole(res.data.role);
      });
    }
  }, [user, axiosSecure]);

  useEffect(() => {
    if (isOpen && socket && user && conversationId) {
      socket.emit("join_chat", conversationId);

      axiosSecure.get(`/messages/${conversationId}`).then((res) => {
        setMessages(res.data.data);
      });

      const handleReceive = (newMsg: Message) => {
        setMessages((prev) => [...prev, newMsg]);
      };

      socket.on("receive_message", handleReceive);

      socket.on("user_typing", (data) => {
        if (data.senderEmail !== user.email) {
          setIsTyping(true);
          setTimeout(() => setIsTyping(false), 3000);
        }
      });

      return () => {
        socket.off("receive_message", handleReceive);
        socket.off("user_typing");
      };
    }
  }, [isOpen, socket, user, conversationId, axiosSecure]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = (e?: React.FormEvent, imageUrl?: string) => {
    e?.preventDefault();
    if ((!message.trim() && !imageUrl) || !socket || !user) return;

    const chatData = {
      senderEmail: user.email,
      senderName: user.displayName,
      senderRole: role,
      receiverEmail: ADMIN_EMAIL,
      message: message.trim(),
      imageUrl: imageUrl || null,
      conversationId,
    };

    socket.emit("send_message", chatData);
    setMessage("");
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
    } catch {
      toast.error("Failed to upload image. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const handleTyping = () => {
    if (user) {
      socket?.emit("typing", { conversationId, senderEmail: user.email });
    }
  };

  if (!user || role === "admin" || role === "superAdmin") return null;

  return (
    <div className="fixed bottom-8 right-8 z-[9999] font-outfit">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-16 h-16 rounded-full shadow-2xl flex items-center justify-center transition-all duration-500 hover:scale-110 active:scale-95 ${
          isOpen ? "bg-gray-800 rotate-90" : "bg-primary text-white"
        }`}
      >
        {isOpen ? (
          <FiX className="text-2xl" />
        ) : (
          <FiMessageSquare className="text-2xl" />
        )}
        {!isOpen && messages.length > 0 && (
          <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-[10px] font-black rounded-full flex items-center justify-center animate-bounce">
            !
          </div>
        )}
      </button>

      {isOpen && (
        <div className="absolute bottom-20 right-0 w-[380px] h-[550px] bg-white rounded-[2rem] shadow-2xl border border-gray-100 flex flex-col overflow-hidden animate-in slide-in-from-bottom-10 fade-in duration-500">
          <div className="p-6 bg-gray-900 text-white flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary/20 rounded-xl flex items-center justify-center">
                <FiUser className="text-primary text-xl" />
              </div>
              <div>
                <h4 className="font-black text-sm tracking-tight">
                  Gram2City Support
                </h4>
                <div className="flex items-center gap-1.5">
                  <FiCircle
                    className={`text-[8px] fill-current ${connected ? "text-emerald-500" : "text-gray-500"}`}
                  />
                  <span className="text-[10px] font-bold opacity-60 uppercase tracking-widest">
                    {connected ? "Online" : "Connecting..."}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50/50">
            {messages.length === 0 && (
              <div className="text-center py-10 opacity-30">
                <FiMessageSquare className="text-4xl mx-auto mb-2" />
                <p className="text-xs font-bold uppercase tracking-widest">
                  Start a conversation
                </p>
              </div>
            )}
            {messages.map((msg, idx) => {
              const isMe = msg.senderEmail === user?.email;
              return (
                <div
                  key={idx}
                  className={`flex ${isMe ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[80%] p-4 rounded-2xl text-sm shadow-sm ${
                      isMe
                        ? "bg-primary text-white rounded-tr-none"
                        : "bg-white text-gray-800 rounded-tl-none border border-gray-100"
                    }`}
                  >
                    {msg.imageUrl && (
                      <img
                        src={msg.imageUrl}
                        alt="Shared"
                        className="rounded-xl mb-2 w-full max-h-60 object-cover cursor-pointer hover:opacity-90 transition-opacity shadow-sm"
                        onClick={() =>
                          msg.imageUrl && window.open(msg.imageUrl, "_blank")
                        }
                      />
                    )}
                    {msg.message && (
                      <p className="leading-relaxed font-medium">
                        {msg.message}
                      </p>
                    )}
                    <span
                      className={`text-[9px] block mt-2 font-bold opacity-50 ${isMe ? "text-right" : "text-left"}`}
                    >
                      {moment(msg.timestamp).format("hh:mm A")}
                    </span>
                  </div>
                </div>
              );
            })}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-white px-4 py-2 rounded-2xl border border-gray-100 flex gap-1">
                  <div className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce"></div>
                  <div className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                  <div className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                </div>
              </div>
            )}
            <div ref={scrollRef} />
          </div>

          <form
            onSubmit={handleSendMessage}
            className="p-4 bg-white border-t border-gray-50 flex gap-2 items-center"
          >
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
              className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${
                uploading
                  ? "bg-gray-50 text-gray-300"
                  : "bg-gray-50 text-gray-400 hover:text-primary hover:bg-primary/5"
              }`}
            >
              {uploading ? (
                <FiImage className="animate-pulse" />
              ) : (
                <FiPaperclip className="text-lg" />
              )}
            </button>
            <input
              type="text"
              placeholder="Type your message..."
              className="flex-1 h-12 bg-gray-50 border-none rounded-xl px-4 text-sm focus:ring-2 focus:ring-primary/20"
              value={message}
              onChange={(e) => {
                setMessage(e.target.value);
                handleTyping();
              }}
            />
            <button
              type="submit"
              className="w-12 h-12 bg-primary text-white rounded-xl flex items-center justify-center shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-transform"
            >
              <FiSend className="text-lg" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default ChatWidget;
