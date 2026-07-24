import { Task } from "../features/tasks/components/TaskCard";

export const mergeTasksWithLocal = (remoteTasks: Task[], localTasks: Task[]): Task[] => {
    const localTaskMap = new Map(localTasks.map(t => [t.id, t]));
    return remoteTasks.map(remoteTask => {
        const localTask = localTaskMap.get(remoteTask.id);
        if (localTask) {
            return {
                ...remoteTask,
                isStarred: localTask.starred,
            };
        }
        return remoteTask;
    });
};
