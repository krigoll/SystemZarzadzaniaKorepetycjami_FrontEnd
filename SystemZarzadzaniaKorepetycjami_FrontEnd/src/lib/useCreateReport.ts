import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../futures/store';
import { updateToken } from '../futures/login/loginSlice';
import { useRefreshAccessToken } from './useRefreshAccessToken';

interface CreateReportProps {
  IdSender: number;
  Title: string;
  Content: string;
  DateTime: string;
  IsDealt: boolean;
}

export const useCreateReport = () => {
  const [responseStatus, setResponseStatus] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const dispatch = useDispatch();
  const jwtToken = useSelector((state: RootState) => state.login.jwtToken);
  const refreshAccessToken = useRefreshAccessToken();

  const createReport = async (createReport: CreateReportProps) => {
    setLoading(true);
    setError(null);
    let token = jwtToken;
    try {
      let response = await fetch(`http://localhost:5230/api/report/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(createReport),
      });

      if (!response.ok) {
        if (response.status === 401) {
          const newToken = await refreshAccessToken();
          if (newToken) {
            dispatch(updateToken(newToken));
            token = newToken;
            const retryResponse = await fetch(
              `http://localhost:5230/api/report/create`,
              {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(createReport),
              }
            );
            if (retryResponse.ok) {
              setResponseStatus(retryResponse.status);
              return 0;
            }
          } else {
            throw new Error('Failed to refresh token');
          }
        } else {
          throw new Error(
            `Failed to edit person details, status: ${response.status}`
          );
        }
      } else {
        setResponseStatus(response.status);
        return 0;
      }
      return 1;
    } catch (error) {
      setError(
        error instanceof Error ? error.message : 'Unknown error occurred'
      );
      return 1;
    } finally {
      setLoading(false);
    }
  };

  return { createReport, responseStatus, loading, error };
};
