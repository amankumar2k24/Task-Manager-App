export const normalizeTask = (task) => {
    if (!task) return task;
    const { _id, ...rest } = task;
    return { ...rest, id: task.id || _id };
};

export const normalizeTasks = (tasks) => (Array.isArray(tasks) ? tasks.map(normalizeTask) : []);

export const unwrap = (res) => res.data?.response ?? res.data;

export const apiErrorMessage = (error) =>
    error?.response?.data?.message || error?.message || "Something went wrong";
