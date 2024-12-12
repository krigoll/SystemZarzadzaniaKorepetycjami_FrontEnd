import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../futures/store';
import { updateToken } from '../futures/login/loginSlice';
import { useRefreshAccessToken } from './useRefreshAccessToken';

interface UpdateReportProps {
  IdSender: number;
  Title: string;
  Content: string;
  DateTime: string;
  IsDealt: boolean;
}

export const useUpdateReport = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const dispatch = useDispatch();
  const jwtToken = useSelector((state: RootState) => state.login.jwtToken);
  const refreshAccessToken = useRefreshAccessToken();

  const updateReport = async (
    idReport: number,
    reportDTO: UpdateReportProps
  ) => {
    setLoading(true);
    setError(null);
    let token = jwtToken;
    try {
      let response = await fetch(
        `http://localhost:5230/api/report/${idReport}/update`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(reportDTO),
        }
      );

      if (!response.ok) {
        if (response.status === 401) {
          const newToken = await refreshAccessToken();
          if (newToken) {
            dispatch(updateToken(newToken));
            token = newToken;
            await fetch(`http://localhost:5230/api/report/${idReport}/update`, {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify(reportDTO),
            });
          } else {
            throw new Error('Failed to refresh token');
          }
        } else {
          throw new Error(
            `Failed to edit update report, status: ${response.status}`
          );
        }
      }
    } catch (error) {
      setError(
        error instanceof Error ? error.message : 'Unknown error occurred'
      );
    } finally {
      setLoading(false);
    }
  };

  return { updateReport, loading, error };
};
