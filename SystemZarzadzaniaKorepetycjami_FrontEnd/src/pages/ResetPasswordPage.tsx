import AppButton from '../components/AppButton';
import {
  AppEmailInput,
  AppPasswordInput,
  AppRepeatPasswordInput,
  AppTextInput,
} from '../components/AppInput';
import { useState } from 'react';
import { goToMainPage } from '../lib/Navigate';
import { useNavigate } from 'react-router-dom';
import useResetPasswordCode from '../lib/useResetPasswordCode';
import useResetPassword from '../lib/useResetPassword';

const ResetPasswordPage: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [code, setCode] = useState<string>('');
  const [isCodeSend, setIsCodeSend] = useState<boolean>(true);
  const navigate = useNavigate();

  const { createResetCode, isLoading, error } = useResetPasswordCode();

  const {
    resetPassword,
    isLoading: isResetLoading,
    error: resetError,
  } = useResetPassword();

  const handleSendCode = async () => {
    const isValidEmail = (email: string) => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(email);
    };

    if (!isValidEmail(email)) {
      alert('Podaj poprawny adres email!');
      return;
    }

    await createResetCode(email);

    setIsCodeSend(true);
    alert('Kod resetu został wysłany na Twój email.');
  };

  const handleResetPassword = async () => {
    const isValidPassword = (password: string) => {
      return (
        password.length >= 8 &&
        password.length <= 50 &&
        /[a-z]/.test(password) &&
        /[A-Z]/.test(password) &&
        /[0-9]/.test(password)
      );
    };

    if (!isValidPassword(password)) {
      alert(
        'Hasło musi zawierać małe i duże litery, cyfry i mieć długość od 8 do 50 znaków.'
      );
      return false;
    }

    if (password !== confirmPassword) {
      alert('Hasła nie są zgodne!');
      return;
    }

    await resetPassword(code, password);

    if (!isResetLoading && !resetError) {
      alert('Hasło zostało zresetowane.');
      goToMainPage(navigate);
    } else if (resetError) {
      alert(`Błąd: ${resetError}`);
    }
  };

  return (
    <div className="App">
      <div className="login-container">
        <div className="register-link">
          <span>Reset hasła:</span>
          <AppEmailInput
            inputValue={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <AppButton
            label={isLoading ? 'Wysyłanie...' : 'Wyślij kod'}
            onClick={handleSendCode}
            disabled={isLoading}
          />
          {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>

        {isCodeSend && (
          <div className="login-box">
            <h1>Podaj nowe hasło</h1>

            <AppPasswordInput
              inputValue={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <AppRepeatPasswordInput
              inputValue={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <AppTextInput
              placecholder={'Kod'}
              inputValue={code}
              onChange={(e) => setCode(e.target.value)}
            />
            <div className="login-actions">
              <AppButton label="Dalej" onClick={handleResetPassword} />
            </div>
          </div>
        )}
        <AppButton label="Powrót" onClick={() => goToMainPage(navigate)} />
      </div>
    </div>
  );
};

export default ResetPasswordPage;
