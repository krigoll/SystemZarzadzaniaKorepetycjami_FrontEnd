import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../futures/store';
import { updateToken } from '../futures/login/loginSlice';
import { useHandleLogOut } from './LogOut';

export const useRefreshAccessToken = () => {
  const dispatch = useDispatch();
  const refreshToken = useSelector(
    (state: RootState) => state.login.refreshToken
  );
  const handleLogOut = useHandleLogOut();

  const refreshAccessToken = async (): Promise<string | null> => {
    try {
      if (!refreshToken) {
        handleLogOut();
        throw new Error('No refresh token available');
      }

      const response = await fetch('http://localhost:5230/api/login/refresh', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(refreshToken),
      });
      if (!response.ok) {
        handleLogOut();
        throw new Error('Failed to refresh token');
      }

      const data = await response.json();
      const newAccessToken = data.token;
      dispatch(updateToken(newAccessToken));

      return newAccessToken;
    } catch (error) {
      handleLogOut();
      console.error('Unable to refresh token:', error);
      return null;
    }
  };

  return refreshAccessToken;
};
