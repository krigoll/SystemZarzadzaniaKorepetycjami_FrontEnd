import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../futures/store';
import { updateToken } from '../futures/login/loginSlice';
import { useRefreshAccessToken } from './useRefreshAccessToken';

export const useGiveTest = () => {
  const [responseStatus, setResponseStatus] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const dispatch = useDispatch();
  const jwtToken = useSelector((state: RootState) => state.login.jwtToken);
  const refreshAccessToken = useRefreshAccessToken();

  const giveTest = async (idTest: number | null, idStudent: number) => {
    setLoading(true);
    setError(null);
    let token = jwtToken;
    try {
      let response = await fetch(
        `http://localhost:5230/api/testForStudent?idStudent=${idStudent}&idTest=${idTest}`,
        {
          method: 'PUT',
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
            token = newToken;
            const retryResponse = await fetch(
              `http://localhost:5230/api/testForStudent?idStudent=${idTest}&idTest=${idStudent}`,
              {
                method: 'PUT',
                headers: {
                  'Content-Type': 'application/json',
                  Authorization: `Bearer ${token}`,
                },
              }
            );
            setResponseStatus(retryResponse.status);
          } else {
            throw new Error('Failed to refresh token');
          }
        } else {
          throw new Error(`Failed to give test, status: ${response.status}`);
        }
      } else {
        setResponseStatus(response.status);
      }
    } catch (error) {
      setError(
        error instanceof Error ? error.message : 'Unknown error occurred'
      );
    } finally {
      setLoading(false);
    }
  };

  return { giveTest, responseStatus, loading, error };
};
