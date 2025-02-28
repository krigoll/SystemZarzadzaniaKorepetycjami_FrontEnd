import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateToken } from '../futures/login/loginSlice';
import { useRefreshAccessToken } from './useRefreshAccessToken';
import { RootState } from '../futures/store';

interface Student {
    idStudent: number;
    fullName: string;
}

export const useTeachetStudents = (
    itTeacher: number,
    numericTestId: number | null
) => {
    const [students, setStudents] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const token = useSelector((state: RootState) => state.login.jwtToken);
    const dispatch = useDispatch();
    const refreshAccessToken = useRefreshAccessToken();

    useEffect(() => {
        const fetchTest = async (token: string) => {
            try {
                const response = await fetch(
                    `http://localhost:5230/api/student/${itTeacher}?idTest=${numericTestId}`,
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
                            return fetchTest(newToken);
                        } else {
                            throw new Error('Failed to refresh token');
                        }
                    }
                    if (response.status === 403) {
                        throw new Error('Nie admin');
                    }
                    throw new Error('Failed to fetch tests' + ' ' + response.status);
                }

                let studentData: Student[] = await response.json();
                setStudents(studentData);
            } catch (error) {
                console.error('Error fetching users:', error);
                setError(error instanceof Error ? error.message : 'Unknown error');
            } finally {
                setLoading(false);
            }
        };

        if (token) {
            fetchTest(token);
        } else {
            setLoading(false);
        }
    }, [token]);

    return { students, loading, error };
};
