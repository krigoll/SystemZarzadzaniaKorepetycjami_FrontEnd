import { useState } from 'react';
import { useRefreshAccessToken } from './useRefreshAccessToken';
import { useDispatch, useSelector } from 'react-redux';
import { updateToken } from '../futures/login/loginSlice';
import { RootState } from '../futures/store';

export const useSignUpToLesson = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [responseStatus, setResponseStatus] = useState<number | null>(null);
  const refreshAccessToken = useRefreshAccessToken();
  const dispatch = useDispatch();
  const jwtToken = useSelector((state: RootState) => state.login.jwtToken);

  const signUp = async ({
    teacherId,
    email,
    subjectLevelId,
    startDate,
    startTime,
    durationInMinutes,
  }: {
    teacherId: string;
    email: string;
    subjectLevelId: string;
    startDate: string;
    startTime: string;
    durationInMinutes: number;
  }) => {
    setLoading(true);
    setError(null);

    try {
      const requestData = {
        studentEmail: email,
        teacherId: teacherId,
        subjectLevelId: subjectLevelId,
        startDate: startDate,
        startTime: startTime,
        durationInMinutes: durationInMinutes,
      };
      let token = jwtToken;
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
            response = await fetch('http://localhost:5230/api/singUpToLesson', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify(requestData),
            });
          } else {
            throw new Error('Failed to refresh token');
          }
        } else if (response.status === 409) {
          throw new Error(
            'Ty albo nauczyciel macie nakładające się zajęcia w danym czasie!'
          );
        } else if (response.status === 422) {
          throw new Error('Nauczyciel nie jest wolny w wybranym terminie!');
        } else {
          throw new Error('Error during lesson signup');
        }
      }

      setResponseStatus(response.status);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return { signUp, loading, error, responseStatus };
};
