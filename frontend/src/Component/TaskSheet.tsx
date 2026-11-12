import { useEffect, useState } from "react";
import { X, Clock, Calendar } from "lucide-react";
import labels from "../labels/labels";
import { combineDateTime, toDateInputValue, toTimeInputValue } from "../utils/format";
import type { Priority, Task, TaskInput } from "../types/task";

const priorities: Priority[] = ["Low", "Medium", "High"];

const labelClass = "mb-2 block text-[12px] font-medium leading-[18px] text-fieldLabel";
const fieldClass =
    "h-10 w-full border border-line bg-white px-[10px] text-[14px] font-normal leading-5 text-ink outline-none focus:border-primary placeholder:text-ink/40";
const iconClass = "pointer-events-none absolute top-1/2 -translate-y-1/2 text-fieldLabel";

interface TaskSheetProps {
    open: boolean;
    task: Task | null;
    defaultDate?: Date;
    onClose: () => void;
    onSubmit: (payload: TaskInput) => void | Promise<void>;
}

export default function TaskSheet({ open, task, defaultDate, onClose, onSubmit }: TaskSheetProps) {
    const [saving, setSaving] = useState(false);
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
        setDate(toDateInputValue(task?.dateTime || (defaultDate ?? new Date()).toISOString()));
        setStartTime(task ? toTimeInputValue(task.dateTime) : "10:00");
        setEndTime(task?.endDateTime ? toTimeInputValue(task.endDateTime) : task ? "" : "11:00");
        setError("");
        setSaving(false);
    }, [open, task, defaultDate]);

    useEffect(() => {
        if (!open) return;
        const onKey = (e: KeyboardEvent): void => {
            if (e.key === "Escape") onClose();
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [open, onClose]);

    if (!open) return null;

    const submit = async (): Promise<void> => {
        if (!title.trim()) return setError("Please enter a task title");
        if (!date) return setError("Please pick a date");
        if (!startTime) return setError("Please pick a start time");
        if (endTime && endTime <= startTime) return setError("End time must be after the start time");
        setError("");
        setSaving(true);
        try {
            await onSubmit({
                title: title.trim(),
                description: description.trim(),
                dateTime: combineDateTime(date, startTime),
                endDateTime: endTime ? combineDateTime(date, endTime) : null,
                priority,
            });
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="overlay-enter absolute inset-0 z-50 bg-black/50" onClick={onClose}>
            <div
                role="dialog"
                aria-modal="true"
                aria-labelledby="task-sheet-title"
                className="sheet-enter absolute bottom-0 left-0 flex h-[585px] w-full flex-col bg-white px-6 max-[375px]:px-4 pb-8 pt-6"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-center justify-between">
                    <h2 id="task-sheet-title" className="text-[18px] font-medium leading-[27px] text-ink">
                        {task ? labels.editTask : labels.addTask}
                    </h2>
                    <button onClick={onClose} aria-label="Close">
                        <X size={24} strokeWidth={1.5} color="#090E23" />
                    </button>
                </div>

                <div className="no-scrollbar mt-8 flex-1 overflow-y-auto">
                    <label htmlFor="task-title" className={labelClass}>{labels.taskTitle}</label>
                    <input
                        id="task-title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder={labels.taskTitlePlaceholder}
                        className={fieldClass}
                    />

                    <span className={`${labelClass} mt-6`}>{labels.setTime}</span>
                    <div className="flex gap-[30px]">
                        <div className="relative flex-1">
                            <Clock size={18} strokeWidth={1.5} className={`${iconClass} left-[10px]`} />
                            <input
                                type="time"
                                aria-label={labels.start}
                                value={startTime}
                                onChange={(e) => setStartTime(e.target.value)}
                                className={`${fieldClass} pl-10`}
                            />
                        </div>
                        <div className="relative flex-1">
                            <Clock size={18} strokeWidth={1.5} className={`${iconClass} left-[10px]`} />
                            <input
                                type="time"
                                aria-label={labels.ends}
                                value={endTime}
                                onChange={(e) => setEndTime(e.target.value)}
                                className={`${fieldClass} pl-10`}
                            />
                        </div>
                    </div>

                    <label htmlFor="task-date" className={`${labelClass} mt-6`}>{labels.setDate}</label>
                    <div className="relative">
                        <input
                            id="task-date"
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            className={`${fieldClass} pr-10`}
                        />
                        <Calendar size={18} strokeWidth={1.5} className={`${iconClass} right-[11px]`} />
                    </div>

                    <span className={`${labelClass} mt-6`}>{labels.priority}</span>
                    <div className="flex gap-2" role="radiogroup" aria-label={labels.priority}>
                        {priorities.map((level) => (
                            <button
                                key={level}
                                role="radio"
                                aria-checked={priority === level}
                                onClick={() => setPriority(level)}
                                className={`h-10 flex-1 border text-[14px] font-normal leading-5 ${priority === level
                                    ? "border-primary bg-primaryLight text-primary"
                                    : "border-line bg-white text-ink"
                                    }`}
                            >
                                {level}
                            </button>
                        ))}
                    </div>

                    <label htmlFor="task-description" className={`${labelClass} mt-6`}>{labels.description}</label>
                    <textarea
                        id="task-description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder={labels.descriptionPlaceholder}
                        className="h-[100px] w-full resize-none border border-line bg-white px-[10px] py-[10px] text-[14px] font-normal leading-5 text-ink outline-none focus:border-primary placeholder:text-ink/40"
                    />

                    {error && <p role="alert" className="mt-3 text-[12px] leading-[18px] text-danger">{error}</p>}
                </div>

                <button
                    onClick={() => void submit()}
                    disabled={saving}
                    className="mt-[26px] h-12 w-full shrink-0 bg-primary text-[16px] font-medium leading-5 text-white active:bg-primaryDark disabled:opacity-60"
                >
                    {saving ? "Saving…" : task ? labels.saveChanges : labels.createTask}
                </button>
            </div>
        </div>
    );
}
