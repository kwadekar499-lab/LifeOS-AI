import { memo, type KeyboardEvent } from "react";
import { GitBranch } from "lucide-react";
import { KNOWLEDGE_COPY } from "../constants/copy";
import type { KnowledgeSummary } from "../types";
import {
  formatCategoryLabel,
  formatKnowledgeStatus,
  formatRelationshipCount,
  formatRelativeDate,
} from "../utils/format";
import { cn } from "@/utils/cn";
import type { WithClassName } from "@/types";

type KnowledgeCardProps = WithClassName & {
  knowledge: KnowledgeSummary;
  viewMode?: "grid" | "list";
  onSelect?: (id: string) => void;
};

export const KnowledgeCard = memo(function KnowledgeCard({
  knowledge,
  viewMode = "grid",
  onSelect,
  className,
}: KnowledgeCardProps) {
  const handleClick = (): void => {
    onSelect?.(knowledge.id);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLElement>): void => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onSelect?.(knowledge.id);
    }
  };

  const isList = viewMode === "list";

  return (
    <article
      role="button"
      tabIndex={0}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      aria-label={`Knowledge: ${knowledge.title}`}
      className={cn(
        "group cursor-pointer rounded-xl bg-white/[0.03] ring-1 ring-white/[0.06] transition-all hover:bg-white/[0.05] hover:ring-white/[0.1]",
        isList
          ? "flex items-center gap-4 p-4"
          : "flex flex-col p-4",
        className,
      )}
    >
      <div
        className={cn(
          "flex min-w-0 flex-1 flex-col",
          isList && "flex-row items-center gap-4",
        )}
      >
        <div
          className={cn(
            "flex items-start justify-between gap-3",
            isList ? "shrink-0 flex-col items-start" : "mb-3 w-full",
          )}
        >
          <span className="rounded-md bg-white/[0.06] px-2 py-0.5 text-[11px] font-medium uppercase tracking-wider text-white/45">
            {formatCategoryLabel(knowledge.category.label)}
          </span>
          {!isList && (
            <span className="text-[11px] text-white/25">
              {formatRelativeDate(knowledge.updatedAt)}
            </span>
          )}
        </div>

        <h3
          className={cn(
            "min-w-0 font-medium leading-snug text-white/90 transition-colors group-hover:text-white",
            isList
              ? "flex-1 truncate text-sm"
              : "line-clamp-2 text-sm",
          )}
        >
          {knowledge.title}
        </h3>

        {isList && (
          <span className="hidden shrink-0 text-[11px] text-white/25 sm:inline">
            {formatRelativeDate(knowledge.updatedAt)}
          </span>
        )}
      </div>

      <div
        className={cn(
          "flex items-center gap-3",
          isList ? "shrink-0" : "mt-auto justify-between pt-4",
        )}
      >
        <div className="flex flex-wrap gap-1.5">
          {knowledge.tags.length > 0 ? (
            knowledge.tags.slice(0, isList ? 2 : 3).map((tag) => (
              <span
                key={tag.id}
                className="rounded-full bg-white/[0.04] px-2 py-0.5 text-[11px] text-white/40 ring-1 ring-white/[0.06]"
              >
                {tag.label}
              </span>
            ))
          ) : (
            <span className="text-[11px] text-white/20">
              {KNOWLEDGE_COPY.card.noTags}
            </span>
          )}
        </div>

        <div className="flex items-center gap-3">
          <span
            className="inline-flex items-center gap-1 text-[11px] text-white/30"
            aria-label={formatRelationshipCount(knowledge.relationshipCount)}
          >
            <GitBranch className="size-3" aria-hidden="true" />
            {knowledge.relationshipCount}
          </span>
          {!isList && (
            <span className="text-[11px] text-white/30">
              {formatKnowledgeStatus(knowledge.status)}
            </span>
          )}
        </div>
      </div>
    </article>
  );
});
