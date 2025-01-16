import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateToken } from '../futures/login/loginSlice';
import { useRefreshAccessToken } from './useRefreshAccessToken';
import { RootState } from '../futures/store';

export const useCalendar = (email: string, date: string | undefined) => {
    const [calendar, setCalendar] = useState<any>(null);
    const refreshAccessToken = useRefreshAccessToken();
    const dispatch = useDispatch();
    const jwtToken = useSelector((state: RootState) => state.login.jwtToken);

    useEffect(() => {
        const fetchData = async () => {
            try {
                let token = jwtToken;
                let response = await fetch(
                    `http://localhost:5230/api/calendar?date=${date}&email=${email}`,
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
                                `http://localhost:5230/api/calendar?date=${date}&email=${email}`,
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
                setCalendar(data);
            } catch (error) {
                console.error('Error fetching user details:', error);
            }
        };

        if (email && jwtToken && date) {
            fetchData();
        }
    }, [email, date]);

    return calendar;
};
