import { useEffect, useState } from 'react';
import { api } from '../../shared/api/client';
import { TaskPriority, TaskStatus } from '../../shared/types';

type TaskPayload = {
  title: string;
  description?: string;
  priority?: TaskPriority;
  dueDate?: string;
  assignee_id?: string;
};

export const useTasks = (projectId: string) => {
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>(null);

  const fetchTasks = async () => {
    if (!projectId) return;

    try {
      setLoading(true);
      const res = await api.get(`/projects/${projectId}/tasks`);
      setTasks(res.data);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [projectId]);

  return { tasks, loading, error, refetch: fetchTasks };
};

export const useProject = (projectId: string) => {
  const [project, setProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>(null);

  const fetchProject = async () => {
    if (!projectId) return;
    try {
      setLoading(true);
      const res = await api.get(`/projects/${projectId}`);
      setProject(res.data);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProject();
  }, [projectId]);

  return { project, loading, error, refetch: fetchProject };
};

export const useUpdateTask = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<any>(null);

  const updateTask = async ({
    taskId,
    data,
  }: {
    taskId: string;
    data: any;
  }) => {
    try {
      setLoading(true);
      const res = await api.patch(`/tasks/${taskId}`, data);
      return res.data;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { updateTask, loading, error };
};

export const useCreateTask = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<any>(null);

  const createTask = async (projectId: string, data: TaskPayload) => {
    try {
      setLoading(true);
      const res = await api.post('/tasks', { ...data, project_id: projectId, status: TaskStatus.TODO });
      return res.data;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { createTask, loading, error };
};

export const useDeleteTask = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<any>(null);

  const deleteTask = async (taskId: string) => {
    try {
      setLoading(true);
      const res = await api.delete(`/tasks/${taskId}`);
      return res.data;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { deleteTask, loading, error };
};

export const useDashboardStats = (projectId?: string) => {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<any>(null);

  const fetchStats = async (nextProjectId?: string) => {
    const resolvedProjectId = nextProjectId ?? projectId;
    if (!resolvedProjectId) return;

    try {
      setLoading(true);
      const res = await api.get(`/dashboard/${resolvedProjectId}`);
      setStats(res.data);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, [projectId]);

  return { stats, loading, error, refetch: fetchStats };
};