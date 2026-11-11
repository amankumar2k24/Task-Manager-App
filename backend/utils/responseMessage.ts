export const responseMessage = {
    taskCreated: "Task created successfully",
    tasksFetched: "Tasks fetched successfully",
    weekSummaryFetched: "Week summary fetched successfully",
    taskFetched: "Task fetched successfully",
    taskUpdated: "Task updated successfully",
    taskDeleted: "Task deleted successfully",
    taskStatusUpdated: "Task status updated successfully",
    taskNotFound: "Task not found",
    databaseNotConnected: "Database is not connected",
    internalServerError: "Internal Server Error",
    validationError: "Error from validation",
    invalidWeekStart: "weekStart must be a valid date (YYYY-MM-DD or an ISO timestamp)",
} as const;

export type ResponseMessage = (typeof responseMessage)[keyof typeof responseMessage];
