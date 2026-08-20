import React, { useRef, useEffect } from 'react';
import { SendHorizontal, Plus, Mic } from 'lucide-react';

export default function PromptInput({ input, setInput, onSubmit, loading }) {
  const textareaRef = useRef(null);

  // Auto-grow textarea height up to 160px
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 160)}px`;
    }
  }, [input]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSubmit();
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-t from-[#131314] via-[#131314]/90 to-transparent pt-8 pb-4 z-10">
      <div className="max-w-3xl mx-auto px-4">
        <div className="flex items-end gap-3 bg-[#1e1f20] border border-[#333537] focus-within:border-[#5e5f62] focus-within:bg-[#282a2c] rounded-3xl px-4 py-3 transition-all shadow-2xl">
          {/* Attach Button */}
          <button
            type="button"
            className="p-1.5 rounded-full hover:bg-[#333537] text-[#c4c7c5] hover:text-white transition-colors mb-0.5"
            title="Add files"
          >
            <Plus size={18} />
          </button>

          {/* Auto-expanding Input Area */}
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            rows={1}
            placeholder="Ask VakilAI anything about legal clauses, RTI, or rights..."
            className="flex-1 bg-transparent text-[14px] text-[#e3e3e3] placeholder-[#8e918f] outline-none resize-none overflow-y-auto leading-relaxed max-h-40 py-0.5"
          />

          {/* Tools & Send Button */}
          <div className="flex items-center gap-1.5 mb-0.5">
            <button
              type="button"
              className="p-1.5 rounded-full hover:bg-[#333537] text-[#c4c7c5] hover:text-white transition-colors"
              title="Voice Input"
            >
              <Mic size={18} />
            </button>

            <button
              onClick={() => onSubmit()}
              disabled={!input.trim() || loading}
              className={`p-2 rounded-full transition-all ${
                input.trim() && !loading
                  ? 'bg-white text-black hover:bg-[#e3e3e3] scale-100'
                  : 'text-[#5e5f62] cursor-not-allowed opacity-50'
              }`}
            >
              <SendHorizontal size={16} />
            </button>
          </div>
        </div>

        <p className="text-[11px] text-center text-[#8e918f] mt-2.5">
          VakilAI provides legal information, not formal counsel. Verify critical clauses with a lawyer.
        </p>
      </div>
    </div>
  );
}