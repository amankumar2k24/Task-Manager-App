import { useState } from "react";
import TaskRow from "./TaskRow";
import { countByStatus, weekLabel } from "../lib/week";

const ChevronIcon = ({ open }) => (
    <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#667085"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={`transition-transform duration-200 ${open ? "rotate-180" : ""}`}
    >
        <path d="m6 9 6 6 6-6" />
    </svg>
);

export default function WeekCard({ weekStart, tasks, defaultExpanded, onToggle, onEdit, onDelete }) {
    const [expanded, setExpanded] = useState(!!defaultExpanded);
    const { open, completed } = countByStatus(tasks);

    return (
        <div className="overflow-hidden rounded-2xl border border-line bg-white shadow-card">
            <button onClick={() => setExpanded(!expanded)} className="flex w-full items-center gap-3 px-4 py-4 text-left">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primaryLight text-[13px] font-bold text-primary">
                    {weekStart.getDate()}
                </span>
                <span className="min-w-0 flex-1">
                    <span className="block truncate text-[15px] font-semibold text-ink">{weekLabel(weekStart)}</span>
                    <span className="mt-0.5 block text-[12px] text-muted">
                        {open} open · {completed} completed
                    </span>
                </span>
                <ChevronIcon open={expanded} />
            </button>
            {expanded && (
                <div className="border-t border-line px-4">
                    {tasks
                        .slice()
                        .sort((a, b) => new Date(a.dateTime) - new Date(b.dateTime))
                        .map((task) => (
                            <TaskRow
                                key={task.id}
                                task={task}
                                onToggle={() => onToggle(task)}
                                onEdit={() => onEdit(task)}
                                onDelete={() => onDelete(task.id)}
                            />
                        ))}
                </div>
            )}
        </div>
    );
}
