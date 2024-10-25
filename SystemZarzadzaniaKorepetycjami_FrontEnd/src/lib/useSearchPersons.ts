import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../futures/store';
import { updateToken } from '../futures/login/loginSlice';
import { useRefreshAccessToken } from './useRefreshAccessToken';
import { PersonDTO } from '../types/PersonDTO';

export const useSearchPersons = () => {
  const [persons, setPersons] = useState<PersonDTO[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const dispatch = useDispatch();
  const jwtToken = useSelector((state: RootState) => state.login.jwtToken);
  const refreshAccessToken = useRefreshAccessToken();

  const searchPersons = async (search: string) => {
    setLoading(true);
    setError(null);
    let token = jwtToken;
    try {
      let response = await fetch(
        `http://localhost:5230/api/person/${search}`,
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
            token = newToken;
            const retryResponse = await fetch(
                `http://localhost:5230/api/person/${search}`,
              {
                method: 'GET',
                headers: {
                  'Content-Type': 'application/json',
                  Authorization: `Bearer ${token}`,
                },
              }
            );
            const data = await retryResponse.json();
            setPersons(data);
          } else {
            throw new Error('Failed to refresh token');
          }
        } else {
          throw new Error(
            `Failed to edit person details, status: ${response.status}`
          );
        }
      } else {
        const data = await response.json();
        setPersons(data);
      }
    } catch (error) {
      setError(
        error instanceof Error ? error.message : 'Unknown error occurred'
      );
    } finally {
      setLoading(false);
    }
  };

  return { searchPersons, persons, loading, error };
};
