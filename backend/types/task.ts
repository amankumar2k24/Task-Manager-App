export type Priority = "Low" | "Medium" | "High";

export type TaskStatus = "Pending" | "In Progress" | "Completed";

export interface TaskInput {
    title: string;
    description?: string;
    dateTime: string | Date;
    endDateTime?: string | Date | null;
    priority?: Priority;
    status?: TaskStatus;
}

export interface TaskUpdateInput {
    title?: string;
    description?: string;
    dateTime?: string | Date;
    endDateTime?: string | Date | null;
    priority?: Priority;
    status?: TaskStatus;
}

export interface TaskListQuery {
    search?: string;
    weekStart?: string;
}

export interface StatusInput {
    status: TaskStatus;
}

export interface WeekSummaryResponse {
    open: number;
    completed: number;
    total: number;
}

export interface ApiResponse<T> {
    message: string;
    status: boolean;
    response?: T;
    error?: string;
}
