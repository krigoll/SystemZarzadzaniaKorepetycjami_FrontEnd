import AppButton from '../components/AppButtom';
import { AppEmailInput, AppPasswordInput } from '../components/AppInput';
import { useState } from 'react';
import { loginToApp } from '../lib/API';

const Login: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const handleLogin = async () => {
    try {
      const response = await loginToApp({ email, password });
      alert(response);
    } catch (error) {
      console.error('Login failed', error);
      alert('Login failed');
    }
  };

  return (
    <div className="App">
      <div className="login-container">
        <div className="header">
          <span>Nie masz konta? Zarejestruj się tutaj:</span>
          <button className="register-btn">Rejestracja</button>
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
          <AppButton label="Dalej" onClick={handleLogin} />
          <a href="/forgot-password" className="forgot-password">
            Zapomniałeś hasła? Kliknij tutaj.
          </a>
          <div className="buttons">
            <button className="action-btn">Powrót</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
