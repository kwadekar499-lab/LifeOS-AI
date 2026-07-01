import { memo, useState, useCallback, useRef, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, AlertTriangle } from "lucide-react";
import type { Task, TaskPriority, TaskStatus } from "../types";
import { TASK_PRIORITIES, TASK_STATUSES } from "../types";
import { TASKS_COPY } from "../constants/copy";
import { useRecentTitles } from "../hooks/useRecentTitles";
import { cn } from "@/utils/cn";
import type { WithClassName } from "@/types";
import { DatePicker } from "./DatePicker";

type NewTaskDialogProps = WithClassName & {
  open: boolean;
  onClose: () => void;
  onSubmit: (task: Omit<Task, "id" | "createdAt" | "updatedAt">) => void;
  /** Array of existing task titles for duplicate detection */
  existingTitles?: string[];
  onTitleCreated?: (title: string) => void;
};

type FormErrors = {
  title?: string;
};

const INPUT_CLASSES =
  "focus-ring w-full rounded-xl bg-white/[0.04] px-4 py-2.5 text-sm text-white placeholder:text-white/30 ring-1 ring-white/[0.06] transition-colors hover:bg-white/[0.06] focus:bg-white/[0.06] focus:outline-none";

const LABEL_CLASSES = "block text-sm font-medium text-white/60";

const LABEL_COLORS = [
  "#F59E0B",
  "#3B82F6",
  "#10B981",
  "#EF4444",
  "#8B5CF6",
  "#EC4899",
  "#14B8A6",
  "#F97316",
];

function getLabelColor(index: number): string {
  return LABEL_COLORS[index % LABEL_COLORS.length] ?? "#F59E0B";
}

function NewTaskDialogInner({
  open,
  onClose,
  onSubmit,
  existingTitles = [],
  onTitleCreated,
  className,
}: NewTaskDialogProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<TaskPriority>("medium");
  const [status, setStatus] = useState<TaskStatus>("todo");
  const [project, setProject] = useState("");
  const [labels, setLabels] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [errors, setErrors] = useState<FormErrors>({});
  const [showDuplicateWarning, setShowDuplicateWarning] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const { history, addTitle } = useRecentTitles();
  const titleRef = useRef<HTMLInputElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const cancelRef = useRef<HTMLButtonElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);
  const isInitialFocus = useRef(true);

  // Prevent body scroll while dialog is open
  useEffect(() => {
    if (open) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [open]);

  // Focus trap and auto-focus on title when opened
  useEffect(() => {
    if (open) {
      isInitialFocus.current = true;
      const timer = setTimeout(() => {
        titleRef.current?.focus();
        setTimeout(() => {
          isInitialFocus.current = false;
        }, 0);
      }, 50);

      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape") {
          onClose();
          return;
        }

        if (e.key === "Tab" && dialogRef.current) {
          const focusable = dialogRef.current.querySelectorAll<HTMLElement>(
            'button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
          );
          if (focusable.length === 0) return;

          const first = focusable[0];
          const last = focusable[focusable.length - 1];

          if (!first || !last) return;

          if (e.shiftKey && document.activeElement === first) {
            e.preventDefault();
            last.focus();
          } else if (!e.shiftKey && document.activeElement === last) {
            e.preventDefault();
            first.focus();
          }
        }
      };

      document.addEventListener("keydown", handleKeyDown);
      return () => {
        clearTimeout(timer);
        document.removeEventListener("keydown", handleKeyDown);
      };
    }
  }, [open, onClose]);

  const detectDuplicate = useCallback(
    (value: string): boolean => {
      const trimmed = value.trim().toLowerCase();
      if (!trimmed) return false;
      return existingTitles.some(
        (t) => t.trim().toLowerCase() === trimmed,
      );
    },
    [existingTitles],
  );

  const validate = useCallback((): FormErrors => {
    const newErrors: FormErrors = {};
    if (!title.trim()) {
      newErrors.title = TASKS_COPY.dialog.validation.titleRequired;
    }
    return newErrors;
  }, [title]);

  const submitTask = useCallback(() => {
    const trimmedTitle = title.trim();
    const labelList = labels
      .split(",")
      .map((l) => l.trim())
      .filter(Boolean)
      .map((name, index) => ({
        id: `label-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        name,
        color: getLabelColor(index),
      }));

    onSubmit({
      title: trimmedTitle,
      description: description.trim() || undefined,
      priority,
      status,
      dueDate: dueDate || undefined,
      labels: labelList,
      project: project.trim()
        ? { id: `project-${Date.now()}`, name: project.trim() }
        : undefined,
    });

    if (trimmedTitle) {
      addTitle(trimmedTitle);
      onTitleCreated?.(trimmedTitle);
    }

    // Reset form
    setTitle("");
    setDescription("");
    setPriority("medium");
    setStatus("todo");
    setProject("");
    setLabels("");
    setDueDate("");
    setErrors({});
    setShowDuplicateWarning(false);
    setShowSuggestions(false);
  }, [title, description, priority, status, project, labels, dueDate, onSubmit, addTitle, onTitleCreated]);

  const handleSubmit = useCallback(() => {
    const validationErrors = validate();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    // Check for duplicate title
    if (detectDuplicate(title)) {
      setShowDuplicateWarning(true);
      return;
    }

    submitTask();
  }, [validate, detectDuplicate, title, submitTask]);

  const handleConfirmDuplicate = useCallback(() => {
    setShowDuplicateWarning(false);
    submitTask();
  }, [submitTask]);

  const handleTitleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setTitle(value);
      setShowSuggestions(value.length > 0 && history.length > 0);
      if (errors.title && value.trim()) {
        setErrors((prev) => ({ ...prev, title: undefined }));
      }
      // Dismiss duplicate warning when user edits the title
      if (showDuplicateWarning) {
        setShowDuplicateWarning(false);
      }
    },
    [errors.title, showDuplicateWarning, history.length],
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleSubmit();
      }
      if (e.key === "Escape") {
        setShowSuggestions(false);
      }
    },
    [handleSubmit],
  );

  const handleClose = useCallback(() => {
    setErrors({});
    setShowDuplicateWarning(false);
    setShowSuggestions(false);
    onClose();
  }, [onClose]);

  const handleTitleFocus = useCallback(() => {
    if (isInitialFocus.current) return;
    if (history.length > 0) {
      setShowSuggestions(true);
    }
  }, [history.length]);

  const handleSuggestionSelect = useCallback(
    (suggestion: string) => {
      setTitle(suggestion);
      setShowSuggestions(false);
      titleRef.current?.focus();
    },
    [],
  );

  const handleClickOutside = useCallback(
    (e: MouseEvent) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(e.target as Node) &&
        titleRef.current &&
        !titleRef.current.contains(e.target as Node)
      ) {
        setShowSuggestions(false);
      }
    },
    [],
  );

  useEffect(() => {
    if (showSuggestions) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [showSuggestions, handleClickOutside]);

  const filteredSuggestions = useMemo(() => {
    if (!title.trim()) return history.slice(0, 8);
    const query = title.trim().toLowerCase();
    return history
      .filter((t) => t.toLowerCase().includes(query))
      .slice(0, 8);
  }, [history, title]);

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={handleClose}
            aria-hidden="true"
          />

          {/* Dialog */}
          <motion.div
            ref={dialogRef}
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            role="dialog"
            aria-modal="true"
            aria-label={TASKS_COPY.dialog.title}
            className={cn(
              "relative z-10 flex w-full flex-col rounded-2xl border border-white/[0.06] bg-[#0D0D14] shadow-2xl",
              "max-w-sm sm:max-w-lg",
              "max-h-[calc(100vh-1.5rem)] sm:max-h-[calc(100vh-3rem)]",
              className,
            )}
            onKeyDown={handleKeyDown}
          >
            {/* Header */}
            <div className="shrink-0 px-4 pb-3 pt-4 sm:px-6 sm:pb-4 sm:pt-6">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-semibold text-white sm:text-lg">
                  {TASKS_COPY.dialog.title}
                </h2>
                <button
                  type="button"
                  ref={cancelRef}
                  onClick={handleClose}
                  className="focus-ring inline-flex size-8 items-center justify-center rounded-lg text-white/40 transition-colors hover:bg-white/[0.06] hover:text-white/70"
                  aria-label={TASKS_COPY.dialog.closeLabel}
                >
                  <X className="size-4" aria-hidden="true" />
                </button>
              </div>
            </div>

            {/* Scrollable body */}
            <div className="flex-1 overflow-y-auto overscroll-contain px-4 pb-2 sm:px-6">
              <div className="space-y-4 sm:space-y-5">
                {/* Title */}
                <div>
                  <label htmlFor="task-title" className={LABEL_CLASSES}>
                    {TASKS_COPY.dialog.fields.title.label}
                    <span className="ml-1 text-red-400" aria-hidden="true">
                      *
                    </span>
                  </label>
                  <div className="relative">
                    <input
                      ref={titleRef}
                      id="task-title"
                      type="text"
                      value={title}
                      onChange={handleTitleChange}
                      onFocus={handleTitleFocus}
                      placeholder={TASKS_COPY.dialog.fields.title.placeholder}
                      className={cn(
                        INPUT_CLASSES,
                        "mt-1.5",
                        errors.title && "ring-red-500/50",
                      )}
                      aria-invalid={!!errors.title}
                      aria-describedby={
                        errors.title ? "task-title-error" : undefined
                      }
                      role="combobox"
                      aria-autocomplete="list"
                      aria-expanded={showSuggestions}
                      aria-controls="title-suggestions-list"
                      autoComplete="off"
                    />
                    {showSuggestions && filteredSuggestions.length > 0 && (
                      <div
                        ref={suggestionsRef}
                        id="title-suggestions-list"
                        role="listbox"
                        className="absolute z-20 mt-1 max-h-60 w-full overflow-y-auto rounded-xl border border-white/[0.08] bg-[#13131D] py-1 shadow-xl"
                      >
                        {filteredSuggestions.map((suggestion) => (
                          <button
                            key={suggestion}
                            type="button"
                            role="option"
                            aria-selected={false}
                            className="flex w-full items-center px-3 py-2 text-left text-sm text-white/70 transition-colors hover:bg-white/[0.06] hover:text-white/90"
                            onMouseDown={(e) => {
                              e.preventDefault();
                              handleSuggestionSelect(suggestion);
                            }}
                          >
                            <span className="line-clamp-1">{suggestion}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  {errors.title && (
                    <motion.p
                      id="task-title-error"
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-1.5 text-xs text-red-400"
                      role="alert"
                    >
                      {errors.title}
                    </motion.p>
                  )}

                  {/* Duplicate warning */}
                  {showDuplicateWarning && (
                    <motion.div
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-2 flex items-start gap-2 rounded-xl border border-amber-500/20 bg-amber-500/10 px-3 py-2"
                      role="alert"
                    >
                      <AlertTriangle className="mt-0.5 size-3.5 shrink-0 text-amber-400" />
                      <div className="flex-1">
                        <p className="text-xs text-amber-300">
                          {TASKS_COPY.dialog.duplicateWarning}
                        </p>
                        <div className="mt-2 flex items-center gap-2">
                          <button
                            type="button"
                            onClick={handleConfirmDuplicate}
                            className="focus-ring rounded-lg bg-amber-500/20 px-2.5 py-1 text-xs font-medium text-amber-300 transition-colors hover:bg-amber-500/30"
                          >
                            Create anyway
                          </button>
                          <button
                            type="button"
                            onClick={() => setShowDuplicateWarning(false)}
                            className="focus-ring rounded-lg px-2.5 py-1 text-xs text-white/40 transition-colors hover:text-white/60"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </div>

                {/* Description */}
                <div>
                  <label htmlFor="task-description" className={LABEL_CLASSES}>
                    {TASKS_COPY.dialog.fields.description.label}
                  </label>
                  <textarea
                    id="task-description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder={TASKS_COPY.dialog.fields.description.placeholder}
                    rows={3}
                    className={cn(INPUT_CLASSES, "mt-1.5 resize-none")}
                  />
                </div>

                {/* Priority & Status row */}
                <div className="grid grid-cols-2 gap-3 sm:gap-4">
                  <div>
                    <label htmlFor="task-priority" className={LABEL_CLASSES}>
                      {TASKS_COPY.dialog.fields.priority.label}
                    </label>
                    <select
                      id="task-priority"
                      value={priority}
                      onChange={(e) =>
                        setPriority(e.target.value as TaskPriority)
                      }
                      className={cn(INPUT_CLASSES, "mt-1.5")}
                    >
                      {TASK_PRIORITIES.map((p) => (
                        <option key={p} value={p} className="bg-[#0D0D14]">
                          {p.charAt(0).toUpperCase() + p.slice(1)}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label htmlFor="task-status" className={LABEL_CLASSES}>
                      {TASKS_COPY.dialog.fields.status.label}
                    </label>
                    <select
                      id="task-status"
                      value={status}
                      onChange={(e) =>
                        setStatus(e.target.value as TaskStatus)
                      }
                      className={cn(INPUT_CLASSES, "mt-1.5")}
                    >
                      {TASK_STATUSES.filter((s) => s !== "done").map((s) => (
                        <option key={s} value={s} className="bg-[#0D0D14]">
                          {s === "todo"
                            ? "To Do"
                            : s === "in-progress"
                              ? "In Progress"
                              : s.charAt(0).toUpperCase() + s.slice(1)}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Project */}
                <div>
                  <label htmlFor="task-project" className={LABEL_CLASSES}>
                    {TASKS_COPY.dialog.fields.project.label}
                  </label>
                  <input
                    id="task-project"
                    type="text"
                    value={project}
                    onChange={(e) => setProject(e.target.value)}
                    placeholder={TASKS_COPY.dialog.fields.project.placeholder}
                    className={cn(INPUT_CLASSES, "mt-1.5")}
                  />
                </div>

                {/* Labels */}
                <div>
                  <label htmlFor="task-labels" className={LABEL_CLASSES}>
                    {TASKS_COPY.dialog.fields.labels.label}
                  </label>
                  <input
                    id="task-labels"
                    type="text"
                    value={labels}
                    onChange={(e) => setLabels(e.target.value)}
                    placeholder={TASKS_COPY.dialog.fields.labels.placeholder}
                    className={cn(INPUT_CLASSES, "mt-1.5")}
                  />
                </div>

                {/* Due Date */}
                <div>
                  {/**
                   * We still render a hidden native date input to capture
                   * the value as a string in yyyy-MM-dd format for the
                   * submit handler, while the visual DatePicker handles
                   * the user interaction.
                   */}
                  <label className={LABEL_CLASSES}>
                    {TASKS_COPY.dialog.fields.dueDate.label}
                  </label>
                  <DatePicker
                    id="task-due-date"
                    value={dueDate}
                    onChange={setDueDate}
                    label={TASKS_COPY.dialog.fields.dueDate.label}
                  />
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="shrink-0 border-t border-white/[0.06] px-4 pb-4 pt-4 sm:px-6 sm:pb-6 sm:pt-5">
              <div className="flex items-center justify-end gap-2 sm:gap-3">
                <button
                  type="button"
                  onClick={handleClose}
                  className="focus-ring flex-1 rounded-xl px-4 py-2.5 text-sm font-medium text-white/60 transition-colors hover:bg-white/[0.06] hover:text-white/80 sm:flex-none"
                >
                  {TASKS_COPY.dialog.cancelLabel}
                </button>
                <button
                  type="button"
                  onClick={handleSubmit}
                  className="focus-ring flex-1 rounded-xl bg-white px-4 py-2.5 text-sm font-medium text-[#0A0A0F] transition-shadow hover:shadow-[0_0_24px_rgba(255,255,255,0.1)] sm:flex-none"
                >
                  {TASKS_COPY.dialog.submitLabel}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

export const NewTaskDialog = memo(NewTaskDialogInner);