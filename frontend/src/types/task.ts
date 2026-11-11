export type Priority = "Low" | "Medium" | "High";

export type TaskStatus = "In Progress" | "Completed";

export interface Task {
    id: string;
    title: string;
    description: string;
    dateTime: string;
    endDateTime: string | null;
    priority: Priority;
    status: TaskStatus;
    createdAt: string;
    updatedAt: string;
}

export interface TaskInput {
    title: string;
    description: string;
    dateTime: string;
    endDateTime: string | null;
    priority: Priority;
}

export interface TaskUpdate {
    title?: string;
    description?: string;
    dateTime?: string;
    endDateTime?: string | null;
    priority?: Priority;
    status?: TaskStatus;
}

export interface WeekSummary {
    open: number;
    completed: number;
    total: number;
}

export interface TaskQueryParams {
    search?: string;
    weekStart?: string;
}

export interface WeekGroup {
    weekStart: Date;
    tasks: Task[];
}

export interface ApiResponse<T> {
    message: string;
    status: boolean;
    response: T;
}
