import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import AppLayout from "../src/Layout/AppLayout";
import SearchBar from "../src/Component/SearchBar";
import TaskRow from "../src/Component/TaskRow";
import TaskSheet from "../src/Component/TaskSheet";
import EmptyState from "../src/Component/EmptyState";
import { useTasks } from "../src/hooks/useTasks";
import labels from "../src/labels/labels";
import type { Task, TaskInput } from "../src/types/task";

const BackIcon = () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#101828" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M19 12H5" />
        <path d="m12 19-7-7 7-7" />
    </svg>
);

export default function Search() {
    const router = useRouter();
    const [query, setQuery] = useState("");
    const [sheetOpen, setSheetOpen] = useState(false);
    const [editingTask, setEditingTask] = useState<Task | null>(null);
    const { items, searchResults, search, clearSearch, editTask, removeTask, toggleTask } = useTasks();

    useEffect(() => {
        const timer = setTimeout(() => {
            if (query.trim()) search(query);
            else clearSearch();
        }, 300);
        return () => clearTimeout(timer);
    }, [query]);

    const results = query.trim() ? searchResults : items;

    const openEditSheet = (task: Task): void => {
        setEditingTask(task);
        setSheetOpen(true);
    };

    const submitSheet = (payload: TaskInput): void => {
        if (!editingTask) return;
        editTask(editingTask.id, payload);
        setSheetOpen(false);
        setEditingTask(null);
    };

    return (
        <AppLayout>
            <div className="px-6 pb-10 pt-[37px]">
                <button onClick={() => router.back()} aria-label="Back" className="mb-4 p-1">
                    <BackIcon />
                </button>
                <SearchBar value={query} onChange={setQuery} autoFocus placeholder={labels.searchPlaceholder} />
                <div className="mt-4">
                    {results.length === 0 ? (
                        <EmptyState
                            title={query.trim() ? labels.noResults : labels.searchHint}
                            subtitle={query.trim() ? "Try a different keyword" : "Search by title or description"}
                        />
                    ) : (
                        results.map((task) => (
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
            </div>

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
