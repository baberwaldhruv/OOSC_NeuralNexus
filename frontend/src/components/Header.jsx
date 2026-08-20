import React, { useState } from 'react';
import { Sparkles, ChevronDown, Check, User } from 'lucide-react';

export default function Header() {
  const [model, setModel] = useState('VakilAI 2.5 Flash');
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const models = [
    { name: 'VakilAI 2.5 Flash', desc: 'Fast, everyday legal queries & drafts' },
    { name: 'VakilAI 2.5 Pro', desc: 'Deep contract reasoning & case law analysis' },
  ];

  return (
    <header className="flex justify-between items-center px-5 py-3 bg-[#131314] z-10 select-none">
      {/* Model Selector Dropdown */}
      <div className="relative">
        <button
          onClick={() => setDropdownOpen(!dropdownOpen)}
          className="flex items-center gap-2 px-3 py-1.5 rounded-xl hover:bg-[#1e1f20] transition-colors group"
        >
          <span className="text-lg font-medium text-[#c4c7c5] group-hover:text-white transition-colors">
            {model}
          </span>
          <ChevronDown size={16} className="text-[#8e918f] group-hover:text-[#c4c7c5]" />
        </button>

        {dropdownOpen && (
          <>
            <div className="fixed inset-0 z-20" onClick={() => setDropdownOpen(false)} />
            <div className="absolute top-12 left-0 w-72 bg-[#1e1f20] border border-[#333537] rounded-2xl p-1.5 shadow-2xl z-30 flex flex-col gap-1">
              {models.map((m) => (
                <button
                  key={m.name}
                  onClick={() => {
                    setModel(m.name);
                    setDropdownOpen(false);
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

      {/* User Avatar */}
      <div className="flex items-center gap-3">
        <button className="h-9 w-9 flex items-center justify-center rounded-full bg-[#282a2c] hover:bg-[#333537] text-[#a8c7fa] border border-[#3c4043] transition-all">
          <User size={18} />
        </button>
      </div>
    </header>
  );
}