import { useState } from "react";
import {
  AssistantHeader,
  AssistantToolbar,
  ConversationView,
  PromptInput,
} from "../components";
import { ASSISTANT_COPY } from "../constants/copy";

function AssistantPage() {
  const [memoryEnabled, setMemoryEnabled] = useState(true);
  const [knowledgeEnabled, setKnowledgeEnabled] = useState(true);

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="mx-auto flex h-full w-full max-w-4xl min-h-0 flex-col px-4 py-6 sm:px-6 sm:py-8">
        <div className="flex shrink-0 flex-col gap-6">
          <AssistantHeader />
          <AssistantToolbar
            memoryEnabled={memoryEnabled}
            knowledgeEnabled={knowledgeEnabled}
            onMemoryToggle={() => setMemoryEnabled((prev) => !prev)}
            onKnowledgeToggle={() => setKnowledgeEnabled((prev) => !prev)}
          />
        </div>

        <ConversationView
          messages={[]}
          suggestions={[...ASSISTANT_COPY.suggestions]}
        />

        <PromptInput />
      </div>
    </div>
  );
}

export default AssistantPage;
