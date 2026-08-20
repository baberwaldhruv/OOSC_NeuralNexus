import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import { Sparkles, Copy, Check, ThumbsUp, ThumbsDown } from 'lucide-react';

export default function ChatStream({ messages, loading, messagesEndRef }) {
  const [copiedIndex, setCopiedIndex] = useState(null);

  const handleCopy = (text, idx) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto flex flex-col gap-6 pt-6 pb-44 px-4">
      {messages.map((msg, idx) => (
        <div
          key={idx}
          className={`flex w-full ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
        >
          {msg.role === 'user' ? (
            /* User Message Bubble - Right Aligned */
            <div className="max-w-[80%] md:max-w-[70%] bg-[#282a2c] text-[#f0f4f9] px-5 py-3.5 rounded-3xl rounded-tr-md text-[15px] leading-relaxed shadow-md break-words whitespace-pre-wrap">
              {msg.content}
            </div>
          ) : (
            /* AI Response - Left Aligned with Avatar */
            <div className="flex gap-4 items-start max-w-[90%] md:max-w-[85%] group">
              {/* VakilAI Gradient Avatar */}
              <div className="h-8 w-8 rounded-full flex items-center justify-center bg-gradient-to-tr from-[#4285f4] via-[#9b72cb] to-[#d96570] text-white p-1.5 shrink-0 shadow-md mt-0.5">
                <Sparkles size={16} />
              </div>

              {/* AI Markdown Content */}
              <div className="flex-1 min-w-0">
                <div
                  className={`text-[15px] leading-relaxed text-[#e3e3e3] ${
                    msg.isError ? 'text-red-400 bg-red-950/30 p-3 rounded-2xl border border-red-900/50' : ''
                  }`}
                >
                  <div className="markdown-content">
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm]}
                      rehypePlugins={[rehypeHighlight]}
                      components={{
                        code({ node, inline, className, children, ...props }) {
                          const match = /language-(\w+)/.exec(className || '');
                          const codeText = String(children).replace(/\n$/, '');

                          return !inline && match ? (
                            <div className="relative my-3 rounded-xl overflow-hidden border border-[#333537] bg-[#1a1a1c]">
                              <div className="flex justify-between items-center px-4 py-1.5 bg-[#282a2c] text-xs text-[#8e918f]">
                                <span className="font-mono">{match[1]}</span>
                                <button
                                  onClick={() => handleCopy(codeText, idx)}
                                  className="flex items-center gap-1 hover:text-[#e3e3e3] transition-colors"
                                >
                                  {copiedIndex === idx ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
                                  <span>{copiedIndex === idx ? 'Copied' : 'Copy'}</span>
                                </button>
                              </div>
                              <pre className="p-4 text-xs font-mono overflow-x-auto">
                                <code className={className} {...props}>
                                  {children}
                                </code>
                              </pre>
                            </div>
                          ) : (
                            <code className="bg-[#282a2c] text-[#a8c7fa] px-1.5 py-0.5 rounded text-xs font-mono" {...props}>
                              {children}
                            </code>
                          );
                        },
                      }}
                    >
                      {msg.content}
                    </ReactMarkdown>
                  </div>
                </div>

                {/* Response Feedback & Copy Actions */}
                {!msg.isError && (
                  <div className="flex items-center gap-1.5 mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => handleCopy(msg.content, idx)}
                      className="p-1.5 rounded-full hover:bg-[#1e1f20] text-[#8e918f] hover:text-[#e3e3e3] transition-colors"
                      title="Copy response"
                    >
                      {copiedIndex === idx ? <Check size={15} className="text-green-400" /> : <Copy size={15} />}
                    </button>
                    <button
                      className="p-1.5 rounded-full hover:bg-[#1e1f20] text-[#8e918f] hover:text-[#e3e3e3] transition-colors"
                      title="Good response"
                    >
                      <ThumbsUp size={15} />
                    </button>
                    <button
                      className="p-1.5 rounded-full hover:bg-[#1e1f20] text-[#8e918f] hover:text-[#e3e3e3] transition-colors"
                      title="Bad response"
                    >
                      <ThumbsDown size={15} />
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      ))}

      {/* Generating Skeleton on the Left */}
      {loading && (
        <div className="flex gap-4 items-start max-w-[85%]">
          <div className="h-8 w-8 rounded-full flex items-center justify-center bg-gradient-to-tr from-[#4285f4] via-[#9b72cb] to-[#d96570] text-white p-1.5 shrink-0 animate-spin">
            <Sparkles size={16} />
          </div>
          <div className="flex flex-col gap-2.5 flex-1 mt-1">
            <div className="h-3 w-44 bg-[#1e1f20] rounded-full animate-pulse-subtle" />
            <div className="h-3 w-72 bg-[#1e1f20] rounded-full animate-pulse-subtle" />
          </div>
        </div>
      )}
      <div ref={messagesEndRef} />
    </div>
  );
}