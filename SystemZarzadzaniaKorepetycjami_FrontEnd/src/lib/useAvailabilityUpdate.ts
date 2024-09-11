import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../futures/store';
import { updateToken } from '../futures/login/loginSlice';
import { useRefreshAccessToken } from './useRefreshAccessToken';

interface AvailabilityDTO {
  idDayOfTheWeek: number;
  startTime: string | null;
  endTime: string | null;
}

export const useAvailabilityUpdate = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const dispatch = useDispatch();

  const token = useSelector((state: RootState) => state.login.jwtToken);
  const email = useSelector((state: RootState) => state.login.email);
  const refreshAccessToken = useRefreshAccessToken();

  const updateAvailability = async (availabilities: AvailabilityDTO[]) => {
    setLoading(true);
    setError(null);

    // Replace empty string with null for startTime and endTime
    availabilities.forEach((availability) => {
      if (availability.startTime === '') availability.startTime = null;
      if (availability.endTime === '') availability.endTime = null;
    });

    const postAvailability = async (token: string) => {
      try {
        const response = await fetch(
          `http://localhost:5230/api/availability?email=${email}`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(availabilities),
          }
        );

        if (!response.ok) {
          if (response.status === 401) {
            const newToken = await refreshAccessToken();
            if (newToken) {
              dispatch(updateToken(newToken));
              return postAvailability(newToken); // Retry with new token
            } else {
              throw new Error('Token refresh failed');
            }
          } else if (response.status === 400) {
            const message = response.statusText;
            if (message === 'Invalid User') throw new Error('Email Error');
            if (message === 'Invalid Time')
              throw new Error('Invalid Time Error');
            throw new Error('Invalid Time Data');
          } else if (response.status === 500) {
            throw new Error('Database Error');
          } else {
            throw new Error('Unexpected Error');
          }
        }

        alert('Dostępność została zapisana');
        return response;
      } catch (err) {
        throw err;
      }
    };

    try {
      await postAvailability(token);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unexpected error');
    } finally {
      setLoading(false);
    }
  };

  return { updateAvailability, loading, error };
};
