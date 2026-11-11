import { useEffect } from "react";
import { X } from "lucide-react";
import PriorityBadge from "./PriorityBadge";
import labels from "../labels/labels";
import { formatDateLong, timeRange } from "../utils/format";
import type { Task } from "../types/task";

interface TaskDetailSheetProps {
    task: Task | null;
    onClose: () => void;
    onEdit: (task: Task) => void;
    onDelete: (task: Task) => void;
    onToggle: (task: Task) => void;
}

const labelClass = "mb-2 block text-[12px] font-medium leading-[18px] text-fieldLabel";
const valueClass = "text-[14px] font-normal leading-5 text-ink";

// Read-only "view" of a task, opened by tapping a task row. Styled like the Add Task sheet.
export default function TaskDetailSheet({ task, onClose, onEdit, onDelete, onToggle }: TaskDetailSheetProps) {
    useEffect(() => {
        if (!task) return;
        const onKey = (e: KeyboardEvent): void => {
            if (e.key === "Escape") onClose();
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [task, onClose]);

    if (!task) return null;
    const completed = task.status === "Completed";

    return (
        <div className="overlay-enter absolute inset-0 z-50 bg-black/50" onClick={onClose}>
            <div
                role="dialog"
                aria-modal="true"
                aria-labelledby="task-detail-title"
                className="sheet-enter absolute bottom-0 left-0 flex max-h-[585px] w-full flex-col bg-white px-6 pb-8 pt-6"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-start justify-between gap-4">
                    <h2
                        id="task-detail-title"
                        className={`min-w-0 break-words text-[18px] font-medium leading-[27px] text-ink ${completed ? "line-through" : ""}`}
                    >
                        {task.title}
                    </h2>
                    <button onClick={onClose} aria-label="Close" className="shrink-0">
                        <X size={24} strokeWidth={1.5} color="#090E23" />
                    </button>
                </div>

                <div className="no-scrollbar mt-8 flex-1 overflow-y-auto">
                    <span className={labelClass}>{labels.setDate}</span>
                    <p className={valueClass}>{formatDateLong(task.dateTime)}</p>

                    <span className={`${labelClass} mt-6`}>{labels.setTime}</span>
                    <p className={valueClass}>{timeRange(task)}</p>

                    <span className={`${labelClass} mt-6`}>{labels.priority}</span>
                    <PriorityBadge priority={task.priority} />

                    <span className={`${labelClass} mt-6`}>{labels.status}</span>
                    <p className={valueClass}>{task.status}</p>

                    <span className={`${labelClass} mt-6`}>{labels.description}</span>
                    <p className={`${valueClass} whitespace-pre-wrap break-words ${task.description ? "" : "text-ink/40"}`}>
                        {task.description || labels.noDescription}
                    </p>
                </div>

                <div className="mt-[26px] flex shrink-0 gap-3">
                    <button
                        onClick={() => onToggle(task)}
                        className="h-12 flex-1 border border-primary text-[14px] font-medium leading-5 text-primary"
                    >
                        {completed ? labels.markInProgress : labels.markCompleted}
                    </button>
                    <button
                        onClick={() => onDelete(task)}
                        className="h-12 flex-1 border border-danger text-[14px] font-medium leading-5 text-danger"
                    >
                        {labels.delete}
                    </button>
                </div>
                <button
                    onClick={() => onEdit(task)}
                    className="mt-3 h-12 w-full shrink-0 bg-primary text-[16px] font-medium leading-5 text-white active:bg-primaryDark"
                >
                    {labels.editTask}
                </button>
            </div>
        </div>
    );
}
