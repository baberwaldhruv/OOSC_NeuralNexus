import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { rtiService } from "../../services/apiServices";
import { useAuth } from "../../Context/AuthContext";

// Modular Component Imports
import Sidebar from "../sidebar";
import Header from "../Header";
import WelcomeScreen from "../WelcomeScreen";
import ChatStream from "../ChatStream";
import PromptInput from "../PromptInput";

export default function RtiGeminiChat() {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const [recentChats, setRecentChats] = useState([]);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);

  const messagesEndRef = useRef(null);

  // Load chat history for the Sidebar
  const fetchRecentChats = async () => {
    try {
      const res = await rtiService.listCases();
      const formatted = (res.data || []).map((c) => ({
        id: c.id,
        sessionId: c.session_id,
        title: c.issue || "New Legal Draft",
      }));
      setRecentChats(formatted);
    } catch (err) {
      console.error("Failed to load chat history", err);
    }
  };

  useEffect(() => {
    fetchRecentChats();
  }, []);

  // Load active session messages when sessionId changes in URL
  useEffect(() => {
    if (!sessionId) {
      setMessages([]);
      return;
    }

    async function loadActiveSession() {
      try {
        setLoading(true);
        const msgRes = await rtiService.getMessages(sessionId);
        // Normalize backend schema { message, role } to ChatStream format { content, role }
        const mapped = (msgRes.data || []).map((m) => ({
          role: m.role,
          content: m.message,
        }));
        setMessages(mapped);
      } catch (err) {
        console.error("Error loading chat messages:", err);
      } finally {
        setLoading(false);
      }
    }

    loadActiveSession();
  }, [sessionId]);

  // Auto-scroll on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, sending]);

  // Sidebar Actions
  const handleNewChat = () => {
    navigate("/");
  };

  const handleSelectChat = (chat) => {
    navigate(`/${chat.sessionId}`);
  };

  const handleClearHistory = () => {
    setRecentChats([]);
    navigate("/");
  };

  // Submit Prompt Handler
  const handleSendMessage = async () => {
    if (!input.trim() || sending) return;

    const userText = input.trim();
    setInput("");

    let activeSessionId = sessionId;

    // If submitted from WelcomeScreen (root path), initialize session in backend
    if (!activeSessionId) {
      try {
        setSending(true);
        const newCaseRes = await rtiService.createCase();
        activeSessionId = newCaseRes.data?.session_id;
        navigate(`/${activeSessionId}`, { replace: true });
        await fetchRecentChats();
      } catch (err) {
        alert(err.message || "Failed to initialize chat session.");
        setSending(false);
        return;
      }
    }

    // Optimistic UI update
    setMessages((prev) => [
      ...prev,
      { role: "user", content: userText },
    ]);
    setSending(true);

    try {
      const res = await rtiService.sendMessage(activeSessionId, userText);
      if (res.data?.response) {
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: res.data.response },
        ]);
      }
      fetchRecentChats();
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: err.message || "Failed to fetch response. Please retry.",
          isError: true,
        },
      ]);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="flex h-screen w-screen bg-[#131314] text-[#e3e3e3] font-sans antialiased overflow-hidden">
      {/* 1. Connected Collapsible Sidebar */}
      <Sidebar
        onNewChat={handleNewChat}
        recentChats={recentChats}
        onSelectChat={handleSelectChat}
        onClearHistory={handleClearHistory}
      />

      {/* 2. Main Viewport */}
      <div className="flex-1 flex flex-col h-full min-w-0 relative bg-[#131314]">
        {/* Model Selector & User Header */}
        <Header />

        {/* Dynamic Center Stage */}
        <main className="flex-1 flex flex-col h-full min-h-0 relative overflow-y-auto">
          {!sessionId && messages.length === 0 ? (
            /* Welcome Screen when no active chat */
            <WelcomeScreen
              input={input}
              setInput={setInput}
              onSubmit={handleSendMessage}
              loading={sending}
            />
          ) : (
            /* Chat Conversation Stream */
            <>
              <ChatStream
                messages={messages}
                loading={sending}
                messagesEndRef={messagesEndRef}
              />

              {/* Floating Bottom Prompt Bar during Active Chat */}
              <PromptInput
                input={input}
                setInput={setInput}
                onSubmit={handleSendMessage}
                loading={sending}
              />
            </>
          )}
        </main>
      </div>
    </div>
  );
}