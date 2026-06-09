"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  FiMessageSquare,
  FiX,
  FiSend,
  FiUser,
  FiCircle,
  FiPaperclip,
  FiImage,
  FiLock,
} from "react-icons/fi";
import { useSocketStore } from "../../store/useSocketStore";
import { useAuthStore } from "../../features/auth/authStore";
import { axiosSecure } from "../../api/axios";
import moment from "moment";
import { toast } from "sonner";
import { uploadFile } from "../../features/chat/api";
import { useChatSocket } from "../../features/chat/useChatSocket";

const ChatWidget = () => {
  const { user } = useAuthStore();
  const [mounted, setMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [role, setRole] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const { connected } = useSocketStore();
  const scrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const lastTypingTimeRef = useRef<number>(0);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value);
    const now = Date.now();
    if (now - lastTypingTimeRef.current > 2000) {
      sendTyping();
      lastTypingTimeRef.current = now;
    }
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  const ADMIN_EMAIL = "admin@gram2city.com";
  const conversationId = user ? [user.email, ADMIN_EMAIL].sort().join("_") : "";

  const { messages, isTyping, sendMessage, markRead, sendTyping } =
    useChatSocket({
      conversationId,
      user: user
        ? {
            email: user.email ?? "",
            displayName: user.displayName,
            getIdToken: async () => {
              try {
                return await user.getIdToken();
              } catch {
                return "";
              }
            },
          }
        : null,
      onMessagesMarkedRead: () => {},
    });

  useEffect(() => {
    if (user) {
      axiosSecure.get(`/users/${user.email}`).then((res) => {
        setRole(res.data.role);
      });
    }
  }, [user]);

  useEffect(() => {
    if (isOpen && conversationId) markRead();
  }, [isOpen, conversationId, markRead]);

  const prevMessagesLengthRef = useRef(messages.length);

  useEffect(() => {
    const isNewMessage = messages.length > prevMessagesLengthRef.current;
    scrollRef.current?.scrollIntoView({
      behavior: isNewMessage ? "smooth" : "auto",
    });
    prevMessagesLengthRef.current = messages.length;
  }, [messages, isOpen]);

  const handleSendMessage = (e?: React.FormEvent, imageUrl?: string) => {
    e?.preventDefault();
    if ((!message.trim() && !imageUrl) || !user) return;

    const text = imageUrl ? "" : message.trim();
    sendMessage(text, imageUrl || null);
    setMessage("");
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const url = await uploadFile(file);
      handleSendMessage(undefined, url);
    } catch {
      toast.error("Failed to upload image. Please try again.");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  if (!mounted) return null;

  if (role === "admin" || role === "superAdmin") return null;

  // ── Guest panel (not logged in) ─────────────────────────────────────────────
  if (!user) {
    return (
      <div className="fixed bottom-8 right-8 z-50 font-sans">
        <button
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Open support chat"
          className="w-14 h-14 rounded-full border border-gray-200 bg-white shadow-sm hover:shadow-md transition-all flex items-center justify-center text-gray-600 hover:text-gray-900"
        >
          {isOpen ? (
            <FiX className="text-xl" />
          ) : (
            <FiMessageSquare className="text-xl" />
          )}
        </button>

        {isOpen && (
          <div className="absolute bottom-20 right-0 w-80 bg-white rounded-xl border border-gray-200 shadow-lg overflow-hidden transition-all">
            <div className="p-5 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-gray-500">
                  <FiUser className="text-lg" />
                </div>
                <div>
                  <h4 className="font-semibold text-sm text-gray-800">
                    Support
                  </h4>
                  <span className="text-xs text-gray-400">
                    We’re here to help
                  </span>
                </div>
              </div>
            </div>

            <div className="p-8 flex flex-col items-center text-center gap-5">
              <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center text-gray-400">
                <FiLock className="text-xl" />
              </div>
              <div>
                <h5 className="font-medium text-gray-800 mb-1">
                  Sign in to chat
                </h5>
                <p className="text-sm text-gray-500 leading-relaxed">
                  Create an account or log in to start a conversation with our
                  support team.
                </p>
              </div>
              <Link
                href="/login"
                className="w-full py-2.5 bg-gray-800 text-white text-sm font-medium rounded-lg text-center hover:bg-gray-900 transition-colors"
              >
                Log in
              </Link>
              <Link
                href="/register"
                className="w-full py-2.5 bg-gray-50 text-gray-700 text-sm font-medium rounded-lg text-center hover:bg-gray-100 transition-colors"
              >
                Create account
              </Link>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="fixed bottom-8 right-8 z-50 font-sans">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 rounded-full border border-gray-200 bg-white shadow-sm hover:shadow-md transition-all flex items-center justify-center text-gray-600 hover:text-gray-900"
      >
        {isOpen ? (
          <FiX className="text-xl" />
        ) : (
          <FiMessageSquare className="text-xl" />
        )}
        {!isOpen &&
          messages.some(
            (msg) => !msg.isRead && msg.senderEmail !== user?.email,
          ) && (
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
              !
            </span>
          )}
      </button>

      {isOpen && (
        <div className="absolute bottom-20 right-0 w-90 h-125 bg-white rounded-xl border border-gray-200 shadow-xl flex flex-col overflow-hidden transition-all">
          {/* Header */}
          <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-white">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-gray-500">
                <FiUser className="text-lg" />
              </div>
              <div>
                <h4 className="font-semibold text-sm text-gray-800">Support</h4>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <FiCircle
                    className={`text-[8px] ${
                      connected ? "text-emerald-500" : "text-gray-400"
                    }`}
                  />
                  <span className="text-xs text-gray-400">
                    {connected ? "Online" : "Connecting..."}
                  </span>
                </div>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <FiX />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-gray-50">
            {messages.length === 0 && (
              <div className="text-center py-12 text-gray-300">
                <FiMessageSquare className="text-3xl mx-auto mb-2" />
                <p className="text-xs font-medium">Start a conversation</p>
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
                    className={`max-w-[80%] px-4 py-3 rounded-xl text-sm ${
                      isMe
                        ? "bg-gray-800 text-white rounded-br-none"
                        : "bg-white text-gray-800 rounded-bl-none border border-gray-100"
                    }`}
                  >
                    {msg.imageUrl && (
                      <Image
                        src={msg.imageUrl}
                        alt="Shared image"
                        width={300}
                        height={240}
                        className="rounded-lg mb-2 w-full max-h-56 object-cover cursor-pointer hover:opacity-90 transition-opacity"
                        onClick={() =>
                          msg.imageUrl && window.open(msg.imageUrl, "_blank")
                        }
                      />
                    )}
                    {msg.message && (
                      <p className="leading-relaxed">{msg.message}</p>
                    )}
                    <span
                      className={`text-[10px] block mt-2 font-medium opacity-60 ${
                        isMe ? "text-right text-gray-300" : "text-gray-400"
                      }`}
                    >
                      {moment(msg.timestamp).format("hh:mm A")}
                    </span>
                  </div>
                </div>
              );
            })}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-white px-4 py-2 rounded-xl border border-gray-100 flex gap-1.5">
                  <div className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce"></div>
                  <div className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                  <div className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                </div>
              </div>
            )}
            <div ref={scrollRef} />
          </div>

          {/* Input */}
          <form
            onSubmit={handleSendMessage}
            className="p-3 bg-white border-t border-gray-100 flex gap-2 items-center"
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
              className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${
                uploading
                  ? "bg-gray-50 text-gray-300"
                  : "text-gray-400 hover:text-gray-600 hover:bg-gray-50"
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
              className="flex-1 h-10 bg-gray-50 border border-gray-200 rounded-lg px-3 text-sm focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-gray-400"
              value={message}
              onChange={handleInputChange}
            />
            <button
              type="submit"
              className="w-10 h-10 bg-gray-800 text-white rounded-lg flex items-center justify-center hover:bg-gray-900 transition-colors"
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
