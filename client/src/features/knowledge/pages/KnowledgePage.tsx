import { useState } from "react";
import {
  KnowledgeGrid,
  KnowledgeHeader,
  KnowledgeToolbar,
} from "../components";
import type { KnowledgeViewMode } from "../types";

function KnowledgePage() {
  const [viewMode, setViewMode] = useState<KnowledgeViewMode>("grid");

  return (
    <div className="flex h-full flex-col">
      <div className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6 sm:py-10">
        <div className="flex h-full flex-col gap-8">
          <KnowledgeHeader />
          <KnowledgeToolbar
            viewMode={viewMode}
            onViewModeChange={setViewMode}
          />
          <div className="flex flex-1 flex-col">
            <KnowledgeGrid knowledge={[]} viewMode={viewMode} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default KnowledgePage;
