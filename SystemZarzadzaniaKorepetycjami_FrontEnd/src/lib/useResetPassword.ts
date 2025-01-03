import { useState } from 'react';

const useResetPassword = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

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

  return { resetPassword, isLoading, error };
};

export default useResetPassword;
