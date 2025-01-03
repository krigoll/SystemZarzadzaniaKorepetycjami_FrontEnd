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
      } else if (response.status === 400) {
        setError('Nieprawidłowy adres e-mail.');
      } else if (response.status === 500) {
        setError('Błąd serwera. Spróbuj ponownie później.');
      } else {
        setError('Wystąpił nieoczekiwany błąd.');
      }
    } catch (err) {
      // Obsługa błędów związanych z fetch (np. brak połączenia)
      setError('Nie można połączyć się z serwerem.');
    } finally {
      setIsLoading(false);
    }
  };

  return { createResetCode, isLoading, error, success };
};

export default useResetPasswordCode;
