import { useEffect, useState } from 'react';
import { useRefreshAccessToken } from './useRefreshAccessToken';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../futures/store';
import { updateToken } from '../futures/login/loginSlice';
import { MessageDTO } from '../types/MessageDTO';

export const useGetMessages = (userId: number, corespondentId: number): MessageDTO[] | null => {
  const [messages, setMessages] = useState<any>(null);
  const refreshAccessToken = useRefreshAccessToken();
  const dispatch = useDispatch();
  const jwtToken = useSelector((state: RootState) => state.login.jwtToken);

  useEffect(() => {
    const fetchData = async () => {
      try {
        let token = jwtToken;
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
              token = newToken;
              dispatch(updateToken(token));
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
            throw new Error('Error fetching lesson details');
          }
        }

        const data = await response.json();
        setMessages(data);
      } catch (error) {
        console.error('Error feching lesson details:', error);
      }
    };

      if (userId && jwtToken) {
      fetchData();
      }
  }, [userId]);
  return messages;
};
