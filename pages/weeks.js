import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import AppLayout from "../src/Layout/AppLayout";
import WeekCard from "../src/Component/WeekCard";
import TaskSheet from "../src/Component/TaskSheet";
import EmptyState from "../src/Component/EmptyState";
import { useTasks } from "../src/hooks/useTasks";
import { groupTasksByWeek, startOfWeek } from "../src/lib/week";
import labels from "../src/labels/labels";

const BackIcon = () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#101828" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M19 12H5" />
        <path d="m12 19-7-7 7-7" />
    </svg>
);

export default function Weeks() {
    const router = useRouter();
    const [sheetOpen, setSheetOpen] = useState(false);
    const [editingTask, setEditingTask] = useState(null);
    const { items, loadTasks, editTask, toggleTask, removeTask } = useTasks();

    useEffect(() => {
        loadTasks({});
    }, []);

    const groups = groupTasksByWeek(items);
    const currentWeekStart = startOfWeek(new Date()).getTime();

    const openEditSheet = (task) => {
        setEditingTask(task);
        setSheetOpen(true);
    };

    return (
        <AppLayout>
            <div className="px-6 pb-10 pt-[37px]">
                <div className="mb-5 flex items-center gap-3">
                    <button onClick={() => router.back()} aria-label="Back" className="p-1">
                        <BackIcon />
                    </button>
                    <h1 className="text-[20px] font-bold text-ink">{labels.allWeeks}</h1>
                </div>
                {groups.length === 0 ? (
                    <EmptyState title={labels.noWeeks} />
                ) : (
                    <div className="flex flex-col gap-3">
                        {groups.map((group) => (
                            <WeekCard
                                key={group.weekStart.toISOString()}
                                weekStart={group.weekStart}
                                tasks={group.tasks}
                                defaultExpanded={group.weekStart.getTime() === currentWeekStart}
                                onToggle={toggleTask}
                                onEdit={openEditSheet}
                                onDelete={removeTask}
                            />
                        ))}
                    </div>
                )}
            </div>

            <TaskSheet
                open={sheetOpen}
                task={editingTask}
                onClose={() => {
                    setSheetOpen(false);
                    setEditingTask(null);
                }}
                onSubmit={(payload) => {
                    editTask(editingTask.id, payload);
                    setSheetOpen(false);
                    setEditingTask(null);
                }}
            />
        </AppLayout>
    );
}
