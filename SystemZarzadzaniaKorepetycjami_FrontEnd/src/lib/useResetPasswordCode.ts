import { useState } from 'react';

const useResetPasswordCode = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const createResetCode = async (email: string) => {
        setIsLoading(true);
        setError(null);
        setSuccess(false);

        try {
            const response = await fetch(
                `http://localhost:5230/api/resetPassword/create?email=${email}`,
                {
                    method: 'POST',
                }
            );

            if (response.ok) {
                setSuccess(true);
                return 0;
            } else if (response.status === 400) {
                setError('Konto o podanym adresie email nie istnieje.');
                return 1;
            } else if (response.status === 500) {
                setError('Błąd serwera. Spróbuj ponownie później.');
                return 1;
            } else {
                setError('Wystąpił nieoczekiwany błąd.');
                return 1;
            }
        } catch (err) {
            setError('Nie można połączyć się z serwerem.');
            return 1;
        } finally {
            setIsLoading(false);
        }
    };

    return { createResetCode, isLoading, error, success };
};

export default useResetPasswordCode;
