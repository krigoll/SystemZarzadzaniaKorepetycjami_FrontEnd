import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateToken } from '../futures/login/loginSlice';
import { useRefreshAccessToken } from './useRefreshAccessToken';
import { RootState } from '../futures/store';

export const usePersonDetails = (email: string) => {
  const [personData, setPersonData] = useState<any>(null);
  const refreshAccessToken = useRefreshAccessToken();
  const dispatch = useDispatch();
  const jwtToken = useSelector((state: RootState) => state.login.jwtToken);

  useEffect(() => {
    const fetchData = async () => {
      try {
        let token = jwtToken;
        let response = await fetch(
          `http://localhost:5230/api/person/getUser?email=${email}`,
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
              token = newToken;
              dispatch(updateToken(token));
              response = await fetch(
                `http://localhost:5230/api/person/getUser?email=${email}`,
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
            throw new Error('Error fetching user details');
          }
        }

        const data = await response.json();
        setPersonData(data);
      } catch (error) {
        console.error('Error fetching user details:', error);
      }
    };

    if (email && jwtToken) {
      fetchData();
    }
  }, [email]);

  return personData;
};
