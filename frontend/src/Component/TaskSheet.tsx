import { useEffect, useState } from "react";
import labels from "../labels/labels";
import { combineDateTime, toDateInputValue, toTimeInputValue } from "../utils/format";
import type { Priority, Task, TaskInput } from "../types/task";

const priorities: Priority[] = ["Low", "Medium", "High"];

const CloseIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#667085" strokeWidth="2" strokeLinecap="round">
        <path d="M18 6 6 18M6 6l12 12" />
    </svg>
);

const ClockIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#667085" strokeWidth="2" strokeLinecap="round">
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v5l3 2" />
    </svg>
);

const CalendarIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#667085" strokeWidth="2" strokeLinecap="round">
        <rect x="3" y="4" width="18" height="18" rx="2" />
        <path d="M16 2v4M8 2v4M3 10h18" />
    </svg>
);

const titleInputClass =
    "h-10 w-full rounded-lg border border-line bg-white px-3.5 text-[15px] text-ink outline-none focus:border-primary placeholder:text-[#98A2B3]";

const timeInputClass =
    "h-[52px] w-full rounded-lg border border-line bg-white px-3.5 text-[15px] text-ink outline-none focus:border-primary placeholder:text-[#98A2B3]";

interface TaskSheetProps {
    open: boolean;
    task: Task | null;
    onClose: () => void;
    onSubmit: (payload: TaskInput) => void;
}

export default function TaskSheet({ open, task, onClose, onSubmit }: TaskSheetProps) {
    const [title, setTitle] = useState("");
    const [date, setDate] = useState("");
    const [startTime, setStartTime] = useState("10:00");
    const [endTime, setEndTime] = useState("11:00");
    const [description, setDescription] = useState("");
    const [priority, setPriority] = useState<Priority>("Medium");
    const [error, setError] = useState("");

    useEffect(() => {
        if (!open) return;
        setTitle(task?.title || "");
        setDescription(task?.description || "");
        setPriority(task?.priority || "Medium");
        setDate(toDateInputValue(task?.dateTime || new Date().toISOString()));
        setStartTime(toTimeInputValue(task?.dateTime || new Date().toISOString()));
        setEndTime(task?.endDateTime ? toTimeInputValue(task.endDateTime) : "11:00");
        setError("");
    }, [open, task]);

    useEffect(() => {
        if (!open) return;
        const onKey = (e: KeyboardEvent): void => {
            if (e.key === "Escape") onClose();
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [open, onClose]);

    if (!open) return null;

    const submit = (): void => {
        if (!title.trim()) return setError("Please enter a task title");
        if (!date) return setError("Please pick a date");
        if (!startTime) return setError("Please pick a start time");
        onSubmit({
            title: title.trim(),
            description: description.trim(),
            dateTime: combineDateTime(date, startTime),
            endDateTime: endTime ? combineDateTime(date, endTime) : null,
            priority,
        });
    };

    return (
        <div className="overlay-enter fixed inset-0 z-50 bg-black/50" onClick={onClose}>
            <div
                className="sheet-enter absolute bottom-0 left-1/2 flex h-[585px] w-full max-w-[390px] -translate-x-1/2 flex-col rounded-t-[24px] bg-white px-6 pb-[33px] pt-5 shadow-sheet"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-center justify-between">
                    <h2 className="text-[18px] font-semibold text-ink">{task ? labels.editTask : labels.addTask}</h2>
                    <button onClick={onClose} aria-label="Close" className="p-1">
                        <CloseIcon />
                    </button>
                </div>

                <div className="no-scrollbar mt-5 flex-1 overflow-y-auto">
                    <label className="mb-1.5 block text-[13px] font-medium text-[#344054]">{labels.taskTitle}</label>
                    <input
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder={labels.taskTitlePlaceholder}
                        className={titleInputClass}
                    />

                    <label className="mb-1.5 mt-4 block text-[13px] font-medium text-[#344054]">{labels.setTime}</label>
                    <div className="flex gap-[30px]">
                        <div className="relative flex-1">
                            <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2">
                                <ClockIcon />
                            </span>
                            <input
                                type="time"
                                value={startTime}
                                onChange={(e) => setStartTime(e.target.value)}
                                className={`${timeInputClass} pl-10`}
                            />
                        </div>
                        <div className="relative flex-1">
                            <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2">
                                <ClockIcon />
                            </span>
                            <input
                                type="time"
                                value={endTime}
                                onChange={(e) => setEndTime(e.target.value)}
                                className={`${timeInputClass} pl-10`}
                            />
                        </div>
                    </div>

                    <label className="mb-1.5 mt-4 block text-[13px] font-medium text-[#344054]">{labels.setDate}</label>
                    <div className="relative">
                        <input
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            className={`${timeInputClass} pr-10`}
                        />
                        <span className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2">
                            <CalendarIcon />
                        </span>
                    </div>

                    <label className="mb-1.5 mt-4 block text-[13px] font-medium text-[#344054]">{labels.priority}</label>
                    <div className="flex gap-2">
                        {priorities.map((level) => (
                            <button
                                key={level}
                                onClick={() => setPriority(level)}
                                className={`h-12 flex-1 rounded-lg border text-[14px] font-medium ${
                                    priority === level
                                        ? "border-primary bg-primaryLight text-primary"
                                        : "border-line bg-white text-muted"
                                }`}
                            >
                                {level}
                            </button>
                        ))}
                    </div>

                    <label className="mb-1.5 mt-4 block text-[13px] font-medium text-[#344054]">{labels.description}</label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder={labels.descriptionPlaceholder}
                        className="h-[76px] w-full resize-none rounded-lg border border-line bg-white px-3.5 py-3 text-[15px] text-ink outline-none focus:border-primary placeholder:text-[#98A2B3]"
                    />

                    {error && <p className="mt-3 text-[13px] text-danger">{error}</p>}
                </div>

                <button
                    onClick={submit}
                    className="mt-5 h-12 w-full bg-primary text-[16px] font-semibold text-white active:bg-primaryDark"
                >
                    {task ? labels.saveChanges : labels.createTask}
                </button>
            </div>
        </div>
    );
}
