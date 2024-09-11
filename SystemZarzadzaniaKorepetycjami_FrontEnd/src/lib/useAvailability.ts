import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateToken } from '../futures/login/loginSlice';
import { useRefreshAccessToken } from './useRefreshAccessToken';
import { RootState } from '../futures/store';

export const useAvailability = (email: string) => {
  const [availability, setAvailability] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const token = useSelector((state: RootState) => state.login.jwtToken);
  const dispatch = useDispatch();
  const refreshAccessToken = useRefreshAccessToken();

  useEffect(() => {
    const fetchAvailability = async (token: string) => {
      try {
        const response = await fetch(
          `http://localhost:5230/api/availability?email=${email}`,
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
              return fetchAvailability(newToken); // Retry with refreshed token
            } else {
              throw new Error('Failed to refresh token');
            }
          } else if (response.status === 400) {
            throw new Error('Invalid Email');
          } else if (response.status === 500) {
            throw new Error('Database Error');
          } else {
            throw new Error('Unexpected Error');
          }
        }

        const availabilityData = await response.json();
        setAvailability(availabilityData);
      } catch (error) {
        setError(error instanceof Error ? error.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchAvailability(token);
    } else {
      setLoading(false);
    }
  }, [email, token]);

  return { availability, loading, error };
};
