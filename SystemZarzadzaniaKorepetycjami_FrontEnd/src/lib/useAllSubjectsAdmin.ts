import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateToken } from '../futures/login/loginSlice';
import { useRefreshAccessToken } from './useRefreshAccessToken';
import { RootState } from '../futures/store';

export const useAllSubjectsAdmin = () => {
  const [subjects, setSubjects] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const token = useSelector((state: RootState) => state.login.jwtToken);
  const dispatch = useDispatch();
  const refreshAccessToken = useRefreshAccessToken();

  const fetchSubjects = async (token: string) => {
    try {
      const response = await fetch(
        'http://localhost:5230/api/subject/getAllSubjectsAdmin',
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        if (response.status === 401) {
          const newToken = await refreshAccessToken();
          if (newToken) {
            dispatch(updateToken(newToken));
            return fetchSubjects(newToken);
          } else {
            throw new Error('Failed to refresh token');
          }
        }
        throw new Error('Failed to fetch subjects');
      }

      const subjectsData = await response.json();
      setSubjects(subjectsData);
    } catch (error) {
      console.error('Error fetching subjects:', error);
      setError(error instanceof Error ? error.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchSubjects(token);
    } else {
      setLoading(false);
    }
  }, [token]);

  const refresh = () => {
    setLoading(true);
    setSubjects([]);
    setError(null);
    if (token) {
      fetchSubjects(token);
    }
  };

  return { subjects, loading, error, refresh };
};
