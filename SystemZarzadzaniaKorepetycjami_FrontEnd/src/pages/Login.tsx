import AppButton from '../components/AppButtom';
import { AppEmailInput, AppPasswordInput } from '../components/AppInput';
import { useState } from 'react';
import { loginToApp} from '../lib/API';
import { goToRegistration, goToMainPage } from '../lib/Navigate';
import './App.css';
import { useNavigate } from 'react-router-dom';

const Login: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
        const response = await loginToApp({ email, password });
        if (!response.ok) {
            if (response.status === 401) {
                alert('Błędny login lub hasło');
                return;
            } else {
                alert('Bazy danych'); //dodać przejcie do dstony kod 500
                return;
            }
        }
      //alert("dziala"+response.json);
      const personaldata = response.json();
      return personaldata;
    } catch (error) {
      console.error('Login failed', error);
      alert('Login failed');
    }
  };

  const handleLogin2 = async () => {
    const personData = await handleLogin();
    alert(personData.token)
  }

  return (
    <div className="App">
      <div className="login-container">
        <div className="header">
          <span>Nie masz konta? Zarejestruj się tutaj:</span>
          <AppButton label="Rejestracja" onClick={() => goToRegistration(navigate)} />
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
