import React, { useState, useRef, useEffect } from 'react';
import Sidebar from './components/sidebar';
import WelcomeScreen from './components/WelcomeScreen';
import ChatStream from './components/ChatStream';
import PromptInput from './components/PromptInput';
import { PenSquare } from 'lucide-react';
import { sendMessageToAI } from './services/api';

export default function App() {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([]);
  
  // Real chat history loaded from local storage
  const [chatHistory, setChatHistory] = useState(() => {
    const saved = localStorage.getItem('vakilai_chats');
    return saved ? JSON.parse(saved) : [];
  });

  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  useEffect(() => {
    localStorage.setItem('vakilai_chats', JSON.stringify(chatHistory));
  }, [chatHistory]);

  const handleSend = async (textToSend) => {
    const query = textToSend || input;
    if (!query.trim() || loading) return;

    const userMessage = { role: 'user', content: query };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput('');
    setLoading(true);

    // Add first query to recent chats list if this is a fresh conversation
    if (messages.length === 0) {
      setChatHistory((prev) => [query.slice(0, 32), ...prev]);
    }

    try {
      const data = await sendMessageToAI(query, updatedMessages);
      const aiReply = data.data?.response || data.response || 'No response content received.';
      setMessages((prev) => [...prev, { role: 'assistant', content: aiReply }]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: 'Unable to connect to backend service. Please check your connection.',
          isError: true,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleNewChat = () => {
    setMessages([]);
    setInput('');
  };

  const handleClearHistory = () => {
    setChatHistory([]);
    localStorage.removeItem('vakilai_chats');
  };

  return (
    <div className="flex h-screen w-screen bg-[#0e0e10] text-[#e3e3e3] overflow-hidden font-sans">
      <Sidebar
        onNewChat={handleNewChat}
        recentChats={chatHistory}
        onClearHistory={handleClearHistory}
      />

      <main className="flex-1 flex flex-col justify-between relative overflow-hidden bg-[#0e0e10]">
        <div className="absolute top-4 right-6 z-20">
          <button
            onClick={handleNewChat}
            className="p-2 rounded-full hover:bg-[#1e1f20] text-[#8e918f] hover:text-[#e3e3e3] transition-colors"
            title="New Chat"
          >
            <PenSquare size={18} />
          </button>
        </div>

        {messages.length === 0 ? (
          <WelcomeScreen
            input={input}
            setInput={setInput}
            onSubmit={handleSend}
            loading={loading}
          />
        ) : (
          <div className="flex-1 flex flex-col justify-between overflow-hidden">
            <div className="flex-1 overflow-y-auto px-4 md:px-0">
              <ChatStream
                messages={messages}
                loading={loading}
                messagesEndRef={messagesEndRef}
              />
            </div>

            <PromptInput
              input={input}
              setInput={setInput}
              onSubmit={handleSend}
              loading={loading}
            />
          </div>
        )}
      </main>
    </div>
  );
}