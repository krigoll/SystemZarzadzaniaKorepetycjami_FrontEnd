import { useEffect, useState } from 'react';
import { useRefreshAccessToken } from './useRefreshAccessToken';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../futures/store';
import { updateToken } from '../futures/login/loginSlice';

interface Assignment {
  idAssignment: number;
  content: string;
  answer: string;
}

interface TestWithAssignments {
  idTest: number;
  title: string;
  assignments: Assignment[];
}

export const useTestDetails = (testId: number | null) => {
  const [testData, setTestData] = useState<any>(null);
  const refreshAccessToken = useRefreshAccessToken();
  const dispatch = useDispatch();
  const jwtToken = useSelector((state: RootState) => state.login.jwtToken);
  const [refreshFlag, setRefreshFlag] = useState<boolean>(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        let token = jwtToken;
        let response = await fetch(`http://localhost:5230/api/test/${testId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          if (response.status === 401) {
            const newToken = await refreshAccessToken();
            if (newToken) {
              token = newToken;
              dispatch(updateToken(token));
              response = await fetch(
                `http://localhost:5230/api/test/${testId}`,
                {
                  method: 'GET',
                  headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                  },
                }
              );
            } else {
              throw new Error('Failed to refresh token');
            }
          } else {
            throw new Error('Error fetching report details');
          }
        }

        const data: TestWithAssignments = await response.json();
        setTestData(data);
      } catch (error) {
        console.error('Error feching lesson details:', error);
      }
    };

    if (testId && jwtToken) {
      fetchData();
    }
  }, [testId, refreshFlag]);

  const refetch = () => {
    setRefreshFlag(!refreshFlag);
  };

  return { testData, refetch };
};
