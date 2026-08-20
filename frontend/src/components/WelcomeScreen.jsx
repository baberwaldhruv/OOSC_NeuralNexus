import React, { useRef, useEffect } from 'react';
import { Plus, ChevronDown, Mic, SendHorizontal } from 'lucide-react';

export default function WelcomeScreen({ input, setInput, onSubmit, loading }) {
  const textareaRef = useRef(null);

  // Auto-resize textarea height smoothly up to 200px as text grows
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
    }
  }, [input]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSubmit();
    }
  };

  return (
    <div className="relative flex-1 h-full w-full flex flex-col items-center justify-center select-none overflow-hidden px-4">
      {/* Background Radial Glow Effect */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[650px] h-[380px] bg-gradient-to-t from-[#15233d]/50 via-[#101b2d]/25 to-transparent blur-[130px] rounded-full" />
      </div>

      {/* Minimal Greeting Header */}
      <div className="relative z-10 text-center mb-8">
        <h1 className="text-3xl md:text-4xl font-normal text-[#e3e3e3] tracking-normal font-sans">
          Ready when you are
        </h1>
      </div>

      {/* Centered Pill Prompt Bar with Auto-Expand */}
      <div className="relative z-10 w-full max-w-2xl">
        <div className="flex items-end gap-3 bg-[#1e1f20] border border-[#2d2e30] hover:border-[#383a3d] focus-within:border-[#444746] rounded-3xl px-4 py-3 transition-all shadow-2xl">
          {/* Plus Add Context */}
          <button
            type="button"
            className="p-1.5 rounded-full hover:bg-[#282a2c] text-[#8e918f] hover:text-[#e3e3e3] transition-colors mb-0.5"
            title="Add context or files"
          >
            <Plus size={18} />
          </button>

          {/* Auto-expanding Textarea */}
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            rows={1}
            placeholder="Ask VakilAI"
            className="flex-1 bg-transparent text-[15px] text-[#e3e3e3] placeholder-[#8e918f] outline-none resize-none overflow-y-auto leading-relaxed max-h-48 py-1"
            autoFocus
          />

          {/* Action Tools & Send */}
          <div className="flex items-center gap-2 mb-0.5 text-[#8e918f]">
            <button
              type="button"
              className="flex items-center gap-1 text-xs text-[#c4c7c5] hover:text-white px-2 py-1 rounded-lg hover:bg-[#282a2c] transition-colors"
            >
              <span>Flash</span>
              <ChevronDown size={14} />
            </button>

            <button
              type="button"
              className="p-1.5 rounded-full hover:bg-[#282a2c] hover:text-[#e3e3e3] transition-colors"
              title="Voice Input"
            >
              <Mic size={17} />
            </button>

            {input.trim().length > 0 && (
              <button
                onClick={() => onSubmit()}
                disabled={loading}
                className="p-1.5 rounded-full bg-white text-black hover:bg-[#e3e3e3] transition-all transform scale-100 animate-in fade-in"
                title="Send"
              >
                <SendHorizontal size={15} />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}