import { memo, useState, useCallback, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Calendar } from "lucide-react";
import { cn } from "@/utils/cn";

type DatePickerProps = {
  value: string;
  onChange: (date: string) => void;
  className?: string;
  id?: string;
  label?: string;
};

const DAYS_OF_WEEK = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"] as const;
const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
] as const;

function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year: number, month: number): number {
  return new Date(year, month, 1).getDay();
}

function formatDate(year: number, month: number, day: number): string {
  return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

function parseDate(dateStr: string): Date | null {
  if (!dateStr) return null;
  const d = new Date(dateStr + "T00:00:00");
  if (isNaN(d.getTime())) return null;
  return d;
}

function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function DatePickerInner({
  value,
  onChange,
  className,
  id,
  label,
}: DatePickerProps) {
  const [open, setOpen] = useState(false);
  const [viewYear, setViewYear] = useState(() => {
    const d = parseDate(value);
    return d ? d.getFullYear() : new Date().getFullYear();
  });
  const [viewMonth, setViewMonth] = useState(() => {
    const d = parseDate(value);
    return d ? d.getMonth() : new Date().getMonth();
  });

  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const calendarRef = useRef<HTMLDivElement>(null);

  const selectedDate = parseDate(value);

  // Close on click outside
  useEffect(() => {
    if (!open) return;
    function handleClickOutside(e: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  // Focus trap inside calendar
  useEffect(() => {
    if (!open || !calendarRef.current) return;
    const focusable = calendarRef.current.querySelectorAll<HTMLElement>(
      'button:not([disabled])',
    );
    if (focusable.length > 0) {
      focusable[0]?.focus();
    }
  }, [open]);

  const handlePrevMonth = useCallback(() => {
    if (viewMonth === 0) {
      setViewYear((y) => y - 1);
      setViewMonth(11);
    } else {
      setViewMonth(viewMonth - 1);
    }
  }, [viewMonth]);

  const handleNextMonth = useCallback(() => {
    if (viewMonth === 11) {
      setViewYear((y) => y + 1);
      setViewMonth(0);
    } else {
      setViewMonth(viewMonth + 1);
    }
  }, [viewMonth]);

  const handleSelectDay = useCallback(
    (day: number) => {
      const formatted = formatDate(viewYear, viewMonth, day);
      onChange(formatted);
      setOpen(false);
    },
    [viewYear, viewMonth, onChange],
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        setOpen(false);
        triggerRef.current?.focus();
      }
    },
    [],
  );

  const today = new Date();
  const daysInMonth = getDaysInMonth(viewYear, viewMonth);
  const firstDay = getFirstDayOfMonth(viewYear, viewMonth);
  const todayDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());

  const displayValue = value
    ? new Date(value + "T00:00:00").toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "";

  return (
    <div ref={containerRef} className={cn("relative", className)}>
      <button
        ref={triggerRef}
        id={id}
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className={cn(
          "focus-ring flex w-full items-center gap-2 rounded-xl bg-white/[0.04] px-4 py-2.5 text-sm text-white ring-1 ring-white/[0.06] transition-colors hover:bg-white/[0.06]",
          !value && "text-white/30",
        )}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-label={label ? `${label}, ${displayValue || "No date selected"}` : undefined}
      >
        <Calendar className="size-4 shrink-0 text-white/40" aria-hidden="true" />
        <span className="flex-1 text-left">
          {displayValue || "Select a date"}
        </span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            ref={calendarRef}
            initial={{ opacity: 0, scale: 0.95, y: -8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -8 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            role="dialog"
            aria-modal="true"
            aria-label="Date picker"
            className={cn(
              "absolute left-0 z-50 mt-2 w-[280px] origin-top-left rounded-2xl border border-white/[0.06] bg-[#0D0D14] p-4 shadow-2xl",
              "sm:left-0 sm:right-auto",
            )}
            onKeyDown={handleKeyDown}
          >
            {/* Month/Year header */}
            <div className="mb-3 flex items-center justify-between">
              <button
                type="button"
                onClick={handlePrevMonth}
                className="focus-ring inline-flex size-8 items-center justify-center rounded-lg text-white/40 transition-colors hover:bg-white/[0.06] hover:text-white/70"
                aria-label="Previous month"
              >
                <ChevronLeft className="size-4" aria-hidden="true" />
              </button>
              <span className="text-sm font-medium text-white/80">
                {MONTH_NAMES[viewMonth]} {viewYear}
              </span>
              <button
                type="button"
                onClick={handleNextMonth}
                className="focus-ring inline-flex size-8 items-center justify-center rounded-lg text-white/40 transition-colors hover:bg-white/[0.06] hover:text-white/70"
                aria-label="Next month"
              >
                <ChevronRight className="size-4" aria-hidden="true" />
              </button>
            </div>

            {/* Day headers */}
            <div className="mb-1 grid grid-cols-7 gap-0.5">
              {DAYS_OF_WEEK.map((day) => (
                <div
                  key={day}
                  className="flex h-8 items-center justify-center text-xs font-medium text-white/30"
                >
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar grid */}
            <div className="grid grid-cols-7 gap-0.5">
              {/* Empty cells for days before the 1st */}
              {Array.from({ length: firstDay }).map((_, i) => (
                <div key={`empty-${i}`} className="h-8 w-full" />
              ))}

              {/* Day cells */}
              {Array.from({ length: daysInMonth }).map((_, i) => {
                const day = i + 1;
                const cellDate = new Date(viewYear, viewMonth, day);
                const isSelected = selectedDate
                  ? isSameDay(selectedDate, cellDate)
                  : false;
                const isToday = isSameDay(todayDate, cellDate);
                const isPast = cellDate < todayDate;

                return (
                  <button
                    key={day}
                    type="button"
                    onClick={() => handleSelectDay(day)}
                    disabled={isPast}
                    className={cn(
                      "focus-ring relative flex h-8 w-full items-center justify-center rounded-lg text-sm transition-colors",
                      isSelected &&
                        "bg-white text-[#0A0A0F] font-medium",
                      !isSelected &&
                        "text-white/60 hover:bg-white/[0.06] hover:text-white/80",
                      isToday && !isSelected && "ring-1 ring-white/20",
                      isPast && "cursor-not-allowed opacity-30",
                    )}
                    aria-label={`${MONTH_NAMES[viewMonth]} ${day}, ${viewYear}`}
                    aria-selected={isSelected}
                    tabIndex={isSelected ? 0 : -1}
                  >
                    {day}
                  </button>
                );
              })}
            </div>

            {/* Clear / Today actions */}
            <div className="mt-3 flex items-center justify-between border-t border-white/[0.06] pt-3">
              {value ? (
                <button
                  type="button"
                  onClick={() => {
                    onChange("");
                    setOpen(false);
                  }}
                  className="focus-ring rounded-lg px-2 py-1 text-xs text-white/40 transition-colors hover:text-white/60"
                >
                  Clear
                </button>
              ) : (
                <div />
              )}
              <button
                type="button"
                onClick={() => {
                  const now = new Date();
                  setViewYear(now.getFullYear());
                  setViewMonth(now.getMonth());
                  const formatted = formatDate(
                    now.getFullYear(),
                    now.getMonth(),
                    now.getDate(),
                  );
                  onChange(formatted);
                  setOpen(false);
                }}
                className="focus-ring rounded-lg px-2 py-1 text-xs text-white/40 transition-colors hover:text-white/60"
              >
                Today
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export const DatePicker = memo(DatePickerInner);