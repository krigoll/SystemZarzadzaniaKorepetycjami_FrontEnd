import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateToken } from '../futures/login/loginSlice';
import { useRefreshAccessToken } from './useRefreshAccessToken';
import { RootState } from '../futures/store';
import { TestForStudentDetailsDTO } from '../types/TestForStudentDetailsDTO';

export const useGetTestForStudentDetails = (idTestForStudent: number) => {
  const [testDetails, setTestDetails] =
    useState<TestForStudentDetailsDTO | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshFlag, setRefreshFlag] = useState<boolean>(false);

  const token = useSelector((state: RootState) => state.login.jwtToken);
  const dispatch = useDispatch();
  const refreshAccessToken = useRefreshAccessToken();

  useEffect(() => {
    const fetchTestDetails = async (token: string) => {
      try {
        const response = await fetch(
          `http://localhost:5230/api/testForStudent/${idTestForStudent}`,
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
              return fetchTestDetails(newToken);
            } else {
              throw new Error('Failed to refresh token');
            }
          }
          throw new Error('Failed to fetch test details: ' + response.status);
        }

        const testData: TestForStudentDetailsDTO = await response.json();
        setTestDetails(testData);
      } catch (error) {
        console.error('Error fetching test details:', error);
        setError(error instanceof Error ? error.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchTestDetails(token);
    } else {
      setLoading(false);
    }
  }, [token, refreshFlag, idTestForStudent]);

  const refetch = () => {
    setRefreshFlag(!refreshFlag);
  };

  return { testDetails, loading, error, refetch };
};
