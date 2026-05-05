import { useEffect, useState } from 'react';
import { api } from '../../shared/api/client';

export const useProjects = () => {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>(null);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const res = await api.get('/projects');
      setProjects(res.data);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  return { projects, loading, error, refetch: fetchProjects };
};

export const useCreateProject = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<any>(null);

  const createProject = async (data: { name: string; description?: string }) => {
    try {
      setLoading(true);
      const res = await api.post('/projects', data);
      return res.data;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { createProject, loading, error };
};