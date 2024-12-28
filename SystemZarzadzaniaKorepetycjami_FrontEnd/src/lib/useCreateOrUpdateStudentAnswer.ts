import { useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../futures/store';
import { useRefreshAccessToken } from './useRefreshAccessToken';
import { updateToken } from '../futures/login/loginSlice';
import { useDispatch } from 'react-redux';

interface StudentAnswerDTO {
  idStudentAnswer: number;
  answer: string;
  idAssignment: number;
}

export const useCreateOrUpdateStudentAnswer = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const token = useSelector((state: RootState) => state.login.jwtToken);
  const dispatch = useDispatch();
  const refreshAccessToken = useRefreshAccessToken();

  const createOrUpdateStudentAnswers = async (
    idTestForStudent: number,
    studentAnswers: StudentAnswerDTO[]
  ): Promise<boolean> => {
    setLoading(true);
    setError(null);

    const attemptRequest = async (currentToken: string): Promise<Response> => {
      return fetch(
        `http://localhost:5230/api/studentAnswer?idTestForStudent=${idTestForStudent}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${currentToken}`,
          },
          body: JSON.stringify(studentAnswers),
        }
      );
    };

    try {
      let response = await attemptRequest(token);

      if (response.status === 401) {
        const newToken = await refreshAccessToken();
        if (newToken) {
          dispatch(updateToken(newToken));
          response = await attemptRequest(newToken);
        } else {
          throw new Error('Failed to refresh token');
        }
      }

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

      return true;
    } catch (err) {
      console.error('Error during request:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { createOrUpdateStudentAnswers, loading, error };
};
