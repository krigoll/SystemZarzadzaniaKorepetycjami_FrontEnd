import AppButton from '../components/AppButtom';
import { AppEmailInput, AppPasswordInput } from '../components/AppInput';
import { useState } from 'react';
import { goToRegistration, goToMainPage } from '../lib/Navigate';
import './App.css';
import { useNavigate } from 'react-router-dom';
import { handleLogin } from '../lib/Login';
import { useDispatch } from 'react-redux';
import { setUser } from '../futures/login/loginSlice';

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
    alert(personData.token);
  };

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
