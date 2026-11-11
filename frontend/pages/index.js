import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import AppLayout from "../src/Layout/AppLayout";
import Onboarding from "../src/Component/Onboarding";
import SearchBar from "../src/Component/SearchBar";
import WeekStrip from "../src/Component/WeekStrip";
import SummaryCard from "../src/Component/SummaryCard";
import WeeklyProgress from "../src/Component/WeeklyProgress";
import TaskRow from "../src/Component/TaskRow";
import TaskSheet from "../src/Component/TaskSheet";
import EmptyState from "../src/Component/EmptyState";
import { useTasks } from "../src/hooks/useTasks";
import { useWeek } from "../src/hooks/useWeek";
import { isSameDay, weekStartISO } from "../src/lib/week";
import { formatDayHeading } from "../src/utils/format";
import labels from "../src/labels/labels";

const ONBOARDED_KEY = "todo-onboarded";

const PlusIcon = () => (
    <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round">
        <path d="M12 5v14M5 12h14" />
    </svg>
);

export default function Home() {
    const router = useRouter();
    const [onboarded, setOnboarded] = useState(null);
    const [sheetOpen, setSheetOpen] = useState(false);
    const [editingTask, setEditingTask] = useState(null);
    const { weekStart, days, selectedDay, selectDay } = useWeek();
    const { items, summary, loadTasks, loadWeekSummary, addTask, editTask, removeTask, toggleTask } = useTasks();

    useEffect(() => {
        setOnboarded(localStorage.getItem(ONBOARDED_KEY) === "1");
    }, []);

    useEffect(() => {
        const week = weekStartISO(weekStart);
        loadTasks({ weekStart: week });
        loadWeekSummary(week);
    }, [weekStart]);

    const dayTasks = items.filter((task) => isSameDay(new Date(task.dateTime), selectedDay));

    const openCreateSheet = () => {
        setEditingTask(null);
        setSheetOpen(true);
    };

    const openEditSheet = (task) => {
        setEditingTask(task);
        setSheetOpen(true);
    };

    const submitSheet = (payload) => {
        if (editingTask) editTask(editingTask.id, payload);
        else addTask(payload);
        setSheetOpen(false);
        setEditingTask(null);
    };

    if (onboarded === null) return <AppLayout><div className="min-h-[100dvh] bg-white" /></AppLayout>;

    if (!onboarded) {
        return (
            <AppLayout>
                <Onboarding
                    onGetStarted={() => {
                        localStorage.setItem(ONBOARDED_KEY, "1");
                        setOnboarded(true);
                    }}
                />
            </AppLayout>
        );
    }

    return (
        <AppLayout>
            <div className="bg-homeBg px-6 pb-28 pt-[37px]">
                <SearchBar value="" onChange={() => {}} onFocus={() => router.push("/search")} />
                <div className="mt-[13px]">
                    <WeekStrip days={days} selectedDay={selectedDay} onSelectDay={selectDay} />
                </div>

                <div className="mt-[31px] flex gap-[18px]">
                    <SummaryCard type="complete" count={summary.completed} />
                    <SummaryCard type="pending" count={summary.open} />
                </div>

                <div className="mt-8">
                    <WeeklyProgress open={summary.open} completed={summary.completed} />
                </div>

                <div className="mb-2 mt-[38px] flex items-center justify-between">
                    <h2 className="text-[20px] font-semibold text-ink">{formatDayHeading(selectedDay)}</h2>
                    <button onClick={() => router.push("/weeks")} className="text-[14px] font-medium text-primary">
                        {labels.viewAll}
                    </button>
                </div>

                {dayTasks.length === 0 ? (
                    <EmptyState title={labels.noTasksToday} subtitle="Tap + to add your first task for this day" />
                ) : (
                    dayTasks.map((task) => (
                        <TaskRow
                            key={task.id}
                            task={task}
                            onToggle={() => toggleTask(task)}
                            onEdit={() => openEditSheet(task)}
                            onDelete={() => removeTask(task.id)}
                        />
                    ))
                )}
            </div>

            <button
                onClick={openCreateSheet}
                aria-label="Add task"
                className="fixed bottom-[29px] left-1/2 z-40 flex h-[76px] w-[76px] -translate-x-1/2 items-center justify-center rounded-full bg-primary shadow-fab active:bg-primaryDark"
            >
                <PlusIcon />
            </button>

            <TaskSheet
                open={sheetOpen}
                task={editingTask}
                onClose={() => {
                    setSheetOpen(false);
                    setEditingTask(null);
                }}
                onSubmit={submitSheet}
            />
        </AppLayout>
    );
}
