import { ConversationPanel } from "./ConversationPanel";
import { ChatArea } from "./ChatArea";
import { UtilityPanel } from "./UtilityPanel";
import { MOBILE_QUERY, useMediaQuery } from "@/hooks/useMediaQuery";
import { useAssistantStore } from "@/stores/assistantStore";

export const AssistantLayout = () => {
  const isMobile = useMediaQuery(MOBILE_QUERY);
  const { activeConversationId } = useAssistantStore();

  return (
    <div className="flex h-[calc(100vh-56px)] w-full overflow-hidden bg-[#0A0A0F]">
      {isMobile ? (
        activeConversationId ? (
          <div className="flex h-full w-full flex-col">
            <ChatArea />
          </div>
        ) : (
          <ConversationPanel />
        )
      ) : (
        <>
          <ConversationPanel />
          <ChatArea />
          <UtilityPanel />
        </>
      )}
    </div>
  );
};
export default AssistantLayout;
