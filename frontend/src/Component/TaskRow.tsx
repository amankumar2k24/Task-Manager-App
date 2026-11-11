import { useRef, useState } from "react";
import type { TouchEvent } from "react";
import { Trash2, SquarePen, Check } from "lucide-react";
import labels from "../labels/labels";
import type { Task } from "../types/task";

const DELETE_WIDTH = 72;

interface TaskRowProps {
    task: Task;
    onToggle: () => void;
    onView: () => void;
    onEdit: () => void;
    onDelete: () => void;
}

// Figma: 20px square checkbox with 1px #4566EC border, 12px gap, title Medium 14px #090E23
// (line-through when done), 24px trash/edit icons 11px apart. Rows sit 64px apart and the
// divider starts under the title (32px from the left edge).
export default function TaskRow({ task, onToggle, onView, onEdit, onDelete }: TaskRowProps) {
    const [offset, setOffset] = useState(0);
    const [dragging, setDragging] = useState(false);
    const startX = useRef(0);
    const startOffset = useRef(0);
    const completed = task.status === "Completed";

    const handleTouchStart = (e: TouchEvent<HTMLDivElement>): void => {
        startX.current = e.touches[0].clientX;
        startOffset.current = offset;
        setDragging(true);
    };

    const handleTouchMove = (e: TouchEvent<HTMLDivElement>): void => {
        const dx = e.touches[0].clientX - startX.current;
        setOffset(Math.max(-DELETE_WIDTH, Math.min(0, startOffset.current + dx)));
    };

    const handleTouchEnd = (): void => {
        setDragging(false);
        setOffset((current) => (current < -DELETE_WIDTH / 2 ? -DELETE_WIDTH : 0));
    };

    const reset = (): void => setOffset(0);

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
                className="relative bg-homeBg pb-[19px] pt-[21px]"
                style={{
                    transform: `translateX(${offset}px)`,
                    transition: dragging ? "none" : "transform 0.2s ease",
                }}
            >
                <div className="flex h-6 items-center gap-3">
                    <button
                        onClick={onToggle}
                        role="checkbox"
                        aria-checked={completed}
                        aria-label={completed ? "Mark as in progress" : "Mark as completed"}
                        className="flex h-5 w-5 shrink-0 items-center justify-center border border-primary bg-white"
                    >
                        {completed && <Check size={14} strokeWidth={2} color="#4566EC" />}
                    </button>
                    <button onClick={() => { reset(); onView(); }} aria-label={`View ${task.title}`} className="min-w-0 flex-1 text-left">
                        <span className={`block truncate text-[14px] font-medium leading-[21px] text-ink ${completed ? "line-through" : ""}`}>
                            {task.title}
                        </span>
                    </button>
                    <span className="flex shrink-0 items-center gap-[11px] text-dayMuted">
                        <button onClick={() => { reset(); onDelete(); }} aria-label="Delete task">
                            <Trash2 size={24} strokeWidth={1.5} />
                        </button>
                        <button onClick={() => { reset(); onEdit(); }} aria-label="Edit task">
                            <SquarePen size={24} strokeWidth={1.5} />
                        </button>
                    </span>
                </div>
                <span className="absolute bottom-0 left-8 right-0 h-px bg-line" aria-hidden="true" />
            </div>
        </div>
    );
}
