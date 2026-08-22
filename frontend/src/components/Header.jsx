import React, { useState } from 'react';
import { User, LogOut } from 'lucide-react';
import { useAuth } from '../Context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Header() {
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <header className="w-full flex justify-between items-center px-6 py-4 bg-transparent z-30 select-none pointer-events-auto">
      {/* Brand Title */}
      <div className="flex items-center gap-2">
        <span className="text-xl font-normal tracking-tight text-[#e3e3e3] opacity-90 hover:opacity-100 transition-opacity">
          VakilAI
        </span>
      </div>

      {/* User Avatar & Profile Dropdown */}
      <div className="relative">
        <button
          onClick={() => setUserDropdownOpen(!userDropdownOpen)}
          className="h-8 w-8 flex items-center justify-center rounded-full bg-[#1e2025]/80 hover:bg-[#282b33] text-[#c4c7c5] hover:text-white border border-[#2d3139]/80 backdrop-blur-md transition-all font-medium text-xs cursor-pointer shadow-sm"
          title="Account"
        >
          {user?.name ? user.name[0].toUpperCase() : <User size={15} />}
        </button>

        {userDropdownOpen && (
          <>
            <div className="fixed inset-0 z-20" onClick={() => setUserDropdownOpen(false)} />
            <div className="absolute top-11 right-0 w-56 bg-[#17191e]/95 backdrop-blur-xl border border-[#272b35] rounded-2xl p-2 shadow-2xl z-30 flex flex-col gap-1 animate-in fade-in zoom-in-95 duration-150">
              <div className="px-3 py-2 border-b border-[#272b35]/60">
                <div className="text-xs font-semibold text-[#f1f5f9] truncate">{user?.name || "User"}</div>
                <div className="text-[11px] text-[#94a3b8] truncate">{user?.email || "user@example.com"}</div>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2.5 px-3 py-2 text-xs text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-xl transition text-left mt-1 cursor-pointer"
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