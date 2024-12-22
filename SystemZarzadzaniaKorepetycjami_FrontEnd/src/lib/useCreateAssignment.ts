import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../futures/store';
import { updateToken } from '../futures/login/loginSlice';
import { useRefreshAccessToken } from './useRefreshAccessToken';

interface Assignment {
  idAssignment: number;
  content: string;
  answer: string;
}

export const useCreateAssignment = (idTest: number | null) => {
  const [responseStatus, setResponseStatus] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const dispatch = useDispatch();
  const jwtToken = useSelector((state: RootState) => state.login.jwtToken);
  const refreshAccessToken = useRefreshAccessToken();

  const createAssignment = async (assignment: Assignment) => {
    setLoading(true);
    setError(null);
    let token = jwtToken;
    try {
      let response = await fetch(
        `http://localhost:5230/api/test/${idTest}/addAssignment`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(assignment),
        }
      );

      if (!response.ok) {
        if (response.status === 401) {
          const newToken = await refreshAccessToken();
          if (newToken) {
            dispatch(updateToken(newToken));
            token = newToken;
            const retryResponse = await fetch(
              `http://localhost:5230/api/test/${idTest}/addAssignment`,
              {
                method: 'PUT',
                headers: {
                  'Content-Type': 'application/json',
                  Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(assignment),
              }
            );

            if (retryResponse.ok) {
              setResponseStatus(retryResponse.status);
            } else {
              const retryResponseData = await retryResponse.json();
              throw new Error(
                retryResponseData.message ||
                  `Failed to create assignment, status: ${retryResponse.status}`
              );
            }
          } else {
            throw new Error('Failed to refresh token');
          }
        } else {
          const responseData = await response.json();
          throw new Error(
            responseData.message ||
              `Failed to create assignment, status: ${response.status}`
          );
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

  return { createAssignment, responseStatus, loading, error };
};
