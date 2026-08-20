import React, { useState } from 'react';
import { 
  Sparkles, 
  PenSquare, 
  Search, 
  LayoutGrid, 
  PanelLeftClose, 
  PanelLeftOpen, 
  Trash2, 
  MessageSquare 
} from 'lucide-react';

export default function Sidebar({ onNewChat, recentChats = [], onSelectChat, onClearHistory }) {
  const [isOpen, setIsOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchInput, setShowSearchInput] = useState(false);

  const filteredChats = recentChats.filter((chat) =>
    (chat.title || chat).toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <aside
      className={`${
        isOpen ? 'w-64' : 'w-[68px]'
      } flex flex-col justify-between bg-[#131314] border-r border-[#1f1f21] h-screen transition-[width] duration-300 ease-in-out select-none z-30 shrink-0 overflow-hidden`}
    >
      <div className="flex flex-col p-3">
        {/* Header: Centered toggle when collapsed, Full bar when expanded */}
        <div className={`flex items-center mb-5 ${isOpen ? 'justify-between px-1' : 'justify-center'}`}>
          {isOpen && (
            <div className="flex items-center gap-2.5 min-w-0">
              <Sparkles className="w-5 h-5 text-[#a8c7fa] fill-[#a8c7fa]/20 shrink-0" />
              <span className="text-[17px] font-medium tracking-tight text-[#e3e3e3] truncate">
                VakilAI
              </span>
            </div>
          )}

          <button
            onClick={() => {
              setIsOpen(!isOpen);
              if (isOpen) setShowSearchInput(false);
            }}
            className="p-2 rounded-lg hover:bg-[#282a2c] text-[#8e918f] hover:text-[#e3e3e3] transition-colors shrink-0"
            title={isOpen ? 'Collapse sidebar' : 'Expand sidebar'}
          >
            {isOpen ? <PanelLeftClose size={18} /> : <PanelLeftOpen size={18} />}
          </button>
        </div>

        {/* Core Actions */}
        <div className="flex flex-col gap-1.5">
          {/* 1. New Chat */}
          <button
            onClick={onNewChat}
            className={`flex items-center gap-3.5 rounded-xl hover:bg-[#1e1f20] text-[#c4c7c5] hover:text-white transition-colors group ${
              isOpen ? 'px-3 py-2.5 text-left' : 'justify-center p-2.5'
            }`}
            title="New chat"
          >
            <PenSquare size={18} className="shrink-0 text-[#c4c7c5] group-hover:text-white" />
            {isOpen && <span className="text-[14px] font-normal truncate">New chat</span>}
          </button>

          {/* 2. Search Chats */}
          <div className="flex flex-col">
            <button
              onClick={() => {
                if (!isOpen) {
                  setIsOpen(true);
                  setShowSearchInput(true);
                } else {
                  setShowSearchInput(!showSearchInput);
                }
              }}
              className={`flex items-center gap-3.5 rounded-xl hover:bg-[#1e1f20] transition-colors group ${
                isOpen ? 'px-3 py-2.5 text-left' : 'justify-center p-2.5'
              } ${showSearchInput && isOpen ? 'bg-[#1e1f20] text-white' : 'text-[#c4c7c5] hover:text-white'}`}
              title="Search chats"
            >
              <Search size={18} className="shrink-0 text-[#c4c7c5] group-hover:text-white" />
              {isOpen && <span className="text-[14px] font-normal truncate">Search chats</span>}
            </button>

            {isOpen && showSearchInput && (
              <div className="px-1 pt-1.5 pb-2">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Filter chats..."
                  className="w-full bg-[#1e1f20] border border-[#333537] rounded-lg px-3 py-1.5 text-xs text-[#e3e3e3] placeholder-[#8e918f] outline-none focus:border-[#5e5f62]"
                  autoFocus
                />
              </div>
            )}
          </div>

          {/* 3. Services */}
          <button
            className={`flex items-center gap-3.5 rounded-xl hover:bg-[#1e1f20] text-[#c4c7c5] hover:text-white transition-colors group ${
              isOpen ? 'px-3 py-2.5 text-left' : 'justify-center p-2.5'
            }`}
            title="Services"
          >
            <LayoutGrid size={18} className="shrink-0 text-[#c4c7c5] group-hover:text-white" />
            {isOpen && <span className="text-[14px] font-normal truncate">Services</span>}
          </button>
        </div>

        {/* Dynamic Chat History (Expanded Only) */}
        {isOpen && (
          <div className="flex flex-col mt-5 border-t border-[#1f1f21] pt-3 overflow-hidden flex-1">
            <div className="flex items-center justify-between px-2 mb-2">
              <span className="text-[11px] font-semibold text-[#8e918f] uppercase tracking-wider">
                Recent
              </span>
              {recentChats.length > 0 && (
                <button
                  onClick={onClearHistory}
                  className="text-[#8e918f] hover:text-red-400 p-1 rounded transition-colors"
                  title="Clear history"
                >
                  <Trash2 size={13} />
                </button>
              )}
            </div>

            <div className="overflow-y-auto max-h-[52vh] flex flex-col gap-0.5 pr-1">
              {filteredChats.length === 0 ? (
                <div className="text-xs text-[#5e6063] px-2 py-4 text-center">
                  {recentChats.length === 0 ? 'No conversations yet' : 'No matching chats found'}
                </div>
              ) : (
                filteredChats.map((chat, idx) => (
                  <button
                    key={idx}
                    onClick={() => onSelectChat && onSelectChat(chat)}
                    className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg hover:bg-[#1e1f20] text-[13px] text-[#c4c7c5] hover:text-white text-left truncate transition-colors group"
                  >
                    <MessageSquare size={14} className="shrink-0 text-[#8e918f] group-hover:text-[#a8c7fa]" />
                    <span className="truncate">{chat.title || chat}</span>
                  </button>
                ))
              )}
            </div>
          </div>
        )}
      </div>

      {/* User Profile Footer */}
      <div className={`p-3 border-t border-[#1f1f21] flex items-center ${isOpen ? 'gap-3' : 'justify-center'}`}>
        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#9b72cb] to-[#d96570] flex items-center justify-center text-xs font-semibold text-white shrink-0">
          D
        </div>
        {isOpen && (
          <div className="flex flex-col min-w-0">
            <span className="text-xs font-medium text-[#e3e3e3] truncate">Dhruv Baberwal</span>
            <span className="text-[10px] text-[#8e918f] truncate">Free Plan</span>
          </div>
        )}
      </div>
    </aside>
  );
}