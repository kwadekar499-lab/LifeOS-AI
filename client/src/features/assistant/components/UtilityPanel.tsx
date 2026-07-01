import { Info, Calendar, Clock, MessageCircle, ShieldCheck } from "lucide-react";
import { useAssistantStore } from "@/stores/assistantStore";
import { useConversations, useConversationMessages } from "../hooks/useAssistantQueries";

export const UtilityPanel = () => {
  const { activeConversationId, isRightPanelOpen } = useAssistantStore();
  const { data: conversations = [] } = useConversations();
  const { data: messages = [] } = useConversationMessages(activeConversationId);

  if (!isRightPanelOpen) return null;

  const activeConversation = conversations.find((c) => c.id === activeConversationId);

  const formatDate = (dateStr?: string | null) => {
    if (!dateStr) return "N/A";
    return new Date(dateStr).toLocaleString(undefined, {
      dateStyle: "medium",
      timeStyle: "short",
    });
  };

  return (
    <div className="flex h-full w-full md:w-80 shrink-0 flex-col border-l border-white/5 bg-[#07070B] text-white">
      {/* Header */}
      <div className="flex h-14 items-center gap-2 border-b border-white/5 bg-[#07070B] px-6 text-sm font-semibold text-white/90">
        <Info className="h-4 w-4 text-indigo-400" />
        <span>Session Information</span>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {activeConversation ? (
          <>
            {/* Title / Summary */}
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-white/30 tracking-wider uppercase">Conversation Title</span>
              <div className="text-sm font-medium text-white/90 whitespace-pre-wrap leading-relaxed">
                {activeConversation.title || "Untitled Conversation"}
              </div>
            </div>

            {/* Metadata metrics list */}
            <div className="space-y-4 pt-2 border-t border-white/[0.03]">
              <div className="flex items-center justify-between text-xs">
                <span className="text-white/40 flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5 text-white/30" />
                  <span>Created</span>
                </span>
                <span className="text-white/80 text-right font-medium">
                  {formatDate(activeConversation.createdAt)}
                </span>
              </div>

              <div className="flex items-center justify-between text-xs">
                <span className="text-white/40 flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5 text-white/30" />
                  <span>Updated</span>
                </span>
                <span className="text-white/80 text-right font-medium">
                  {formatDate(activeConversation.updatedAt)}
                </span>
              </div>

              <div className="flex items-center justify-between text-xs">
                <span className="text-white/40 flex items-center gap-1.5">
                  <MessageCircle className="h-3.5 w-3.5 text-white/30" />
                  <span>Total Messages</span>
                </span>
                <span className="text-white/80 text-right font-mono font-medium">
                  {messages.length}
                </span>
              </div>

              <div className="flex items-center justify-between text-xs">
                <span className="text-white/40 flex items-center gap-1.5">
                  <ShieldCheck className="h-3.5 w-3.5 text-white/30" />
                  <span>Status</span>
                </span>
                <span className="text-xs rounded bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 text-emerald-400 font-semibold uppercase">
                  {activeConversation.isArchived ? "Archived" : "Active"}
                </span>
              </div>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-48 text-center text-xs text-white/30">
            <MessageCircle className="h-8 w-8 text-white/10 mb-2" />
            <span>Select a conversation to view information</span>
          </div>
        )}
      </div>
    </div>
  );
};
export default UtilityPanel;
