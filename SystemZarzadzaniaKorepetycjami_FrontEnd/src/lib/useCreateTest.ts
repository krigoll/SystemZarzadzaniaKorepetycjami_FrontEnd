import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../futures/store';
import { updateToken } from '../futures/login/loginSlice';
import { useRefreshAccessToken } from './useRefreshAccessToken';

export const useCreateTest = () => {
    const [responseStatus, setResponseStatus] = useState<number | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const dispatch = useDispatch();
    const jwtToken = useSelector((state: RootState) => state.login.jwtToken);
    const refreshAccessToken = useRefreshAccessToken();

    const createTest = async (teacherId: number, title: string) => {
        setLoading(true);
        setError(null);
        let token = jwtToken;
        try {
            let response = await fetch(
                `http://localhost:5230/api/test?idTeacher=${teacherId}&title=${title}`,
                {
                    method: 'PUT',
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
                            `http://localhost:5230/api/test?idTeacher=${teacherId}&title=${title}`,
                            {
                                method: 'PUT',
                                headers: {
                                    'Content-Type': 'application/json',
                                    Authorization: `Bearer ${token}`,
                                },
                            }
                        );
                        setResponseStatus(retryResponse.status);
                    } else {
                        throw new Error('Failed to refresh token');
                    }
                } else {
                    throw new Error(`Failed to create test, status: ${response.status}`);
                }
            } else {
                setResponseStatus(response.status);
            }
        } catch (error) {
            setError(
                error instanceof Error ? error.message : 'Unknown error occurred'
            );
        } finally {
            setLoading(false);
        }
    };

    return { createTest, responseStatus, loading, error };
};
