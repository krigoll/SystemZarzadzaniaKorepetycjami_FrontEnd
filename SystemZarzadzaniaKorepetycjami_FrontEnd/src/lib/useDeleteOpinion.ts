import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../futures/store';
import { updateToken } from '../futures/login/loginSlice';
import { useRefreshAccessToken } from './useRefreshAccessToken';

export const useDeleteOpinion = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const dispatch = useDispatch();
    const jwtToken = useSelector((state: RootState) => state.login.jwtToken);
    const refreshAccessToken = useRefreshAccessToken();

    const deleteOpinion = async (idOpinion: number) => {
        setLoading(true);
        setError(null);

        try {
            let token = jwtToken;
            let response = await fetch(
                `http://localhost:5230/api/opinion/${idOpinion}/delete`,
                {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (response.status === 401) {
                const newToken = await refreshAccessToken();
                if (newToken) {
                    token = newToken;
                    dispatch(updateToken(token));
                    response = await fetch(
                        `http://localhost:5230/api/opinion/${idOpinion}/delete`,
                        {
                            method: 'DELETE',
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

            setLoading(false);
            return response.status;
        } catch (err: any) {
            setLoading(false);
            setError('Failed to delete person');
            return null;
        }
    };

    return { deleteOpinion, loading, error };
};
