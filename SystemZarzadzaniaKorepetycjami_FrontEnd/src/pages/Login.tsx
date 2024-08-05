import AppButton from '../components/AppButton';
import { AppEmailInput, AppPasswordInput } from '../components/AppInput';
import { useEffect, useState } from 'react';
import { goToRegistration, goToMainPage, goToMenu } from '../lib/Navigate';
import './App.css';
import { useNavigate } from 'react-router-dom';
import { handleLogin } from '../lib/Login';
import { useDispatch, useSelector } from 'react-redux';
import { setUser } from '../futures/login/loginSlice';
import Cookies from 'js-cookie';
import { RootState } from '../futures/store';

const Login: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogin2 = async () => {
    const personData = await handleLogin({ email, password });
    dispatch(
      setUser({
        email: email,
        jwtToken: personData.token,
        refreshToken: personData.refreshToken,
      })
    );
    Cookies.set('jwtToken', personData.token, { expires: 1 });
    Cookies.set('refreshToken', personData.refreshToken, { expires: 1 });
    Cookies.set('email', email, { expires: 1 });
    goToMenu(navigate);
  };

  const { jwtToken } = useSelector((state: RootState) => state.login);

  useEffect(() => {
    if (jwtToken) {
      goToMenu(navigate);
    }
  }, [jwtToken, navigate]);

  return (
    <div className="App">
      <div className="login-container">
        <div className="header">
          <span>Nie masz konta? Zarejestruj się tutaj:</span>
          <AppButton
            label="Rejestracja"
            onClick={() => goToRegistration(navigate)}
          />
        </div>
        <div className="login-box">
          <h1>Logowanie</h1>
          <AppEmailInput
            inputValue={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <AppPasswordInput
            inputValue={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <AppButton label="Dalej" onClick={handleLogin2} />
          <a href="/forgot-password" className="forgot-password">
            Zapomniałeś hasła? Kliknij tutaj.
          </a>
          <AppButton label="Powrót" onClick={() => goToMainPage(navigate)} />
        </div>
      </div>
    </div>
  );
};

export default Login;
