import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../futures/store';
import { updateToken } from '../futures/login/loginSlice';
import { useRefreshAccessToken } from './useRefreshAccessToken';
import { MessageDTO } from '../types/MessageDTO';

export const useGetMessages = () => {
    const [messages, setMessages] = useState<MessageDTO[] | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [errorM, setError] = useState<string | null>(null);
    const dispatch = useDispatch();
    const jwtToken = useSelector((state: RootState) => state.login.jwtToken);
    const refreshAccessToken = useRefreshAccessToken();

    const getMessages = async (userId: number, corespondentId: number) => {
        setLoading(true);
        setError(null);
        let token = jwtToken;
        try {
            let response = await fetch(
                `http://localhost:5230/api/message/getConversation?userId=${userId}&corespondentId=${corespondentId}`,
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
                            `http://localhost:5230/api/message/getConversation?userId=${userId}&corespondentId=${corespondentId}`,
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
                    throw new Error(
                        `Failed to fetch messages, status: ${response.status}`
                    );
                }
            }

            const data = await response.json();
            setMessages(data);
        } catch (errorM) {
            setError(
                errorM instanceof Error ? errorM.message : 'Unknown error occurred'
            );
        } finally {
            setLoading(false);
        }
    };

    return { getMessages, messages, loading, errorM };
};
