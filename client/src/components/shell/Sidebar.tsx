import { memo } from "react";
import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";
import { PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { ShellLogo } from "@/components/shell/ShellLogo";
import { MAIN_NAV_ITEMS, SETTINGS_NAV_ITEM } from "@/constants/navigation";
import { cn } from "@/utils/cn";
import { useShellStore } from "@/stores/shellStore";
import type { NavItem } from "@/constants/navigation";


type SidebarNavItemProps = {
  item: NavItem;
  collapsed: boolean;
  onNavigate?: () => void;
};

const SidebarNavItem = memo(function SidebarNavItem({
  item,
  collapsed,
  onNavigate,
}: SidebarNavItemProps) {
  const Icon = item.icon;

  return (
    <NavLink
      to={item.path}
      end={item.id === "home"}
      onClick={onNavigate}
      aria-label={collapsed ? item.label : undefined}
      title={collapsed ? item.label : undefined}
      className={({ isActive }) =>
        cn(
          "focus-ring group relative flex items-center gap-3 rounded-lg px-2.5 py-2 text-sm font-medium transition-colors",
          collapsed && "justify-center px-2",
          isActive
            ? "bg-white/[0.08] text-white"
            : "text-white/45 hover:bg-white/[0.04] hover:text-white/80",
        )
      }
    >
      {({ isActive }) => (
        <>
          {isActive && (
            <motion.span
              layoutId="sidebar-active"
              className="absolute inset-0 rounded-lg bg-white/[0.06]"
              transition={{ type: "spring", stiffness: 380, damping: 30 }}
              aria-hidden="true"
            />
          )}
          <Icon
            className={cn(
              "relative z-10 size-[18px] shrink-0 transition-transform group-hover:scale-105",
              isActive ? "text-white" : "text-white/50 group-hover:text-white/70",
            )}
            aria-hidden="true"
          />
          {!collapsed && (
            <span className="relative z-10 truncate">{item.label}</span>
          )}
        </>
      )}
    </NavLink>
  );
});

type SidebarProps = {
  mobile?: boolean;
};

export const Sidebar = memo(function Sidebar({ mobile = false }: SidebarProps) {
  const sidebarCollapsed = useShellStore((state) => state.sidebarCollapsed);
  const toggleSidebar = useShellStore((state) => state.toggleSidebar);
  const closeMobileMenu = useShellStore((state) => state.closeMobileMenu);

  const collapsed = mobile ? false : sidebarCollapsed;
  const handleNavigate = mobile ? closeMobileMenu : undefined;

  return (
    <motion.aside
      initial={false}
      animate={{ width: collapsed ? 68 : 240 }}
      transition={{ type: "spring", stiffness: 400, damping: 35 }}
      className={cn(
        "flex h-full shrink-0 flex-col border-r border-white/[0.06] bg-[#0C0C12]",
        mobile && "w-[240px]",
      )}
      aria-label="Main navigation"
    >
      <div
        className={cn(
          "flex h-14 items-center border-b border-white/[0.06] px-3",
          collapsed ? "justify-center" : "justify-between",
        )}
      >
        {!collapsed && <ShellLogo size="sm" />}
        {!mobile && (
          <button
            type="button"
            onClick={toggleSidebar}
            className="focus-ring rounded-md p-1.5 text-white/40 transition-colors hover:bg-white/[0.06] hover:text-white/70"
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            aria-expanded={!collapsed}
          >
            {collapsed ? (
              <PanelLeftOpen className="size-4" aria-hidden="true" />
            ) : (
              <PanelLeftClose className="size-4" aria-hidden="true" />
            )}
          </button>
        )}
        {mobile && (
          <button
            type="button"
            onClick={closeMobileMenu}
            className="focus-ring ml-auto rounded-md p-1.5 text-white/40 transition-colors hover:bg-white/[0.06] hover:text-white/70"
            aria-label="Close sidebar"
          >
            <PanelLeftClose className="size-4" aria-hidden="true" />
          </button>
        )}
      </div>

      <nav className="flex flex-1 flex-col gap-1 overflow-y-auto p-2">
        {MAIN_NAV_ITEMS.map((item) => (
          <SidebarNavItem
            key={item.id}
            item={item}
            collapsed={collapsed}
            onNavigate={handleNavigate}
          />
        ))}
      </nav>

      <div className="border-t border-white/[0.06] p-2">
        <SidebarNavItem
          item={SETTINGS_NAV_ITEM}
          collapsed={collapsed}
          onNavigate={handleNavigate}
        />
      </div>
    </motion.aside>
  );
});
