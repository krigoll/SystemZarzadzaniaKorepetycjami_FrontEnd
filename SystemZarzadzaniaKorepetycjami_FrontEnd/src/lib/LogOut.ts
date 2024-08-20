import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { deSetUser } from '../futures/login/loginSlice';
import { goToMainPage } from '../lib/Navigate';
import Cookies from 'js-cookie';

function useHandleLogOut() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogOut = () => {
    Cookies.remove('jwtToken');
    Cookies.remove('refreshToken');
    Cookies.remove('email');
    dispatch(deSetUser());
    goToMainPage(navigate);
  };

  return handleLogOut;
}

export { useHandleLogOut };