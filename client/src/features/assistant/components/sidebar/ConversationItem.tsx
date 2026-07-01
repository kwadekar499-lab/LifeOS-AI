import { useState } from "react";
import type { Conversation } from "../../repositories/conversation.repository";

interface ConversationItemProps {
  conversation: Conversation;
  isActive: boolean;
  onSelect: () => void;
  onDelete: () => void;
  onArchive: () => void;
  onPin: () => void;
}

export function ConversationItem({
  conversation,
  isActive,
  onSelect,
  onDelete,
  onArchive,
  onPin,
}: ConversationItemProps) {
  const [showMenu, setShowMenu] = useState(false);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${Math.floor(diffInHours)}h ago`;
    if (diffInHours < 48) return "Yesterday";
    
    return date.toLocaleDateString("en-US", { 
      month: "short", 
      day: "numeric" 
    });
  };

  return (
    <div
      className={`group relative rounded-lg px-3 py-2 ${
        isActive
          ? "bg-blue-50 dark:bg-blue-900/20"
          : "hover:bg-gray-100 dark:hover:bg-gray-800"
      }`}
    >
      <button
        onClick={onSelect}
        className="flex w-full items-start gap-3 text-left"
        aria-label={`Open conversation: ${conversation.title}`}
      >
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            {conversation.pinned && (
              <svg
                className="h-3 w-3 shrink-0 text-yellow-500"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M10 2a1 1 0 011 1v1.323l3.954 1.582 1.599-.8a1 1 0 01.894 1.79l-1.233.616 1.738 5.42a1 1 0 01-.285 1.05A3.989 3.989 0 0115 15a3.989 3.989 0 01-2.667-1.019 1 1 0 01-.285-1.05l1.715-5.349L10 6.477V16h2a1 1 0 110 2H8a1 1 0 110-2h2V6.477L6.237 7.582l1.715 5.349a1 1 0 01-.285 1.05A3.989 3.989 0 015 15a3.989 3.989 0 01-2.667-1.019 1 1 0 01-.285-1.05l1.738-5.42-1.233-.617a1 1 0 01.894-1.788l1.599.799L9 4.323V3a1 1 0 011-1z" />
              </svg>
            )}
            <p className="truncate text-sm font-medium text-gray-900 dark:text-gray-100">
              {conversation.title}
            </p>
          </div>
          <p className="mt-1 truncate text-xs text-gray-500 dark:text-gray-400">
            {conversation.messages.length > 0 && conversation.messages[conversation.messages.length - 1] != null
              ? conversation.messages[conversation.messages.length - 1]!.content.slice(0, 50) + "..."
              : "No messages yet"}
          </p>
          <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">
            {formatDate(conversation.updatedAt)}
          </p>
        </div>
      </button>

      <div
        className="absolute right-1 top-1/2 -translate-y-1/2"
        onMouseEnter={() => setShowMenu(true)}
        onMouseLeave={() => setShowMenu(false)}
      >
        <button
          onClick={(e) => {
            e.stopPropagation();
            setShowMenu(!showMenu);
          }}
          className="rounded p-1 opacity-0 group-hover:opacity-100 hover:bg-gray-200 dark:hover:bg-gray-700"
          aria-label="Conversation options"
        >
          <svg className="h-4 w-4 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
          </svg>
        </button>

        {showMenu && (
          <div className="absolute right-0 z-10 mt-1 w-48 rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 dark:bg-gray-800">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onPin();
                setShowMenu(false);
              }}
              className="flex w-full items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
            >
              {conversation.pinned ? "Unpin" : "Pin"}
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onArchive();
                setShowMenu(false);
              }}
              className="flex w-full items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
            >
              Archive
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
                setShowMenu(false);
              }}
              className="flex w-full items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-gray-100 dark:text-red-400 dark:hover:bg-gray-700"
            >
              Delete
            </button>
          </div>
        )}
      </div>
    </div>
  );
}