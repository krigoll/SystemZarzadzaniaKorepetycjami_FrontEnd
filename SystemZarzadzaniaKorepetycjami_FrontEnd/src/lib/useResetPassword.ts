import { useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../futures/store';

const useResetPassword = () => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const jwtToken = useSelector((state: RootState) => state.login.jwtToken);

    const resetPassword = async (
        code: string,
        password: string
    ): Promise<boolean> => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await fetch(
                `http://localhost:5230/api/resetPassword/reset?code=${code}&password=${password}`,
                {
                    method: 'PUT',
                }
            );

            if (response.ok) {
                return true;
            }

            const errorText = await response.text();
            setError(errorText || 'Nieznany błąd');
            return false;
        } catch (e) {
            setError('Wystąpił błąd serwera. Spróbuj ponownie później.');
            console.error(e);
            return false;
        } finally {
            setIsLoading(false);
        }
    };

    const resetPasswordWitOutCode = async (
        password: string
    ): Promise<boolean> => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await fetch(
                `http://localhost:5230/api/resetPassword/resetWitOutCode?password=${password}`,
                {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${jwtToken}`,
                    },
                }
            );

            if (response.ok) {
                return true;
            }

            const errorText = await response.text();
            setError(errorText || 'Nieznany błąd');
            return false;
        } catch (e) {
            setError('Wystąpił błąd serwera. Spróbuj ponownie później.');
            console.error(e);
            return false;
        } finally {
            setIsLoading(false);
        }
    };

    return { resetPasswordWitOutCode, resetPassword, isLoading, error };
};

export default useResetPassword;
