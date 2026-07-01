import React, { useState, useMemo } from "react";
import { MessageSquare, Pin, PinOff, Trash2, Edit2, Search, Plus } from "lucide-react";
import { useConversations, useCreateConversation, useDeleteConversation, useRenameConversation, useTogglePinConversation } from "../hooks/useAssistantQueries";
import { useAssistantStore } from "@/stores/assistantStore";
import { cn } from "@/utils/cn";
import type { Conversation } from "@/types/api";

export const ConversationPanel = () => {
  const { data: conversations = [], isLoading } = useConversations();
  const createConversation = useCreateConversation();
  const deleteConversation = useDeleteConversation();
  const renameConversation = useRenameConversation();
  const togglePin = useTogglePinConversation();

  const { activeConversationId, setActiveConversationId } = useAssistantStore();
  const [search, setSearch] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");

  const handleCreate = () => {
    createConversation.mutate({ title: "New Conversation" });
  };

  const handleStartRename = (e: React.MouseEvent, conversation: Conversation) => {
    e.stopPropagation();
    setEditingId(conversation.id);
    setEditTitle(conversation.title || "Untitled Conversation");
  };

  const handleSaveRename = async (id: string) => {
    if (editTitle.trim()) {
      await renameConversation.mutateAsync({ id, title: editTitle.trim() });
    }
    setEditingId(null);
  };

  const handleCancelRename = () => {
    setEditingId(null);
  };

  const handleTogglePin = (e: React.MouseEvent, conversation: Conversation) => {
    e.stopPropagation();
    togglePin.mutate({ id: conversation.id, isPinned: conversation.isPinned });
  };

  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (confirm("Are you sure you want to delete this conversation?")) {
      deleteConversation.mutate(id);
    }
  };

  const filteredConversations = useMemo(() => {
    return conversations.filter((c) =>
      (c.title || "Untitled Conversation")
        .toLowerCase()
        .includes(search.toLowerCase())
    );
  }, [conversations, search]);

  const { pinned, unpinned } = useMemo(() => {
    const pinned: Conversation[] = [];
    const unpinned: Conversation[] = [];
    filteredConversations.forEach((c) => {
      if (c.isPinned) {
        pinned.push(c);
      } else {
        unpinned.push(c);
      }
    });

    // Sort by lastMessageAt or createdAt descending
    const sortByDate = (a: Conversation, b: Conversation) => {
      const dateA = new Date(a.lastMessageAt || a.createdAt).getTime();
      const dateB = new Date(b.lastMessageAt || b.createdAt).getTime();
      return dateB - dateA;
    };

    return {
      pinned: pinned.sort(sortByDate),
      unpinned: unpinned.sort(sortByDate),
    };
  }, [filteredConversations]);

  return (
    <div className="flex h-full w-full md:w-80 shrink-0 flex-col border-r border-white/5 bg-[#07070B] text-white">
      {/* Header Panel */}
      <div className="p-4 border-b border-white/5 flex flex-col gap-3">
        <button
          onClick={handleCreate}
          disabled={createConversation.isPending}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-black hover:bg-white/90 disabled:opacity-50 transition-all cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          <span>New Chat</span>
        </button>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-white/40" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search conversations..."
            className="w-full rounded-xl border border-white/10 bg-white/[0.02] py-2 pl-9 pr-4 text-xs text-white placeholder-white/40 focus:border-indigo-500/50 focus:outline-none transition-colors"
          />
        </div>
      </div>

      {/* Conversations Scrollable List */}
      <div className="flex-1 overflow-y-auto p-2 space-y-4">
        {isLoading ? (
          <div className="space-y-2 p-2">
            {[1, 2, 3].map((n) => (
              <div key={n} className="h-12 rounded-xl bg-white/[0.02] animate-pulse" />
            ))}
          </div>
        ) : (
          <>
            {/* Pinned List */}
            {pinned.length > 0 && (
              <div>
                <div className="px-3 mb-1 text-[10px] font-bold text-white/30 tracking-wider uppercase flex items-center gap-1">
                  <Pin className="h-3 w-3" />
                  <span>Pinned</span>
                </div>
                <div className="space-y-0.5">
                  {pinned.map((c) => (
                    <ConversationItem
                      key={c.id}
                      conversation={c}
                      active={activeConversationId === c.id}
                      editing={editingId === c.id}
                      editTitle={editTitle}
                      setEditTitle={setEditTitle}
                      onSelect={() => setActiveConversationId(c.id)}
                      onSaveRename={() => handleSaveRename(c.id)}
                      onCancelRename={handleCancelRename}
                      onStartRename={(e) => handleStartRename(e, c)}
                      onTogglePin={(e) => handleTogglePin(e, c)}
                      onDelete={(e) => handleDelete(e, c.id)}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Recent List */}
            <div>
              {pinned.length > 0 && unpinned.length > 0 && (
                <div className="px-3 mb-1 mt-4 text-[10px] font-bold text-white/30 tracking-wider uppercase">
                  <span>Recent Chats</span>
                </div>
              )}
              {unpinned.length > 0 ? (
                <div className="space-y-0.5">
                  {unpinned.map((c) => (
                    <ConversationItem
                      key={c.id}
                      conversation={c}
                      active={activeConversationId === c.id}
                      editing={editingId === c.id}
                      editTitle={editTitle}
                      setEditTitle={setEditTitle}
                      onSelect={() => setActiveConversationId(c.id)}
                      onSaveRename={() => handleSaveRename(c.id)}
                      onCancelRename={handleCancelRename}
                      onStartRename={(e) => handleStartRename(e, c)}
                      onTogglePin={(e) => handleTogglePin(e, c)}
                      onDelete={(e) => handleDelete(e, c.id)}
                    />
                  ))}
                </div>
              ) : (
                pinned.length === 0 && (
                  <div className="p-4 text-center text-xs text-white/30">
                    No conversations found
                  </div>
                )
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

type ConversationItemProps = {
  conversation: Conversation;
  active: boolean;
  editing: boolean;
  editTitle: string;
  setEditTitle: (val: string) => void;
  onSelect: () => void;
  onSaveRename: () => void;
  onCancelRename: () => void;
  onStartRename: (e: React.MouseEvent) => void;
  onTogglePin: (e: React.MouseEvent) => void;
  onDelete: (e: React.MouseEvent) => void;
};

const ConversationItem = ({
  conversation,
  active,
  editing,
  editTitle,
  setEditTitle,
  onSelect,
  onSaveRename,
  onCancelRename,
  onStartRename,
  onTogglePin,
  onDelete,
}: ConversationItemProps) => {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      onSaveRename();
    } else if (e.key === "Escape") {
      onCancelRename();
    }
  };

  return (
    <div
      onClick={editing ? undefined : onSelect}
      className={cn(
        "group relative flex items-center justify-between rounded-xl p-3 text-sm cursor-pointer select-none transition-all",
        active
          ? "bg-white/10 text-white font-medium shadow-sm border border-white/5"
          : "text-white/60 hover:bg-white/[0.03] hover:text-white"
      )}
    >
      <div className="flex min-w-0 flex-1 items-center gap-2.5">
        <MessageSquare className={cn("h-4 w-4 shrink-0", active ? "text-white" : "text-white/40")} />
        
        {editing ? (
          <input
            type="text"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            onBlur={onSaveRename}
            onKeyDown={handleKeyDown}
            autoFocus
            className="flex-1 bg-white/5 border border-indigo-500/50 rounded px-1.5 py-0.5 text-xs text-white focus:outline-none"
            onClick={(e) => e.stopPropagation()}
          />
        ) : (
          <span className="truncate text-xs">
            {conversation.title || "Untitled Conversation"}
          </span>
        )}
      </div>

      {/* Action Controls */}
      {!editing && (
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity bg-transparent ml-2 shrink-0">
          <button
            onClick={onTogglePin}
            className="rounded p-1 text-white/40 hover:bg-white/5 hover:text-white transition-colors"
            title={conversation.isPinned ? "Unpin" : "Pin"}
            type="button"
          >
            {conversation.isPinned ? <PinOff className="h-3 w-3" /> : <Pin className="h-3 w-3" />}
          </button>
          
          <button
            onClick={onStartRename}
            className="rounded p-1 text-white/40 hover:bg-white/5 hover:text-white transition-colors"
            title="Rename"
            type="button"
          >
            <Edit2 className="h-3 w-3" />
          </button>
          
          <button
            onClick={onDelete}
            className="rounded p-1 text-white/40 hover:bg-white/5 hover:text-red-400 transition-colors"
            title="Delete"
            type="button"
          >
            <Trash2 className="h-3 w-3" />
          </button>
        </div>
      )}

      {/* Small Pin indicator if not hovered and pinned */}
      {conversation.isPinned && !editing && (
        <div className="group-hover:hidden shrink-0 ml-1">
          <Pin className="h-3.5 w-3.5 text-indigo-400 fill-indigo-400/20" />
        </div>
      )}
    </div>
  );
};
