import React, { useState } from 'react';
import { 
  Sparkles, 
  PenSquare, 
  Search, 
  LayoutGrid, 
  PanelLeftClose, 
  PanelLeftOpen, 
  Trash2, 
  MessageSquare,
  LogOut
} from 'lucide-react';
import { useAuth } from '../Context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Sidebar({ onNewChat, recentChats = [], onSelectChat, onClearHistory }) {
  const [isOpen, setIsOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchInput, setShowSearchInput] = useState(false);

  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  const filteredChats = recentChats.filter((chat) =>
    (chat.title || chat).toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <aside
      className={`${
        isOpen 
          ? 'w-64 bg-[#131418]/85 backdrop-blur-xl border-r border-[#222630]/50' 
          : 'w-[64px] bg-transparent border-r border-transparent'
      } flex flex-col justify-between h-screen transition-all duration-300 ease-in-out select-none z-30 shrink-0 overflow-hidden`}
    >
      <div className="flex flex-col p-3">
        {/* Header */}
        <div className={`flex items-center mb-5 ${isOpen ? 'justify-between px-1' : 'justify-center'}`}>
          {isOpen && (
            <div className="flex items-center gap-2.5 min-w-0">
              <Sparkles className="w-4.5 h-4.5 text-[#93c5fd] fill-[#93c5fd]/20 shrink-0" />
              <span className="text-[16px] font-medium tracking-tight text-[#f1f5f9] truncate">
                VakilAI
              </span>
            </div>
          )}

          <button
            onClick={() => {
              setIsOpen(!isOpen);
              if (isOpen) setShowSearchInput(false);
            }}
            className="p-2 rounded-xl hover:bg-[#1f232d]/60 text-[#94a3b8] hover:text-[#f1f5f9] transition-colors shrink-0 cursor-pointer"
            title={isOpen ? 'Collapse sidebar' : 'Expand sidebar'}
          >
            {isOpen ? <PanelLeftClose size={18} /> : <PanelLeftOpen size={18} />}
          </button>
        </div>

        {/* Core Actions */}
        <div className="flex flex-col gap-1">
          <button
            onClick={onNewChat}
            className={`flex items-center gap-3 rounded-xl hover:bg-[#1f232d]/60 text-[#cbd5e1] hover:text-white transition-all group cursor-pointer ${
              isOpen ? 'px-3 py-2 text-left' : 'justify-center p-2.5'
            }`}
            title="New chat"
          >
            <PenSquare size={17} className="shrink-0 text-[#94a3b8] group-hover:text-white" />
            {isOpen && <span className="text-[13.5px] font-normal truncate">New chat</span>}
          </button>

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
              className={`flex items-center gap-3 rounded-xl hover:bg-[#1f232d]/60 transition-all group cursor-pointer ${
                isOpen ? 'px-3 py-2 text-left' : 'justify-center p-2.5'
              } ${showSearchInput && isOpen ? 'bg-[#1f232d]/80 text-white' : 'text-[#cbd5e1] hover:text-white'}`}
              title="Search chats"
            >
              <Search size={17} className="shrink-0 text-[#94a3b8] group-hover:text-white" />
              {isOpen && <span className="text-[13.5px] font-normal truncate">Search chats</span>}
            </button>

            {isOpen && showSearchInput && (
              <div className="px-1 pt-1.5 pb-2">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Filter chats..."
                  className="w-full bg-[#17191e]/90 border border-[#272b35] rounded-lg px-3 py-1.5 text-xs text-[#f1f5f9] placeholder-[#64748b] outline-none focus:border-[#475569]"
                  autoFocus
                />
              </div>
            )}
          </div>

          <button
            className={`flex items-center gap-3 rounded-xl hover:bg-[#1f232d]/60 text-[#cbd5e1] hover:text-white transition-all group cursor-pointer ${
              isOpen ? 'px-3 py-2 text-left' : 'justify-center p-2.5'
            }`}
            title="Services"
          >
            <LayoutGrid size={17} className="shrink-0 text-[#94a3b8] group-hover:text-white" />
            {isOpen && <span className="text-[13.5px] font-normal truncate">Services</span>}
          </button>
        </div>

        {/* Dynamic Chat History */}
        {isOpen && (
          <div className="flex flex-col mt-5 border-t border-[#222630]/40 pt-3 overflow-hidden flex-1 animate-in fade-in duration-200">
            <div className="flex items-center justify-between px-2 mb-2">
              <span className="text-[11px] font-medium text-[#64748b] uppercase tracking-wider">
                Recent
              </span>
              {recentChats.length > 0 && (
                <button
                  onClick={onClearHistory}
                  className="text-[#64748b] hover:text-red-400 p-1 rounded-md transition-colors cursor-pointer"
                  title="Clear history"
                >
                  <Trash2 size={12} />
                </button>
              )}
            </div>

            <div className="overflow-y-auto max-h-[52vh] flex flex-col gap-0.5 pr-1 custom-scrollbar">
              {filteredChats.length === 0 ? (
                <div className="text-xs text-[#64748b] px-2 py-4 text-center">
                  {recentChats.length === 0 ? 'No conversations yet' : 'No matching chats found'}
                </div>
              ) : (
                filteredChats.map((chat, idx) => (
                  <button
                    key={idx}
                    onClick={() => onSelectChat && onSelectChat(chat)}
                    className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg hover:bg-[#1f232d]/60 text-[13px] text-[#cbd5e1] hover:text-white text-left truncate transition-colors group cursor-pointer"
                  >
                    <MessageSquare size={13.5} className="shrink-0 text-[#64748b] group-hover:text-[#93c5fd]" />
                    <span className="truncate">{chat.title || chat}</span>
                  </button>
                ))
              )}
            </div>
          </div>
        )}
      </div>

      {/* User Profile Footer with Sign Out */}
      <div className={`p-3 ${isOpen ? 'border-t border-[#222630]/40 px-3' : 'border-t-0 justify-center'} flex items-center justify-between`}>
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-rose-500 flex items-center justify-center text-xs font-semibold text-white shrink-0 shadow-sm">
            {user?.name ? user.name[0].toUpperCase() : 'U'}
          </div>
          {isOpen && (
            <div className="flex flex-col min-w-0">
              <span className="text-xs font-medium text-[#f1f5f9] truncate">{user?.name || 'User'}</span>
              <span className="text-[10px] text-[#64748b] truncate">{user?.email || 'Free Plan'}</span>
            </div>
          )}
        </div>

        {isOpen && (
          <button
            onClick={handleLogout}
            className="p-1.5 rounded-lg hover:bg-[#1f232d]/60 text-[#64748b] hover:text-red-400 transition-colors cursor-pointer"
            title="Sign out"
          >
            <LogOut size={15} />
          </button>
        )}
      </div>
    </aside>
  );
}