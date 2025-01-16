import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../futures/store';
import { updateToken } from '../futures/login/loginSlice';
import { useRefreshAccessToken } from './useRefreshAccessToken';

export const useDeleteBan = () => {
    const [responseStatus, setResponseStatus] = useState<number | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const dispatch = useDispatch();
    const jwtToken = useSelector((state: RootState) => state.login.jwtToken);
    const refreshAccessToken = useRefreshAccessToken();

    const deleteBan = async (idBan: number) => {
        setLoading(true);
        setError(null);
        let token = jwtToken;
        try {
            let response = await fetch(
                `http://localhost:5230/api/ban/${idBan}/delete`,
                {
                    method: 'DELETE',
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
                            `http://localhost:5230/api/ban/${idBan}/delete`,
                            {
                                method: 'DELETE',
                                headers: {
                                    'Content-Type': 'application/json',
                                    Authorization: `Bearer ${token}`,
                                },
                            }
                        );

                        if (retryResponse.ok) {
                            setResponseStatus(retryResponse.status);
                            return 0;
                        } else {
                            const retryResponseData = await retryResponse.json();
                            throw new Error(
                                retryResponseData.message ||
                                `Failed to ban, status: ${retryResponse.status}`
                            );
                        }
                    } else {
                        throw new Error('Failed to refresh token');
                    }
                } else {
                    const responseData = await response.json();
                    throw new Error(
                        responseData.message || `Failed to ban, status: ${response.status}`
                    );
                }
                return 1;
            } else {
                setResponseStatus(response.status);
                return 0;
            }
        } catch (error) {
            setError(
                error instanceof Error ? error.message : 'Unknown error occurred'
            );
        } finally {
            setLoading(false);
        }
    };

    return { deleteBan, responseStatus, loading, error };
};
