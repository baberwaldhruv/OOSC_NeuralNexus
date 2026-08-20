import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { rtiService } from "../services/apiServices";

export default function RtiChat() {
  const { sessionId } = useParams();
  const navigate = useNavigate();

  const [caseData, setCaseData] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [generatingDraft, setGeneratingDraft] = useState(false);
  const [draft, setDraft] = useState(null);
  const [error, setError] = useState("");

  const chatBottomRef = useRef(null);

  useEffect(() => {
    fetchSessionDetails();
  }, [sessionId]);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, sending]);

  const fetchSessionDetails = async () => {
    try {
      setLoading(true);
      const [caseRes, msgRes] = await Promise.all([
        rtiService.getCase(sessionId),
        rtiService.getMessages(sessionId),
      ]);
      setCaseData(caseRes.data);
      setMessages(msgRes.data || []);
    } catch (err) {
      setError(err.message || "Failed to load case session.");
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim() || sending) return;

    const userMessage = input.trim();
    setInput("");
    setError("");

    // Optimistic UI update
    setMessages((prev) => [
      ...prev,
      { role: "user", message: userMessage, created_at: new Date().toISOString() },
    ]);
    setSending(true);

    try {
      const res = await rtiService.sendMessage(sessionId, userMessage);
      const assistantReply = res.data?.response;
      const updatedCase = res.data?.case;

      if (assistantReply) {
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            message: assistantReply,
            created_at: new Date().toISOString(),
          },
        ]);
      }

      if (updatedCase) {
        setCaseData(updatedCase);
      }
    } catch (err) {
      setError(err.message || "Failed to send message.");
    } finally {
      setSending(false);
    }
  };

  const handleGenerateDraft = async () => {
    try {
      setGeneratingDraft(true);
      setError("");
      const res = await rtiService.generateDraft(sessionId);
      setDraft(res.data?.draft);
    } catch (err) {
      setError(err.message || "Failed to generate RTI draft.");
    } finally {
      setGeneratingDraft(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen text-gray-500 font-medium">
        Loading case session...
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col h-full bg-white">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-white">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/cases")}
              className="text-sm font-medium text-gray-500 hover:text-gray-800"
            >
              ← Back to Cases
            </button>
            <h2 className="text-lg font-bold text-gray-800">
              {caseData?.issue || "RTI Case Assistant"}
            </h2>
          </div>

          {caseData?.ready_to_draft === 1 && (
            <button
              onClick={handleGenerateDraft}
              disabled={generatingDraft}
              className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 disabled:opacity-50"
            >
              {generatingDraft ? "Generating Draft..." : "Generate Final Draft"}
            </button>
          )}
        </div>

        {error && (
          <div className="mx-6 mt-4 p-3 bg-red-100 text-red-700 text-sm rounded-lg">
            {error}
          </div>
        )}

        {/* Message Log */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.length === 0 ? (
            <div className="text-center text-gray-400 mt-12">
              Start by describing your RTI issue (e.g., "Road construction delay in my locality").
            </div>
          ) : (
            messages.map((msg, index) => (
              <div
                key={index}
                className={`flex ${
                  msg.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[75%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                    msg.role === "user"
                      ? "bg-blue-600 text-white rounded-br-none"
                      : "bg-gray-100 text-gray-800 rounded-bl-none"
                  }`}
                >
                  <p className="whitespace-pre-wrap">{msg.message}</p>
                </div>
              </div>
            ))
          )}

          {sending && (
            <div className="flex justify-start">
              <div className="bg-gray-100 text-gray-400 text-sm px-4 py-2 rounded-2xl rounded-bl-none animate-pulse">
                Analyzing details...
              </div>
            </div>
          )}

          <div ref={chatBottomRef} />
        </div>

        {/* Message Input Form */}
        <form
          onSubmit={handleSendMessage}
          className="p-4 bg-white border-t border-gray-200 flex gap-2"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your response here..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm"
          />
          <button
            type="submit"
            disabled={sending || !input.trim()}
            className="px-6 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            Send
          </button>
        </form>
      </div>

      {/* Case Details / Draft Sidebar */}
      <div className="w-96 border-l border-gray-200 bg-gray-50 flex flex-col h-full overflow-y-auto p-5">
        <h3 className="text-base font-bold text-gray-800 mb-4">Extracted Case Info</h3>

        <div className="space-y-3 text-xs bg-white p-4 rounded-lg border border-gray-200 mb-4">
          <div>
            <span className="font-semibold text-gray-600 block">Issue:</span>
            <span className="text-gray-800">{caseData?.issue || "Pending..."}</span>
          </div>
          <div>
            <span className="font-semibold text-gray-600 block">Department:</span>
            <span className="text-gray-800">{caseData?.department || "Pending..."}</span>
          </div>
          <div>
            <span className="font-semibold text-gray-600 block">Location:</span>
            <span className="text-gray-800">
              {[caseData?.village, caseData?.city, caseData?.district, caseData?.state]
                .filter(Boolean)
                .join(", ") || "Pending..."}
            </span>
          </div>
          <div>
            <span className="font-semibold text-gray-600 block">Applicant:</span>
            <span className="text-gray-800">
              {caseData?.applicant_name || "Pending..."}
            </span>
          </div>
        </div>

        {draft && (
          <div className="flex-1 flex flex-col">
            <h4 className="text-sm font-bold text-gray-800 mb-2">Application Draft</h4>
            <div className="flex-1 bg-yellow-50 border border-yellow-300 rounded-lg p-3 overflow-y-auto">
              <pre className="text-xs text-gray-800 whitespace-pre-wrap font-sans">
                {draft}
              </pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}