import React, { useState } from 'react';
import { ChevronDown, Check, User, LogOut } from 'lucide-react';
import { useAuth } from '../Context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Header() {
  const [model, setModel] = useState('VakilAI 2.5 Flash');
  const [modelDropdownOpen, setModelDropdownOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const models = [
    { name: 'VakilAI 2.5 Flash', desc: 'Fast, everyday legal queries & drafts' },
    { name: 'VakilAI 2.5 Pro', desc: 'Deep contract reasoning & case law analysis' },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <header className="flex justify-between items-center px-5 py-3 bg-[#131314] z-20 select-none border-b border-[#1f1f21]">
      {/* Model Selector Dropdown */}
      <div className="relative">
        <button
          onClick={() => setModelDropdownOpen(!modelDropdownOpen)}
          className="flex items-center gap-2 px-3 py-1.5 rounded-xl hover:bg-[#1e1f20] transition-colors group"
        >
          <span className="text-lg font-medium text-[#c4c7c5] group-hover:text-white transition-colors">
            {model}
          </span>
          <ChevronDown size={16} className="text-[#8e918f] group-hover:text-[#c4c7c5]" />
        </button>

        {modelDropdownOpen && (
          <>
            <div className="fixed inset-0 z-20" onClick={() => setModelDropdownOpen(false)} />
            <div className="absolute top-12 left-0 w-72 bg-[#1e1f20] border border-[#333537] rounded-2xl p-1.5 shadow-2xl z-30 flex flex-col gap-1">
              {models.map((m) => (
                <button
                  key={m.name}
                  onClick={() => {
                    setModel(m.name);
                    setModelDropdownOpen(false);
                  }}
                  className="flex items-start justify-between p-3 rounded-xl hover:bg-[#282a2c] text-left transition-colors"
                >
                  <div>
                    <div className="text-sm font-medium text-[#e3e3e3]">{m.name}</div>
                    <div className="text-xs text-[#8e918f] mt-0.5">{m.desc}</div>
                  </div>
                  {model === m.name && <Check size={16} className="text-[#a8c7fa] mt-0.5" />}
                </button>
              ))}
            </div>
          </>
        )}
      </div>

      {/* User Avatar & Profile Dropdown */}
      <div className="relative">
        <button
          onClick={() => setUserDropdownOpen(!userDropdownOpen)}
          className="h-9 w-9 flex items-center justify-center rounded-full bg-[#282a2c] hover:bg-[#333537] text-[#a8c7fa] border border-[#3c4043] transition-all font-semibold text-xs"
        >
          {user?.name ? user.name[0].toUpperCase() : <User size={18} />}
        </button>

        {userDropdownOpen && (
          <>
            <div className="fixed inset-0 z-20" onClick={() => setUserDropdownOpen(false)} />
            <div className="absolute top-12 right-0 w-56 bg-[#1e1f20] border border-[#333537] rounded-2xl p-2 shadow-2xl z-30 flex flex-col gap-1">
              <div className="px-3 py-2 border-b border-[#2d2e30]">
                <div className="text-xs font-semibold text-white truncate">{user?.name || "User"}</div>
                <div className="text-[11px] text-[#8e918f] truncate">{user?.email || "user@example.com"}</div>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2.5 px-3 py-2 text-xs text-red-400 hover:bg-red-950/30 rounded-xl transition text-left mt-1"
              >
                <LogOut size={14} />
                <span>Sign out</span>
              </button>
            </div>
          </>
        )}
      </div>
    </header>
  );
}