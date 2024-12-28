import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { RootState } from '../futures/store';
import { useRefreshAccessToken } from './useRefreshAccessToken';
import { updateToken } from '../futures/login/loginSlice';

interface MarkDTO {
  idMark: number;
  description: string;
  value: boolean;
  idStudentAnswer: number;
}

export const useCreateOrUpdateMark = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const token = useSelector((state: RootState) => state.login.jwtToken);
  const dispatch = useDispatch();
  const refreshAccessToken = useRefreshAccessToken();

  const createOrUpdateMarks = async (marks: MarkDTO[]): Promise<boolean> => {
    setLoading(true);
    setError(null);

    const attemptRequest = async (currentToken: string): Promise<Response> => {
      return fetch('http://localhost:5230/api/mark', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${currentToken}`,
        },
        body: JSON.stringify(marks),
      });
    };

    try {
      let response = await attemptRequest(token);

      // Handle 401 Unauthorized (Token refresh logic)
      if (response.status === 401) {
        const newToken = await refreshAccessToken();
        if (newToken) {
          dispatch(updateToken(newToken));
          response = await attemptRequest(newToken);
        } else {
          throw new Error('Failed to refresh token');
        }
      }

      // Handle responses based on the status code
      if (!response.ok) {
        switch (response.status) {
          case 400:
            const errorText = await response.text();
            setError(errorText);
            break;
          case 500:
            setError('Server Error');
            break;
          default:
            setError('Unexpected Error');
        }
        return false;
      }

      // If everything is OK
      return true;
    } catch (err) {
      console.error('Error during request:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { createOrUpdateMarks, loading, error };
};
