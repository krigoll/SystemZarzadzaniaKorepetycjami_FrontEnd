import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateToken } from '../futures/login/loginSlice';
import { useRefreshAccessToken } from './useRefreshAccessToken';
import { RootState } from '../futures/store';
import { base64ToFile } from './ConvertImage';

interface PersonResponse {
  idPerson: number;
  name: string;
  surname: string;
  image: string | null;
  isTeacher: boolean;
  isStudent: boolean;
}

interface Person {
  idPerson: number;
  name: string;
  surname: string;
  image: File | null;
  isTeacher: boolean;
  isStudent: boolean;
}

export const useGetUsers = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const token = useSelector((state: RootState) => state.login.jwtToken);
  const dispatch = useDispatch();
  const refreshAccessToken = useRefreshAccessToken();

  useEffect(() => {
    const fetchUsers = async (token: string) => {
      try {
        const response = await fetch('http://localhost:5230/api/person/', {
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
              dispatch(updateToken(newToken));
              return fetchUsers(newToken);
            } else {
              throw new Error('Failed to refresh token');
            }
          }
          if (response.status === 403) {
            throw new Error('Nie admin');
          }
          throw new Error('Failed to fetch users' + ' ' + response.status);
        }

        let usersData: PersonResponse[] = await response.json();
        const usersList: Person[] = usersData.map((person) => ({
          idPerson: person.idPerson,
          name: person.name,
          surname: person.surname,
          image: person.image
            ? base64ToFile(person.image, 'profileImage.jpg')
            : null,
          isTeacher: person.isTeacher,
          isStudent: person.isStudent,
        }));
        setUsers(usersList);
      } catch (error) {
        console.error('Error fetching users:', error);
        setError(error instanceof Error ? error.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchUsers(token);
    } else {
      setLoading(false);
    }
  }, [token]);

  return { users, loading, error };
};
