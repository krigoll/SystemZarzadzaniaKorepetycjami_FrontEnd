import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../futures/store';
import { useRefreshAccessToken } from './useRefreshAccessToken';

interface Availability {
    idDayOfTheWeek: number;
    startTime: string;
    endTime: string;
}

export const useTeacherAvailabilityById = (id: number) => {
    const [availability, setAvailability] = useState<Availability[] | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const token = useSelector((state: RootState) => state.login.jwtToken);
    const refreshAccessToken = useRefreshAccessToken();

    const fetchAvailability = async (id: number, token: string) => {
        try {
            const response = await fetch(
                `http://localhost:5230/api/availability/byId?teacherId=${id}`,
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
                        return fetchAvailability(id, newToken);
                    }
                } else if (response.status === 400) {
                    setError('Invalid Request: Bad Teacher ID');
                } else if (response.status === 500) {
                    setError('Server Error: Database Issue');
                } else {
                    setError('Unexpected Error');
                }
                setLoading(false);
                return;
            }

            const data = await response.json();
            setAvailability(data);
        } catch (error) {
            setError('Error fetching availability');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (id && token) {
            fetchAvailability(id, token);
        }
    }, [id]);

    return { availability, loading, error };
};
