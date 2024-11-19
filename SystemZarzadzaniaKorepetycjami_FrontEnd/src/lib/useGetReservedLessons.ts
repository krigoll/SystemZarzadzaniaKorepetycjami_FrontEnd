import { useCallback, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../futures/store';
import { useRefreshAccessToken } from './useRefreshAccessToken';
import { updateToken } from '../futures/login/loginSlice';

export const GetReservedLessons = () => {
  const [lessons, setLessons] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const jwtToken = useSelector((state: RootState) => state.login.jwtToken);
  const refreshAccessToken = useRefreshAccessToken();
  const dispatch = useDispatch();

  const getReservedLessons = useCallback(
    async (email: string) => {
      setLoading(true);
      setError(null);
      try {
        let token = jwtToken;

        const fetchLessons = async (currentToken: string) => {
          const response = await fetch(
            `http://localhost:5230/api/lesson?email=${email}`,
            {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${currentToken}`,
              },
            }
          );

          if (!response.ok) {
            if (response.status === 401) {
              const newToken = await refreshAccessToken();
              if (newToken) {
                dispatch(updateToken(newToken));
                return fetchLessons(newToken);
              } else {
                throw new Error('Failed to refresh token');
              }
            } else if (response.status === 500) {
              throw new Error('Database Error');
            } else {
              throw new Error('Unexpected Error');
            }
          }

          return response.json();
        };

        const data = await fetchLessons(token);
        setLessons(data);
      } catch (err: any) {
        console.error('Error fetching reserved lessons:', err);
        setError(err.message || 'Unknown error');
      } finally {
        setLoading(false);
      }
    },
    [jwtToken, refreshAccessToken, dispatch]
  );

  return { lessons, loading, error, getReservedLessons };
};
