import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../futures/store';
import { updateToken } from '../futures/login/loginSlice';
import { useRefreshAccessToken } from './useRefreshAccessToken';

export const useGetTeacherReviews = (teacherId: number) => {
    const [reviews, setReviews] = useState<any[] | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const dispatch = useDispatch();
    const jwtToken = useSelector((state: RootState) => state.login.jwtToken);
    const refreshAccessToken = useRefreshAccessToken();

    const fetchReviews = async () => {
        setLoading(true);
        setError(null);
        let token = jwtToken;

        try {
            let response = await fetch(
                `http://localhost:5230/api/opinion/getOpinionsByTeacherId?teacherId=${teacherId}`,
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
                        response = await fetch(
                            `http://localhost:5230/api/opinion/getOpinionsByTeacherId?teacherId=${teacherId}`,
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
                    throw new Error(`Failed to fetch reviews, status: ${response.status}`);
                }
            }

            const data = await response.json();
            setReviews(data);
        } catch (error) {
            setError(
                error instanceof Error ? error.message : 'Unknown error occurred'
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (teacherId && jwtToken) {
            fetchReviews();
        }
    }, [teacherId, jwtToken]);

    return { reviews, loading, error };
};
