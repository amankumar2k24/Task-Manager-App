import { useState } from "react";
import { ChevronDown } from "lucide-react";
import TaskRow from "./TaskRow";
import { countByStatus, weekLabel } from "../lib/week";
import type { Task } from "../types/task";

interface TaskRowActions {
    onView: () => void;
    onEdit: () => void;
    onDelete: () => void;
    onToggle: () => void;
}

interface WeekCardProps {
    weekStart: Date;
    tasks: Task[];
    defaultExpanded?: boolean;
    rowActions: (task: Task) => TaskRowActions;
}

export default function WeekCard({ weekStart, tasks, defaultExpanded, rowActions }: WeekCardProps) {
    const [expanded, setExpanded] = useState(!!defaultExpanded);
    const { open, completed } = countByStatus(tasks);

    return (
        <div className="overflow-hidden border border-line bg-homeBg">
            <button onClick={() => setExpanded(!expanded)} aria-expanded={expanded} className="flex w-full items-center gap-3 px-4 py-4 text-left">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center bg-completeTile text-[12px] font-semibold leading-[18px] text-progressFill">
                    {String(weekStart.getDate()).padStart(2, "0")}
                </span>
                <span className="min-w-0 flex-1">
                    <span className="block truncate text-[14px] font-medium leading-[21px] text-ink">{weekLabel(weekStart)}</span>
                    <span className="block text-[10px] font-normal leading-[15px] text-weekText">
                        {open} open · {completed} completed
                    </span>
                </span>
                <ChevronDown
                    size={18}
                    color="#667085"
                    strokeWidth={2}
                    aria-hidden="true"
                    className={`transition-transform duration-200 ${expanded ? "rotate-180" : ""}`}
                />
            </button>
            {expanded && (
                <div className="border-t border-line px-4 pb-2">
                    {tasks
                        .slice()
                        .sort((a, b) => new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime())
                        .map((task) => (
                            <TaskRow key={task.id} task={task} {...rowActions(task)} />
                        ))}
                </div>
            )}
        </div>
    );
}
