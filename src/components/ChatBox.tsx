"use client";

import React, { useEffect, useState, useRef } from "react";
import { Send, User as UserIcon, MessageSquare } from "lucide-react";
import { SessionUser } from "@/lib/types";

interface ChatBoxProps {
  currentUserId: string;
  initialOtherUserId?: string;
  initialOrderId?: string;
}

export const ChatBox: React.FC<ChatBoxProps> = ({
  currentUserId,
  initialOtherUserId,
  initialOrderId,
}) => {
  const [messages, setMessages] = useState<any[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string>(initialOtherUserId || "");
  const [content, setContent] = useState("");
  const [sending, setSending] = useState(false);
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const fetchMessages = () => {
    fetch("/api/messages")
      .then((r) => r.json())
      .then((data) => {
        if (data?.messages) {
          setMessages(data.messages);
          if (!selectedUserId && data.messages.length > 0) {
            // Pick other user from first message
            const firstMsg = data.messages[0];
            const other = firstMsg.senderId === currentUserId ? firstMsg.receiverId : firstMsg.senderId;
            setSelectedUserId(other);
          }
        }
      })
      .catch((err) => console.error("Error fetching messages:", err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchMessages();
    const interval = setInterval(fetchMessages, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, selectedUserId]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() || !selectedUserId) return;

    setSending(true);
    try {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          receiverId: selectedUserId,
          orderId: initialOrderId || undefined,
          content,
        }),
      });

      if (res.ok) {
        setContent("");
        fetchMessages();
      }
    } catch (err) {
      console.error("Message send error:", err);
    } finally {
      setSending(false);
    }
  };

  // Group contacts from messages
  const contactMap = new Map<string, any>();
  messages.forEach((m) => {
    const isMeSender = m.senderId === currentUserId;
    const otherUser = isMeSender ? m.receiver : m.sender;
    if (otherUser && !contactMap.has(otherUser.id)) {
      contactMap.set(otherUser.id, otherUser);
    }
  });

  const contacts = Array.from(contactMap.values());

  const currentThread = messages.filter(
    (m) =>
      (m.senderId === currentUserId && m.receiverId === selectedUserId) ||
      (m.senderId === selectedUserId && m.receiverId === currentUserId)
  );

  const activeContact = contactMap.get(selectedUserId);

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 rounded-3xl bg-white border border-burgundy/10 shadow-sm overflow-hidden h-[600px]">
      {/* Contact List */}
      <div className="md:col-span-4 border-r border-charcoal/10 flex flex-col bg-cream-light/30">
        <div className="p-4 border-b border-charcoal/10">
          <h3 className="font-serif font-bold text-sm text-charcoal">
            Suhbatlar
          </h3>
        </div>

        <div className="flex-1 overflow-y-auto divide-y divide-charcoal/5">
          {contacts.length === 0 ? (
            <div className="p-6 text-center text-xs text-charcoal/50">
              Hozircha xabarlar yo‘q
            </div>
          ) : (
            contacts.map((c) => (
              <button
                key={c.id}
                onClick={() => setSelectedUserId(c.id)}
                className={`w-full p-4 text-left flex items-center gap-3 transition-colors ${
                  selectedUserId === c.id
                    ? "bg-cream font-bold border-l-4 border-burgundy"
                    : "hover:bg-cream-light"
                }`}
              >
                <div className="w-9 h-9 rounded-full bg-burgundy text-cream font-serif font-bold flex items-center justify-center text-xs flex-shrink-0">
                  {c.name?.charAt(0) || "U"}
                </div>
                <div className="overflow-hidden">
                  <p className="text-xs font-semibold text-charcoal truncate">{c.name}</p>
                  <p className="text-[10px] text-hotpink uppercase font-mono">{c.role}</p>
                </div>
              </button>
            ))
          )}
        </div>
      </div>

      {/* Chat Thread */}
      <div className="md:col-span-8 flex flex-col h-full bg-white">
        {/* Chat header */}
        <div className="p-4 border-b border-charcoal/10 flex items-center justify-between bg-cream-light/10">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-burgundy text-cream font-serif font-bold flex items-center justify-center text-xs">
              {activeContact?.name?.charAt(0) || "C"}
            </div>
            <div>
              <p className="text-xs font-bold text-charcoal">{activeContact?.name || "Foydalanuvchi"}</p>
              <p className="text-[10px] text-hotpink font-mono uppercase">{activeContact?.role}</p>
            </div>
          </div>
        </div>

        {/* Message bubbles */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-cream-light/20">
          {currentThread.length === 0 ? (
            <div className="text-center py-12 text-xs text-charcoal/40">
              Suhbatni boshlash uchun quyida xabar yozing.
            </div>
          ) : (
            currentThread.map((m) => {
              const isMe = m.senderId === currentUserId;
              return (
                <div
                  key={m.id}
                  className={`flex ${isMe ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-xs sm:max-w-md p-3.5 rounded-2xl text-xs space-y-1 ${
                      isMe
                        ? "bg-burgundy text-cream rounded-br-none shadow-sm"
                        : "bg-white border border-charcoal/10 text-charcoal rounded-bl-none shadow-sm"
                    }`}
                  >
                    <p className="leading-relaxed whitespace-pre-wrap">{m.content}</p>
                    <p
                      className={`text-[9px] font-mono text-right ${
                        isMe ? "text-cream/60" : "text-charcoal/40"
                      }`}
                    >
                      {new Date(m.createdAt).toLocaleTimeString("uz-UZ", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Message Input form */}
        <form onSubmit={handleSend} className="p-3 border-t border-charcoal/10 flex gap-2 bg-white">
          <input
            type="text"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Xabar yozing..."
            className="flex-1 px-4 py-2.5 rounded-xl border border-charcoal/20 text-xs text-charcoal focus:outline-none focus:border-burgundy bg-cream-light/30"
          />
          <button
            type="submit"
            disabled={sending || !content.trim()}
            className="px-5 py-2.5 rounded-xl bg-hotpink text-white text-xs font-semibold uppercase hover:bg-hotpink-hover shadow transition-all flex items-center gap-1.5 disabled:opacity-50"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Yuborish</span>
          </button>
        </form>
      </div>
    </div>
  );
};
