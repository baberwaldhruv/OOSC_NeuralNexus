import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { rtiService } from "../services/apiServices";
import { useAuth } from "../Context/AuthContext";
import { FileCheck, Sparkles, X, ChevronRight } from "lucide-react";

// Modular Component Imports
import Sidebar from "../components/sidebar";
import Header from "../components/Header";
import WelcomeScreen from "../components/WelcomeScreen";
import ChatStream from "../components/ChatStream";
import PromptInput from "../components/PromptInput";

export default function RtiChat() {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [recentChats, setRecentChats] = useState([]);
  const [messages, setMessages] = useState([]);
  const [caseData, setCaseData] = useState(null);
  const [draft, setDraft] = useState(null);
  const [showCasePanel, setShowCasePanel] = useState(false);

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [generatingDraft, setGeneratingDraft] = useState(false);

  // Mouse coordinate state for the global interactive spotlight glow
  const [mousePos, setMousePos] = useState({ x: 50, y: 30 });
  const containerRef = useRef(null);
  const messagesEndRef = useRef(null);

  const handleMouseMove = (e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setMousePos({ x, y });
  };

  // Load chat history for Sidebar
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

  // Load session messages and case details
  useEffect(() => {
    if (!sessionId) {
      setMessages([]);
      setCaseData(null);
      setDraft(null);
      return;
    }

    async function loadActiveSession() {
      try {
        setLoading(true);
        const [caseRes, msgRes] = await Promise.allSettled([
          rtiService.getCase(sessionId),
          rtiService.getMessages(sessionId),
        ]);

        if (caseRes.status === "fulfilled") {
          setCaseData(caseRes.value.data);
        }

        if (msgRes.status === "fulfilled") {
          const mapped = (msgRes.value.data || []).map((m) => ({
            role: m.role,
            content: m.message || m.content,
          }));
          setMessages(mapped);
        }
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

  // Send Prompt Handler
  const handleSendMessage = async () => {
    if (!input.trim() || sending) return;

    const userText = input.trim();
    setInput("");

    let activeSessionId = sessionId;

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
      if (res.data?.case) {
        setCaseData(res.data.case);
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

  // Generate Draft Action
  const handleGenerateDraft = async () => {
    if (!sessionId) return;
    try {
      setGeneratingDraft(true);
      const res = await rtiService.generateDraft(sessionId);
      setDraft(res.data?.draft);
      setShowCasePanel(true);
    } catch (err) {
      alert(err.message || "Failed to generate RTI draft.");
    } finally {
      setGeneratingDraft(false);
    }
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="relative flex h-screen w-screen bg-[#0e0f12] text-[#e3e3e3] font-sans antialiased overflow-hidden select-none"
    >
      {/* 1. Global Ambient Top Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_#142442_0%,_#0a101d_45%,_#0e0f12_85%)] pointer-events-none z-0" />

      {/* 2. Global Interactive Mouse Spotlight Glow */}
      <div
        className="absolute inset-0 pointer-events-none transition-all duration-300 ease-out z-0"
        style={{
          background: `radial-gradient(750px circle at ${mousePos.x}% ${mousePos.y}%, rgba(29, 78, 216, 0.20), rgba(15, 23, 42, 0.08) 50%, transparent 80%)`,
        }}
      />

      {/* 3. Seamless Glass Sidebar */}
      <Sidebar
        onNewChat={handleNewChat}
        recentChats={recentChats}
        onSelectChat={handleSelectChat}
        onClearHistory={handleClearHistory}
      />

      {/* 4. Main Viewport */}
      <div className="flex-1 flex flex-col h-full min-w-0 relative z-10 bg-transparent overflow-hidden">
        {/* Floating Header */}
        <Header />

        {/* Optional Subheader for Active Case Info / Draft Trigger */}
        {/* {sessionId && caseData && (
          <div className="px-6 py-2 flex items-center justify-between border-b border-[#222630]/30 backdrop-blur-sm z-20">
            <div className="flex items-center gap-2 text-xs text-[#94a3b8]">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="font-medium text-[#cbd5e1] truncate max-w-sm">
                {caseData?.issue || "RTI Case in progress"}
              </span>
            </div>

            <div className="flex items-center gap-2">
              {caseData?.ready_to_draft === 1 && (
                <button
                  onClick={handleGenerateDraft}
                  disabled={generatingDraft}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600/90 hover:bg-emerald-500 text-white text-xs font-medium transition cursor-pointer shadow-lg shadow-emerald-900/30"
                >
                  <Sparkles size={13} />
                  <span>{generatingDraft ? "Drafting..." : "Generate Final Draft"}</span>
                </button>
              )}

              <button
                onClick={() => setShowCasePanel(!showCasePanel)}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#1a1d24] hover:bg-[#232731] text-[#94a3b8] hover:text-[#f1f5f9] text-xs font-medium border border-[#272b35] transition cursor-pointer"
              >
                <FileCheck size={13} />
                <span>{showCasePanel ? "Hide Details" : "View Case Details"}</span>
              </button>
            </div>
          </div>
        )} */}

        {/* Dynamic Center Stage */}
        <main className="flex-1 flex flex-row h-full min-h-0 relative z-10 overflow-hidden bg-transparent">
          <div className="flex-1 flex flex-col h-full min-h-0 overflow-y-auto">
            {!sessionId && messages.length === 0 ? (
              <WelcomeScreen
                input={input}
                setInput={setInput}
                onSubmit={handleSendMessage}
                loading={sending}
              />
            ) : (
              <>
                <ChatStream
                  messages={messages}
                  loading={sending}
                  messagesEndRef={messagesEndRef}
                />

                <PromptInput
                  input={input}
                  setInput={setInput}
                  onSubmit={handleSendMessage}
                  loading={sending}
                />
              </>
            )}
          </div>

          {/* Collapsible Case Info & Draft Side Drawer */}
          {showCasePanel && (
            <div className="w-80 border-l border-[#222630]/60 bg-[#121419]/90 backdrop-blur-xl p-5 flex flex-col h-full overflow-y-auto animate-in slide-in-from-right duration-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-[#f1f5f9]">Case Intelligence</h3>
                <button
                  onClick={() => setShowCasePanel(false)}
                  className="p-1 rounded-md hover:bg-[#1e222b] text-[#64748b] hover:text-white"
                >
                  <X size={15} />
                </button>
              </div>

              <div className="space-y-3 text-xs bg-[#17191e] p-3.5 rounded-xl border border-[#272b35] mb-4">
                <div>
                  <span className="text-[#64748b] block mb-0.5">Issue</span>
                  <span className="text-[#e2e8f0] font-medium">{caseData?.issue || "Pending..."}</span>
                </div>
                <div>
                  <span className="text-[#64748b] block mb-0.5">Target Department</span>
                  <span className="text-[#e2e8f0] font-medium">{caseData?.department || "Pending..."}</span>
                </div>
                <div>
                  <span className="text-[#64748b] block mb-0.5">Location</span>
                  <span className="text-[#e2e8f0]">
                    {[caseData?.village, caseData?.city, caseData?.district, caseData?.state]
                      .filter(Boolean)
                      .join(", ") || "Pending..."}
                  </span>
                </div>
                <div>
                  <span className="text-[#64748b] block mb-0.5">Applicant</span>
                  <span className="text-[#e2e8f0]">{caseData?.applicant_name || "Pending..."}</span>
                </div>
              </div>

              {draft && (
                <div className="flex-1 flex flex-col">
                  <h4 className="text-xs font-semibold text-[#f1f5f9] mb-2">Application Draft</h4>
                  <div className="flex-1 bg-[#17191e] border border-[#3b4252] rounded-xl p-3 overflow-y-auto">
                    <pre className="text-xs text-[#cbd5e1] whitespace-pre-wrap font-sans leading-relaxed">
                      {draft}
                    </pre>
                  </div>
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}