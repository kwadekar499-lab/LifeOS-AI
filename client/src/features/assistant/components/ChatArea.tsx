import { useEffect, useRef } from "react";
import { SidebarOpen, SidebarClose, Sparkles, ArrowLeft } from "lucide-react";
import { MessageBubble } from "./MessageBubble";
import { MessageComposer } from "./MessageComposer";
import { useConversationMessages, useSendMessage, useConversations } from "../hooks/useAssistantQueries";
import { useAssistantStore } from "@/stores/assistantStore";
import { MOBILE_QUERY, useMediaQuery } from "@/hooks/useMediaQuery";

export const ChatArea = () => {
  const { activeConversationId, isRightPanelOpen, toggleRightPanel, setActiveConversationId } = useAssistantStore();
  const { data: conversations = [] } = useConversations();
  const { data: messages = [], isLoading } = useConversationMessages(activeConversationId);
  const sendMessage = useSendMessage();

  const isMobile = useMediaQuery(MOBILE_QUERY);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const activeConversation = conversations.find((c) => c.id === activeConversationId);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, sendMessage.isPending]);

  const handleSend = (text: string) => {
    sendMessage.mutate({
      conversationId: activeConversationId || undefined,
      message: text,
    });
  };

  const handleQuickPrompt = (promptText: string) => {
    handleSend(promptText);
  };

  return (
    <div className="flex h-full flex-1 flex-col bg-[#0A0A0F] text-white overflow-hidden">
      {/* Top Toolbar */}
      <div className="flex h-14 items-center justify-between border-b border-white/5 bg-[#07070B] px-6">
        <div className="flex items-center gap-3 min-w-0">
          {isMobile && activeConversationId && (
            <button
              onClick={() => setActiveConversationId(null)}
              className="rounded-lg p-1.5 hover:bg-white/5 hover:text-white text-white/60 transition-colors"
              title="Go back to conversation list"
              type="button"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>
          )}
          <span className="truncate text-sm font-semibold text-white/90">
            {activeConversation ? (activeConversation.title || "Conversation Details") : "AI Assistant Workspace"}
          </span>
        </div>

        {!isMobile && (
          <button
            onClick={toggleRightPanel}
            className="rounded-xl border border-white/10 bg-white/[0.02] p-2 hover:bg-white/5 hover:text-white text-white/60 transition-all cursor-pointer"
            title={isRightPanelOpen ? "Close info panel" : "Open info panel"}
            type="button"
          >
            {isRightPanelOpen ? <SidebarClose className="h-4 w-4" /> : <SidebarOpen className="h-4 w-4" />}
          </button>
        )}
      </div>

      {/* Message History list */}
      <div className="flex-1 overflow-y-auto">
        {isLoading ? (
          <div className="space-y-6 py-6 max-w-3xl mx-auto px-4">
            {[1, 2].map((n) => (
              <div key={n} className="flex gap-4 animate-pulse">
                <div className="h-8 w-8 rounded-lg bg-white/5" />
                <div className="flex-1 space-y-2 py-1">
                  <div className="h-3 w-20 rounded bg-white/10" />
                  <div className="h-3.5 w-full rounded bg-white/5" />
                  <div className="h-3.5 w-4/5 rounded bg-white/5" />
                </div>
              </div>
            ))}
          </div>
        ) : !activeConversationId || messages.length === 0 ? (
          /* Empty Chat / Welcome State */
          <div className="flex h-full flex-col items-center justify-center text-center p-6 max-w-lg mx-auto">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#6366F1]/10 border border-[#6366F1]/20 text-[#6366F1] mb-4 animate-pulse">
              <Sparkles className="h-6 w-6" />
            </div>
            <h2 className="text-lg font-bold text-white/90 mb-1">Welcome to LifeOS Assistant</h2>
            <p className="text-xs text-white/40 leading-relaxed mb-6">
              Ask questions, structure tasks, search through your uploaded knowledge files, or write details into your memory. Select a conversation or start typing below to begin.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 w-full max-w-md">
              <button
                onClick={() => handleQuickPrompt("What tasks do I have scheduled for today?")}
                className="rounded-xl border border-white/5 bg-white/[0.01] p-3 text-left text-xs hover:bg-white/[0.04] transition-all text-white/60 hover:text-white"
                type="button"
              >
                <strong>📋 Schedule tasks</strong>
                <p className="text-[10px] text-white/30 mt-0.5">Query today's schedule and checklists.</p>
              </button>

              <button
                onClick={() => handleQuickPrompt("Search my uploaded documents for important memory context.")}
                className="rounded-xl border border-white/5 bg-white/[0.01] p-3 text-left text-xs hover:bg-white/[0.04] transition-all text-white/60 hover:text-white"
                type="button"
              >
                <strong>🔍 Document search</strong>
                <p className="text-[10px] text-white/30 mt-0.5">Semantic search inside parsed file uploads.</p>
              </button>
            </div>
          </div>
        ) : (
          /* Historical Messages rendering */
          <div className="flex flex-col">
            {messages.map((msg) => (
              <MessageBubble key={msg.id} message={msg} />
            ))}

            {/* Sending / Typing Indicator */}
            {sendMessage.isPending && (
              <div className="flex w-full gap-3 p-4 md:p-6 transition-colors bg-transparent border-b border-white/[0.02]">
                <div className="flex max-w-3xl gap-4 mx-auto w-full">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-indigo-500/20 bg-indigo-500/10 text-indigo-400">
                    <Sparkles className="h-4 w-4 animate-spin" />
                  </div>
                  <div className="flex-1 space-y-1.5 pt-1">
                    <div className="text-xs font-semibold text-white/40 mb-1">AI Assistant</div>
                    <div className="flex gap-1.5 items-center py-2">
                      <div className="h-1.5 w-1.5 animate-bounce rounded-full bg-white/40 [animation-delay:-0.3s]" />
                      <div className="h-1.5 w-1.5 animate-bounce rounded-full bg-white/40 [animation-delay:-0.15s]" />
                      <div className="h-1.5 w-1.5 animate-bounce rounded-full bg-white/40" />
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Composer (Prompt Input area) */}
      <div className="border-t border-white/[0.02] bg-[#07070B]/50 pt-4">
        <MessageComposer
          onSend={handleSend}
          disabled={sendMessage.isPending}
        />
      </div>
    </div>
  );
};
