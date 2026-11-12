import { useState } from "react";
import TaskSheet from "../Component/TaskSheet";
import TaskDetailSheet from "../Component/TaskDetailSheet";
import { useTasks } from "./useTasks";
import type { Task, TaskInput } from "../types/task";

export const useTaskSheets = () => {
    const { items, searchResults, addTask, editTask, removeTask, toggleTask } = useTasks();
    const [viewingId, setViewingId] = useState<string | null>(null);
    const [editingTask, setEditingTask] = useState<Task | null>(null);
    const [formOpen, setFormOpen] = useState(false);
    const [defaultDate, setDefaultDate] = useState<Date | undefined>(undefined);

    const viewingTask = viewingId
        ? items.find((task) => task.id === viewingId) ?? searchResults.find((task) => task.id === viewingId) ?? null
        : null;

    const openView = (task: Task): void => setViewingId(task.id);
    const closeView = (): void => setViewingId(null);

    const openCreate = (day?: Date): void => {
        setEditingTask(null);
        setDefaultDate(day);
        setFormOpen(true);
    };

    const openEdit = (task: Task): void => {
        setViewingId(null);
        setEditingTask(task);
        setFormOpen(true);
    };

    const closeForm = (): void => {
        setFormOpen(false);
        setEditingTask(null);
    };

    const submit = async (payload: TaskInput): Promise<void> => {
        const saved = editingTask ? await editTask(editingTask.id, payload) : await addTask(payload);
        if (saved) closeForm();
    };

    const remove = async (task: Task): Promise<void> => {
        const deleted = await removeTask(task.id);
        if (deleted && viewingId === task.id) closeView();
    };

    const toggle = (task: Task): void => {
        void toggleTask(task);
    };

    const sheets = (
        <>
            <TaskDetailSheet task={viewingTask} onClose={closeView} onEdit={openEdit} onDelete={remove} onToggle={toggle} />
            <TaskSheet open={formOpen} task={editingTask} defaultDate={defaultDate} onClose={closeForm} onSubmit={submit} />
        </>
    );

    const rowActions = (task: Task) => ({
        onView: () => openView(task),
        onEdit: () => openEdit(task),
        onDelete: () => void remove(task),
        onToggle: () => toggle(task),
    });

    return { openCreate, openEdit, openView, remove, toggle, rowActions, sheets };
};
