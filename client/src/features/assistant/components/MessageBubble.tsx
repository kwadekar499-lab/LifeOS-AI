import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import { Copy, Check, Sparkles, User } from "lucide-react";
import { cn } from "@/utils/cn";
import type { Message } from "@/types/api";

type MessageBubbleProps = {
  message: Message;
};

export const MessageBubble = React.memo(({ message }: MessageBubbleProps) => {
  const isAssistant = message.role === "assistant";

  return (
    <div
      className={cn(
        "flex w-full gap-3 p-4 md:p-6 transition-colors border-b border-white/[0.02]",
        isAssistant ? "bg-transparent" : "bg-white/[0.01]"
      )}
    >
      <div className="flex max-w-3xl gap-4 mx-auto w-full">
        {/* Avatar */}
        <div
          className={cn(
            "flex h-8 w-8 shrink-0 select-none items-center justify-center rounded-lg border text-sm font-semibold shadow-sm",
            isAssistant
              ? "bg-indigo-500/10 border-indigo-500/20 text-indigo-400"
              : "bg-white/5 border-white/10 text-white"
          )}
        >
          {isAssistant ? <Sparkles className="h-4 w-4" /> : <User className="h-4 w-4" />}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden">
          <div className="text-xs font-semibold text-white/40 mb-1">
            {isAssistant ? "AI Assistant" : "You"}
          </div>

          {isAssistant ? (
            <div className="prose prose-invert max-w-none text-sm leading-relaxed text-white/90">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  code({ className, children, ...props }) {
                    const match = /language-(\w+)/.exec(className || "");
                    const language = (match && match[1]) || "";
                    const codeString = String(children).replace(/\n$/, "");

                    return match ? (
                      <CodeBlock language={language} code={codeString} />
                    ) : (
                      <code
                        className="rounded bg-white/10 px-1.5 py-0.5 text-xs font-mono text-white/90"
                        {...props}
                      >
                        {children}
                      </code>
                    );
                  },
                }}
              >
                {message.content}
              </ReactMarkdown>
            </div>
          ) : (
            <div className="text-sm whitespace-pre-wrap text-white/90">
              {message.content}
            </div>
          )}
        </div>
      </div>
    </div>
  );
});

MessageBubble.displayName = "MessageBubble";

type CodeBlockProps = {
  language: string;
  code: string;
};

const CodeBlock = ({ language, code }: CodeBlockProps) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative my-4 rounded-lg overflow-hidden border border-white/10 bg-[#0E0E15]">
      <div className="flex items-center justify-between px-4 py-2 border-b border-white/5 bg-white/[0.02] text-xs text-white/60">
        <span className="font-mono uppercase">{language || "code"}</span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1 hover:text-white transition-colors"
          type="button"
        >
          {copied ? (
            <>
              <Check className="h-3.5 w-3.5 text-green-500" />
              <span>Copied</span>
            </>
          ) : (
            <>
              <Copy className="h-3.5 w-3.5" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>
      <div className="overflow-x-auto text-sm">
        <SyntaxHighlighter
          language={language || "javascript"}
          style={vscDarkPlus as unknown as Record<string, React.CSSProperties>}
          customStyle={{
            margin: 0,
            background: "transparent",
            padding: "1rem",
          }}
        >
          {code}
        </SyntaxHighlighter>
      </div>
    </div>
  );
};