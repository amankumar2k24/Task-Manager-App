import { useRef, useState } from "react";
import PriorityBadge from "./PriorityBadge";
import { timeRange } from "../utils/format";
import labels from "../labels/labels";

const DELETE_WIDTH = 72;

const CheckIcon = () => (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 6 9 17l-5-5" />
    </svg>
);

const TrashIcon = () => (
    <svg width="20" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 6h18" />
        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
        <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    </svg>
);

const EditIcon = () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 3a2.8 2.8 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
    </svg>
);

export default function TaskRow({ task, onToggle, onEdit, onDelete }) {
    const [offset, setOffset] = useState(0);
    const [dragging, setDragging] = useState(false);
    const startX = useRef(0);
    const startOffset = useRef(0);
    const completed = task.status === "Completed";

    const handleTouchStart = (e) => {
        startX.current = e.touches[0].clientX;
        startOffset.current = offset;
        setDragging(true);
    };

    const handleTouchMove = (e) => {
        const dx = e.touches[0].clientX - startX.current;
        setOffset(Math.max(-DELETE_WIDTH, Math.min(0, startOffset.current + dx)));
    };

    const handleTouchEnd = () => {
        setDragging(false);
        setOffset((current) => (current < -DELETE_WIDTH / 2 ? -DELETE_WIDTH : 0));
    };

    const reset = () => setOffset(0);

    return (
        <div className="relative overflow-hidden">
            <button
                onClick={onDelete}
                className="absolute inset-y-0 right-0 flex w-[72px] items-center justify-center bg-danger text-[13px] font-medium text-white"
            >
                {labels.delete}
            </button>
            <div
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
                className="relative flex items-center gap-3 border-b border-[#F1F1F2] bg-white py-3"
                style={{
                    transform: `translateX(${offset}px)`,
                    transition: dragging ? "none" : "transform 0.2s ease",
                }}
            >
                <button
                    onClick={onToggle}
                    aria-label={completed ? "Mark as in progress" : "Mark as completed"}
                    className={`flex h-[20px] w-[20px] shrink-0 items-center justify-center rounded-md border-2 ${
                        completed ? "border-primary bg-primary" : "border-[#D0D5DD] bg-white"
                    }`}
                >
                    {completed && <CheckIcon />}
                </button>
                <button onClick={onEdit} className="min-w-0 flex-1 text-left">
                    <span className={`block truncate text-[16px] font-medium ${completed ? "text-[#98A2B3] line-through" : "text-ink"}`}>
                        {task.title}
                    </span>
                    <span className="mt-1 flex items-center gap-2 text-[12px] text-muted">
                        {timeRange(task)}
                        <PriorityBadge priority={task.priority} />
                    </span>
                </button>
                <span className="flex shrink-0 items-center gap-3 text-[#98A2B3]">
                    <button onClick={() => { reset(); onDelete(); }} aria-label="Delete task" className="p-0.5">
                        <TrashIcon />
                    </button>
                    <button onClick={() => { reset(); onEdit(); }} aria-label="Edit task" className="p-0.5">
                        <EditIcon />
                    </button>
                </span>
            </div>
        </div>
    );
}
