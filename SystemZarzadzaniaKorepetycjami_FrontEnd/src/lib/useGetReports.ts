import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateToken } from '../futures/login/loginSlice';
import { useRefreshAccessToken } from './useRefreshAccessToken';
import { RootState } from '../futures/store';
import { base64ToFile } from './ConvertImage';

interface Report {
    idReport: number;
    title: string;
    isDealt: boolean;
}

export const useGetReports = () => {
    const [reports, setReports] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const token = useSelector((state: RootState) => state.login.jwtToken);
    const dispatch = useDispatch();
    const refreshAccessToken = useRefreshAccessToken();

    useEffect(() => {
        const fetchReports = async (token: string) => {
            try {
                const response = await fetch('http://localhost:5230/api/report/', {
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

                let reportData: Report[] = await response.json();
                setReports(reportData);
            } catch (error) {
                console.error('Error fetching reports:', error);
                setError(error instanceof Error ? error.message : 'Unknown error');
            } finally {
                setLoading(false);
            }
        };

        if (token) {
            fetchReports(token);
        } else {
            setLoading(false);
        }
    }, [token]);

    return { reports, loading, error };
};
