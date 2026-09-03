import { useState, useRef, useEffect } from "react";
import { sendChatMessage } from "../api";

const QUICK_PROMPTS = [
  "How does 0% EMI work?",
  "Am I eligible?",
  "Are my mutual funds safe?",
  "What documents are needed?",
  "What is the cashback offer?",
  "Recommend the best laptop",
];

const INITIAL_MESSAGES = [
  {
    id: "welcome-1",
    sender: "bot",
    text: "👋 Hi there! I'm your Glide fintech assistant. Ask me anything about our 0% interest EMI plans, mutual fund backing, or product recommendations!",
    time: "Just now",
  },
];

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [hasAnimatedBadge, setHasAnimatedBadge] = useState(false);

  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom of chat
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isTyping, isOpen]);

  // Gentle bounce badge once on load
  useEffect(() => {
    const timer = setTimeout(() => setHasAnimatedBadge(true), 1200);
    return () => clearTimeout(timer);
  }, []);

  const handleSendMessage = async (textToSend) => {
    const query = (textToSend || input).trim();
    if (!query) return;

    const userMsg = {
      id: `user-${Date.now()}`,
      sender: "user",
      text: query,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    try {
      // Call backend /api/chat endpoint
      const res = await sendChatMessage(query);
      setTimeout(() => {
        setIsTyping(false);
        setMessages((prev) => [
          ...prev,
          {
            id: `bot-${Date.now()}`,
            sender: "bot",
            text: res.reply,
            time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          },
        ]);
      }, 600);
    } catch (e) {
      setTimeout(() => {
        setIsTyping(false);
        setMessages((prev) => [
          ...prev,
          {
            id: `bot-${Date.now()}`,
            sender: "bot",
            text:
              "Glide offers 0% EMI up to 24 months backed by liquid mutual funds with zero paperwork. Feel free to browse our Shop catalog or ask another question!",
            time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          },
        ]);
      }, 500);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Floating Trigger Button */}
      {!isOpen && (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          aria-label="Open Glide Assistant Chat"
          className={`
            w-14 h-14 rounded-full bg-accent hover:bg-accent-hover text-white flex items-center justify-center shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer relative group
            ${!hasAnimatedBadge ? "animate-bounce" : ""}
          `}
        >
          <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
            />
          </svg>

          {/* Online green indicator */}
          <span className="absolute top-0 right-0 w-3.5 h-3.5 bg-emerald-500 border-2 border-white rounded-full"></span>
        </button>
      )}

      {/* Expanded Chat Window */}
      {isOpen && (
        <div className="bg-white rounded-3xl border border-divider shadow-2xl w-[360px] sm:w-[400px] h-[540px] flex flex-col overflow-hidden animate-slide-up">
          {/* Header */}
          <div className="bg-accent text-white p-4.5 flex items-center justify-between shadow-xs">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-white/15 flex items-center justify-center text-lg font-bold">
                ⚡
              </div>
              <div>
                <h3 className="text-[15px] font-bold text-white tracking-tight">
                  Glide Assistant
                </h3>
                <span className="text-[11px] text-accent-subtle flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                  Instant Fintech FAQ Bot
                </span>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white text-sm cursor-pointer transition-colors"
            >
              ✕
            </button>
          </div>

          {/* Messages Body */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3.5 bg-page-subtle/50">
            {messages.map((msg) => {
              const isUser = msg.sender === "user";
              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isUser ? "items-end" : "items-start"}`}
                >
                  <div
                    className={`
                      max-w-[85%] p-3.5 rounded-2xl text-[13.5px] leading-relaxed
                      ${
                        isUser
                          ? "bg-accent text-white rounded-br-xs shadow-xs"
                          : "bg-white text-primary border border-divider rounded-bl-xs shadow-xs"
                      }
                    `}
                  >
                    {msg.text}
                  </div>
                  <span className="text-[10px] text-tertiary mt-1 px-1">{msg.time}</span>
                </div>
              );
            })}

            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex items-center gap-1.5 bg-white border border-divider px-4 py-2.5 rounded-2xl rounded-bl-xs w-fit shadow-xs">
                <span className="w-2 h-2 rounded-full bg-accent animate-bounce"></span>
                <span className="w-2 h-2 rounded-full bg-accent animate-bounce [animation-delay:0.2s]"></span>
                <span className="w-2 h-2 rounded-full bg-accent animate-bounce [animation-delay:0.4s]"></span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompts Chips */}
          <div className="p-2.5 bg-white border-t border-divider overflow-x-auto flex gap-1.5">
            {QUICK_PROMPTS.map((prompt, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSendMessage(prompt)}
                className="px-3 py-1 rounded-full bg-page-subtle hover:bg-accent-light text-secondary hover:text-accent border border-divider hover:border-accent text-[11px] font-semibold whitespace-nowrap transition-colors cursor-pointer"
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Input Form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="p-3 bg-white border-t border-divider flex items-center gap-2"
          >
            <input
              type="text"
              placeholder="Ask about EMI, eligibility, cashback…"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 px-4 py-2.5 rounded-xl border border-divider bg-page-subtle text-[13px] text-primary focus:bg-white focus:border-accent"
            />
            <button
              type="submit"
              disabled={!input.trim() || isTyping}
              className={`
                p-2.5 rounded-xl bg-accent text-white flex items-center justify-center transition-colors cursor-pointer
                ${!input.trim() || isTyping ? "opacity-50 cursor-not-allowed" : "hover:bg-accent-hover"}
              `}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
