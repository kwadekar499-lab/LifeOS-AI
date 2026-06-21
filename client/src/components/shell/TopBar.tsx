import { memo } from "react";
import { Bell, Menu, Search } from "lucide-react";
import { ShellLogo } from "@/components/shell/ShellLogo";
import { useShellStore } from "@/store/shellStore";

function getModKeyLabel(): string {
  if (typeof navigator === "undefined") return "Ctrl";
  return /Mac|iPhone|iPad/.test(navigator.platform) ? "⌘" : "Ctrl";
}

type TopBarProps = {
  onMenuClick?: () => void;
  showMenuButton?: boolean;
};

export const TopBar = memo(function TopBar({
  onMenuClick,
  showMenuButton = false,
}: TopBarProps) {
  const openCommandPalette = useShellStore((state) => state.openCommandPalette);
  const modKey = getModKeyLabel();

  return (
    <header className="flex h-14 shrink-0 items-center gap-3 border-b border-white/[0.06] bg-[#0A0A0F]/80 px-4 backdrop-blur-md">
      {showMenuButton && (
        <button
          type="button"
          onClick={onMenuClick}
          className="focus-ring rounded-md p-1.5 text-white/50 transition-colors hover:bg-white/[0.06] hover:text-white/80 md:hidden"
          aria-label="Open navigation menu"
        >
          <Menu className="size-5" aria-hidden="true" />
        </button>
      )}

      <div className="hidden md:block">
        <ShellLogo size="sm" />
      </div>

      <div className="ml-auto flex items-center gap-1.5">
        <button
          type="button"
          className="focus-ring hidden items-center gap-2 rounded-lg bg-white/[0.04] px-3 py-1.5 text-sm text-white/40 ring-1 ring-white/[0.06] transition-colors hover:bg-white/[0.06] hover:text-white/60 sm:inline-flex"
          aria-label="Search (coming soon)"
        >
          <Search className="size-3.5" aria-hidden="true" />
          <span>Search</span>
          <kbd className="ml-2 rounded bg-white/[0.06] px-1.5 py-0.5 text-[10px] font-medium text-white/30">
            {modKey}F
          </kbd>
        </button>

        <button
          type="button"
          onClick={openCommandPalette}
          className="focus-ring inline-flex items-center gap-2 rounded-lg bg-white/[0.04] px-2.5 py-1.5 text-sm text-white/40 ring-1 ring-white/[0.06] transition-colors hover:bg-white/[0.06] hover:text-white/60"
          aria-label="Open command palette"
        >
          <Search className="size-3.5 sm:hidden" aria-hidden="true" />
          <span className="hidden sm:inline">Commands</span>
          <kbd className="rounded bg-white/[0.06] px-1.5 py-0.5 text-[10px] font-medium text-white/30">
            {modKey}K
          </kbd>
        </button>

        <button
          type="button"
          className="focus-ring relative rounded-lg p-2 text-white/40 transition-colors hover:bg-white/[0.06] hover:text-white/70"
          aria-label="Notifications (coming soon)"
        >
          <Bell className="size-4" aria-hidden="true" />
          <span className="absolute right-1.5 top-1.5 size-1.5 rounded-full bg-violet-400" />
        </button>

        <button
          type="button"
          className="focus-ring flex size-8 items-center justify-center rounded-full bg-gradient-to-br from-violet-500/30 to-blue-500/30 ring-1 ring-white/10 transition-transform hover:scale-105"
          aria-label="Profile (coming soon)"
        >
          <span className="text-xs font-medium text-white/70" aria-hidden="true">
            L
          </span>
        </button>
      </div>
    </header>
  );
});
