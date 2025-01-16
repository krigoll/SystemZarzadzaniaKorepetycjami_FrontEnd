import { useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../futures/store';
import { useRefreshAccessToken } from './useRefreshAccessToken';
import { updateToken } from '../futures/login/loginSlice';

export const AcceptLesson = () => {
    const jwtToken = useSelector((state: RootState) => state.login.jwtToken);
    const refreshAccessToken = useRefreshAccessToken();
    const dispatch = useDispatch();

    return useCallback(
        async (lessonId: number) => {
            try {
                let token = jwtToken;
                let response = await fetch(
                    `http://localhost:5230/api/lesson/${lessonId}/accept`,
                    {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                if (!response.ok && response.status === 401) {
                    const newToken = await refreshAccessToken();
                    if (newToken) {
                        token = newToken;
                        dispatch(updateToken(token));
                        response = await fetch(
                            `http://localhost:5230/api/lesson/${lessonId}/accept`,
                            {
                                method: 'PUT',
                                headers: {
                                    'Content-Type': 'application/json',
                                    Authorization: `Bearer ${token}`,
                                },
                            }
                        );
                    } else {
                        throw new Error('Failed to refresh token');
                    }
                }

                return response;
            } catch (error) {
                console.error('Error accepting lesson:', error);
                throw error;
            }
        },
        [jwtToken, refreshAccessToken, dispatch]
    );
};

export const RejectLesson = () => {
    const jwtToken = useSelector((state: RootState) => state.login.jwtToken);
    const refreshAccessToken = useRefreshAccessToken();
    const dispatch = useDispatch();

    return useCallback(
        async (lessonId: number) => {
            try {
                let token = jwtToken;
                let response = await fetch(
                    `http://localhost:5230/api/lesson/${lessonId}/reject`,
                    {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                if (!response.ok && response.status === 401) {
                    const newToken = await refreshAccessToken();
                    if (newToken) {
                        token = newToken;
                        dispatch(updateToken(token));
                        response = await fetch(
                            `http://localhost:5230/api/lesson/${lessonId}/reject`,
                            {
                                method: 'PUT',
                                headers: {
                                    'Content-Type': 'application/json',
                                    Authorization: `Bearer ${token}`,
                                },
                            }
                        );
                    } else {
                        throw new Error('Failed to refresh token');
                    }
                }

                return response;
            } catch (error) {
                console.error('Error rejecting lesson:', error);
                throw error;
            }
        },
        [jwtToken, refreshAccessToken, dispatch]
    );
};

export const CancelLesson = () => {
    const jwtToken = useSelector((state: RootState) => state.login.jwtToken);
    const refreshAccessToken = useRefreshAccessToken();
    const dispatch = useDispatch();

    return useCallback(
        async (lessonId: number | null) => {
            try {
                let token = jwtToken;
                let response = await fetch(
                    `http://localhost:5230/api/lesson/${lessonId}/cancel`,
                    {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                if (!response.ok && response.status === 401) {
                    const newToken = await refreshAccessToken();
                    if (newToken) {
                        token = newToken;
                        dispatch(updateToken(token));
                        response = await fetch(
                            `http://localhost:5230/api/lesson/${lessonId}/cancel`,
                            {
                                method: 'PUT',
                                headers: {
                                    'Content-Type': 'application/json',
                                    Authorization: `Bearer ${token}`,
                                },
                            }
                        );
                    } else {
                        throw new Error('Failed to refresh token');
                    }
                }

                return response;
            } catch (error) {
                console.error('Error rejecting lesson:', error);
                throw error;
            }
        },
        [jwtToken, refreshAccessToken, dispatch]
    );
};
