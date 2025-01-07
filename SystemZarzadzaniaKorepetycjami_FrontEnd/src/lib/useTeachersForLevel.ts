import { useState, useEffect } from 'react';
import { base64ToFile } from './ConvertImage';
import { useRefreshAccessToken } from './useRefreshAccessToken';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../futures/store';
import { updateToken } from '../futures/login/loginSlice';

interface Teacher {
  id: number;
  name: string;
  price: number;
  image: File | null;
  avgOpinion: number;
}

interface TeacherResponse {
  idPerson: number;
  name: string;
  surname: string;
  hourlyRate: number;
  image: string | null;
  avgOpinion: number;
}

export const useTeachersForLevel = (subjectLevelId: number, email: string) => {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const refreshAccessToken = useRefreshAccessToken();
  const dispatch = useDispatch();
  const token = useSelector((state: RootState) => state.login.jwtToken);

  const fetchTeachersForLevel = async (
    id: number,
    currentToken: string
  ): Promise<Teacher[]> => {
    try {
      const response = await fetch(
        `http://localhost:5230/api/teacher?subjectLevelId=${id}&email=${email}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${currentToken}`,
          },
        }
      );

      if (!response.ok) {
        if (response.status === 401) {
          const newToken = await refreshAccessToken();
          if (newToken) {
            dispatch(updateToken(newToken));
            return fetchTeachersForLevel(id, newToken);
          } else {
            throw new Error('Unable to refresh access token');
          }
        } else if (response.status === 500) {
          throw new Error('Database Error');
        } else {
          throw new Error('Unexpected Error');
        }
      }

      const data: TeacherResponse[] = await response.json();
      return data.map((teacher) => ({
        id: teacher.idPerson,
        name: `${teacher.name} ${teacher.surname}`,
        price: teacher.hourlyRate,
        image: teacher.image
          ? base64ToFile(teacher.image, 'profileImage.jpg')
          : null,
        avgOpinion: teacher.avgOpinion,
      }));
    } catch (error) {
      console.error('Error fetching teachers:', error);
      throw error;
    }
  };

  useEffect(() => {
    const loadTeachers = async () => {
      setLoading(true);
      setError(null);

      try {
        const teacherData = await fetchTeachersForLevel(subjectLevelId, token);
        setTeachers(teacherData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    if (subjectLevelId && token) {
      loadTeachers();
    }
  }, [subjectLevelId]);

  return { teachers, loading, error };
};
