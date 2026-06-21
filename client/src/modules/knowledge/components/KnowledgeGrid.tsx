import { memo } from "react";
import { KnowledgeCard } from "./KnowledgeCard";
import { KnowledgeEmptyState } from "./KnowledgeEmptyState";
import type { KnowledgeSummary, KnowledgeViewMode } from "../types";
import { cn } from "@/utils/cn";
import type { WithClassName } from "@/types";

type KnowledgeGridProps = WithClassName & {
  knowledge: KnowledgeSummary[];
  viewMode?: KnowledgeViewMode;
  onKnowledgeSelect?: (id: string) => void;
  onCreateKnowledge?: () => void;
};

export const KnowledgeGrid = memo(function KnowledgeGrid({
  knowledge,
  viewMode = "grid",
  onKnowledgeSelect,
  onCreateKnowledge,
  className,
}: KnowledgeGridProps) {
  if (knowledge.length === 0) {
    return (
      <KnowledgeEmptyState
        className={className}
        onAction={onCreateKnowledge}
      />
    );
  }

  const isList = viewMode === "list";

  return (
    <div
      className={cn(
        isList
          ? "flex flex-col gap-2"
          : "grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
        className,
      )}
      role="list"
      aria-label="Knowledge items"
    >
      {knowledge.map((item) => (
        <div key={item.id} role="listitem">
          <KnowledgeCard
            knowledge={item}
            viewMode={viewMode}
            onSelect={onKnowledgeSelect}
          />
        </div>
      ))}
    </div>
  );
});
