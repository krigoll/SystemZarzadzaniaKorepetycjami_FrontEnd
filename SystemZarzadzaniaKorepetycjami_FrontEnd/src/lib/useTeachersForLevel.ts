import { useState, useEffect } from 'react';
import { base64ToFile } from './ConvertImage';
import { useRefreshAccessToken } from './useRefreshAccessToken';

interface Teacher {
  id: number;
  name: string;
  price: number;
  image: File | null;
}

interface TeacherResponse {
  idPerson: number;
  name: string;
  surname: string;
  hourlyRate: number;
  image: string | null;
}

export const useTeachersForLevel = (
  subjectCategoryId: number,
  token: string
) => {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const refreshAccessToken = useRefreshAccessToken();

  const fetchTeachersForLevel = async (
    id: number,
    currentToken: string
  ): Promise<Teacher[]> => {
    try {
      const response = await fetch(
        `http://localhost:5230/api/teacher?subjectCategoryId=${id}`,
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
          const newToken = await refreshAccessToken(); // Refresh token if 401 error
          if (newToken) {
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
        const teacherData = await fetchTeachersForLevel(
          subjectCategoryId,
          token
        );
        setTeachers(teacherData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    if (subjectCategoryId && token) {
      loadTeachers();
    }
  }, [subjectCategoryId]);

  return { teachers, loading, error };
};
