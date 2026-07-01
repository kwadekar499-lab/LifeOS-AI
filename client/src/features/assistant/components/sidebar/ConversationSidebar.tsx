import { useState, useMemo } from "react";
import { useAssistantStore } from "../../store/conversation-store";
import type { Conversation } from "../../repositories/conversation.repository";
import { ConversationItem } from "./ConversationItem";
import { ConversationSearch } from "./ConversationSearch";
import { NewChatButton } from "./NewChatButton";
export function ConversationSidebar() {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const conversations = useAssistantStore((state) => state.conversations) as Conversation[];
  const currentConversation = useAssistantStore((state) => state.currentConversation) as Conversation | null;
  const searchQuery = useAssistantStore((state) => state.searchQuery);
  const setSearchQuery = useAssistantStore((state) => state.setSearchQuery);
  const selectConversation = useAssistantStore((state) => state.selectConversation);
  const createConversation = useAssistantStore((state) => state.createConversation);
  const deleteConversation = useAssistantStore((state) => state.deleteConversation);
  const archiveConversation = useAssistantStore((state) => state.archiveConversation);
  const pinConversation = useAssistantStore((state) => state.pinConversation);
  const isSidebarOpen = useAssistantStore((state) => state.isSidebarOpen);

  const filteredConversations = useMemo(() => {
    if (!searchQuery.trim()) return conversations;
    
    const query = searchQuery.toLowerCase();
    return conversations.filter((conv: Conversation) => {
      const matchesTitle = conv.title.toLowerCase().includes(query);
      const matchesContent = conv.messages.some(
        (msg) => msg.content.toLowerCase().includes(query)
      );
      return matchesTitle || matchesContent;
    });
  }, [conversations, searchQuery]);

  const pinnedConversations = useMemo(
    () => filteredConversations.filter((c: Conversation) => c.pinned),
    [filteredConversations]
  );

  const regularConversations = useMemo(
    () => filteredConversations.filter((c: Conversation) => !c.pinned),
    [filteredConversations]
  );

  const handleNewChat = async () => {
    await createConversation();
    setIsMobileOpen(false);
  };

  const handleSelectConversation = async (id: string) => {
    await selectConversation(id);
    setIsMobileOpen(false);
  };

  const handleDelete = async (id: string) => {
    await deleteConversation(id);
  };

  const handleArchive = async (id: string) => {
    await archiveConversation(id);
  };

  const handlePin = async (id: string) => {
    await pinConversation(id);
  };

  const sidebarContent = (
    <div className="flex h-full flex-col">
      <div className="flex shrink-0 items-center justify-between p-4">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          Conversations
        </h2>
        <button
          onClick={() => setIsMobileOpen(false)}
          className="lg:hidden rounded-lg p-2 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
          aria-label="Close sidebar"
        >
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div className="shrink-0 px-4 pb-3">
        <NewChatButton onClick={handleNewChat} />
      </div>

      <div className="shrink-0 px-4 pb-3">
        <ConversationSearch
          value={searchQuery}
          onChange={setSearchQuery}
        />
      </div>

      <div className="flex-1 overflow-y-auto px-2">
        {pinnedConversations.length > 0 && (
          <div className="mb-4">
            <h3 className="mb-2 px-2 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
              Pinned
            </h3>
            <div className="space-y-1">
        {pinnedConversations.map((conversation: Conversation) => (
                <ConversationItem
                  key={conversation.id}
                  conversation={conversation}
                  isActive={currentConversation?.id === conversation.id}
                  onSelect={() => handleSelectConversation(conversation.id)}
                  onDelete={() => handleDelete(conversation.id)}
                  onArchive={() => handleArchive(conversation.id)}
                  onPin={() => handlePin(conversation.id)}
                />
              ))}
            </div>
          </div>
        )}

        {regularConversations.length > 0 && (
          <div>
            {pinnedConversations.length > 0 && (
              <h3 className="mb-2 px-2 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                Recent
              </h3>
            )}
            <div className="space-y-1">
            {regularConversations.map((conversation: Conversation) => (
                <ConversationItem
                  key={conversation.id}
                  conversation={conversation}
                  isActive={currentConversation?.id === conversation.id}
                  onSelect={() => handleSelectConversation(conversation.id)}
                  onDelete={() => handleDelete(conversation.id)}
                  onArchive={() => handleArchive(conversation.id)}
                  onPin={() => handlePin(conversation.id)}
                />
              ))}
            </div>
          </div>
        )}

        {filteredConversations.length === 0 && (
          <div className="px-4 py-8 text-center text-sm text-gray-500 dark:text-gray-400">
            {searchQuery ? "No conversations found" : "No conversations yet"}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className={`hidden lg:flex lg:w-80 lg:flex-col lg:border-r lg:border-gray-200 lg:bg-gray-50 dark:lg:border-gray-700 dark:lg:bg-gray-900 ${
          isSidebarOpen ? "lg:flex" : "lg:hidden"
        }`}
        aria-label="Conversation sidebar"
      >
        {sidebarContent}
      </aside>

      {/* Mobile Drawer */}
      {isMobileOpen && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/50 lg:hidden"
            onClick={() => setIsMobileOpen(false)}
          />
          <aside
            className="fixed inset-y-0 left-0 z-50 w-80 transform bg-white shadow-xl transition-transform dark:bg-gray-900 lg:hidden"
            aria-label="Mobile conversation sidebar"
          >
            {sidebarContent}
          </aside>
        </>
      )}
    </>
  );
}
