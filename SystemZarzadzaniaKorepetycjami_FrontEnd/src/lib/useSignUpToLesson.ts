import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateToken } from '../futures/login/loginSlice';
import { useRefreshAccessToken } from './useRefreshAccessToken';
import { RootState } from '../futures/store';

interface SignUpToLessonProps {
  email: string;
  teacherId: number;
  subjectLevelId: number;
  startDate: string;
  startTime: string;
  durationInMinutes: number;
}

export const useSignUpToLesson = (signUpData: SignUpToLessonProps | null) => {
  const [responseStatus, setResponseStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const refreshAccessToken = useRefreshAccessToken();
  const dispatch = useDispatch();
  const jwtToken = useSelector((state: RootState) => state.login.jwtToken);

  useEffect(() => {
    const signUpToLesson = async () => {
      if (!signUpData || !jwtToken) return;

      try {
        setLoading(true);
        let token = jwtToken;

        const requestData = {
          studentEmail: signUpData.email,
          teacherId: signUpData.teacherId,
          subjectLevelId: signUpData.subjectLevelId,
          startDate: signUpData.startDate,
          startTime: signUpData.startTime,
          durationInMinutes: signUpData.durationInMinutes,
        };

        let response = await fetch('http://localhost:5230/api/singUpToLesson', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(requestData),
        });

        if (!response.ok) {
          if (response.status === 401) {
            const newToken = await refreshAccessToken();
            if (newToken) {
              token = newToken;
              dispatch(updateToken(token));
              response = await fetch(
                'http://localhost:5230/api/singUpToLesson',
                {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                  },
                  body: JSON.stringify(requestData),
                }
              );
            } else {
              throw new Error('Failed to refresh token');
            }
          }

          if (response.status === 400) {
            throw new Error('Invalid data provided');
          } else if (response.status === 409) {
            throw new Error('Conflict: overlapping lesson time');
          } else if (response.status === 500) {
            throw new Error('Server error');
          } else {
            throw new Error('Unexpected error occurred');
          }
        }

        const responseData = await response.json();
        setResponseStatus(responseData);
        setError(null);
      } catch (err: any) {
        setError(err.message || 'An unexpected error occurred');
        setResponseStatus(null);
      } finally {
        setLoading(false);
      }
    };

    if (signUpData && jwtToken) {
      signUpToLesson();
    }
  }, [signUpData]);

  return { responseStatus, loading, error };
};
