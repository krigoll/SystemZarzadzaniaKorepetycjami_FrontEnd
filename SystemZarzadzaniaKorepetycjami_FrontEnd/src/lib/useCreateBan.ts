import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../futures/store';
import { updateToken } from '../futures/login/loginSlice';
import { useRefreshAccessToken } from './useRefreshAccessToken';

interface BanDTO {
  idPerson: number | null;
  banedName: string;
  startTime: string;
  lenghtInDays: number;
  reason: string;
}

export const useCreateBan = () => {
  const [responseStatus, setResponseStatus] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const dispatch = useDispatch();
  const jwtToken = useSelector((state: RootState) => state.login.jwtToken);
  const refreshAccessToken = useRefreshAccessToken();

  const createBan = async (banDTO: BanDTO) => {
    setLoading(true);
    setError(null);
    let token = jwtToken;
    try {
      let response = await fetch(`http://localhost:5230/api/ban/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(banDTO),
      });

      if (!response.ok) {
        if (response.status === 401) {
          const newToken = await refreshAccessToken();
          if (newToken) {
            dispatch(updateToken(newToken));
            token = newToken;
            const retryResponse = await fetch(
              `http://localhost:5230/api/ban/create`,
              {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(banDTO),
              }
            );

            if (retryResponse.ok) {
              setResponseStatus(retryResponse.status);
            } else {
              const retryResponseData = await retryResponse.json();
              throw new Error(
                retryResponseData.message ||
                  `Failed to ban, status: ${retryResponse.status}`
              );
            }
          } else {
            throw new Error('Failed to refresh token');
          }
        } else {
          const responseData = await response.json();
          throw new Error(
            responseData.message || `Failed to ban, status: ${response.status}`
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

  return { createBan, responseStatus, loading, error };
};
