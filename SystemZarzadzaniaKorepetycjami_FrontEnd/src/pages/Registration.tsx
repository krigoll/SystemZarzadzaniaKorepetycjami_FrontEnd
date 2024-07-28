import React, { useState } from 'react';
import './App.css';
import { goToAddSubject, goToLogin, goToMainPage } from '../lib/Navigate';
import { useNavigate } from 'react-router-dom';
import AppButton from '../components/AppButtom';
import {
  AppCheckboxInput,
  AppDateInput,
  AppEmailInput,
  AppPasswordInput,
  AppRepeatPasswordInput,
  AppTextInput,
} from '../components/AppInput';
import { RegisterToApp } from '../lib/API';
import { handleLogin } from '../lib/Login';

const RegisterPage: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [firstName, setFirstName] = useState<string>('');
  const [lastName, setLastName] = useState<string>('');
  const [birthDate, setBirthDate] = useState<string>('');
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [isStudent, setIsStudent] = useState<boolean>(false);
  const [isTeacher, setIsTeacher] = useState<boolean>(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const navigate = useNavigate();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setSelectedFile(event.target.files[0]);
    }
  };

  const validationAndSending = async () => {
    const isValidEmail = (email: string) => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(email);
    };

    const isValidPassword = (password: string) => {
      return (
        password.length >= 8 &&
        password.length <= 50 &&
        /[a-z]/.test(password) &&
        /[A-Z]/.test(password) &&
        /[0-9]/.test(password)
      );
    };

    const isValidPhoneNumber = (phoneNumber: string) => {
      return (
        phoneNumber.length >= 8 &&
        phoneNumber.length <= 50 &&
        /^\d+$/.test(phoneNumber)
      );
    };

    if (!isValidEmail(email)) {
      alert('Nieprawidłowy email.');
      return false;
    }

    if (!isValidPassword(password)) {
      alert(
        'Hasło musi zawierać małe i duże litery, cyfry i mieć długość od 8 do 50 znaków.'
      );
      return false;
    }

    if (password !== confirmPassword) {
      alert('Hasła nie są takie same.');
      return false;
    }

    if (!firstName || !lastName) {
      alert('Imię i nazwisko nie mogą być puste.');
      return false;
    }

    if (
      !birthDate ||
      isNaN(new Date(birthDate).getTime()) ||
      new Date(birthDate) > new Date()
    ) {
      alert('Nieprawidłowa data urodzenia.');
      return false;
    }

    if (!isValidPhoneNumber(phoneNumber)) {
      alert('Nieprawidłowy numer telefonu.');
      return false;
    }

    if (!isStudent && !isTeacher) {
      alert('Musisz być nauczycielem lub uczniem');
      return false;
    }

    try {
      const response = await RegisterToApp({
        email,
        password,
        firstName,
        lastName,
        birthDate,
        phoneNumber,
        isStudent,
        isTeacher,
        selectedFile,
      });
      if (!response.ok) {
        if (response.status === 409) {
          alert('Podany email już istnieje');
          return false;
        } else {
          alert('Błąd bazy danych'); //dodać przejcie do dstony kod 500
          return false;
        }
      }
      return true;
    } catch (error) {
      console.error('Login failed', error);
      alert('Login failed');
    }
  };

  const handleRegistration = async () => {
    const isOk = await validationAndSending();
    if (isOk) {
      await handleLogin({ email, password });
      if (!isTeacher) goToLogin(navigate);
      goToAddSubject(navigate);
    }
  };

  return (
    <div className="register-container">
      <div className="register-box">
        <h1>Rejestracja</h1>
        <div className="file-input-container">
          <label htmlFor="file-input" className="file-input-label">
            {selectedFile ? selectedFile.name : 'Kliknij, aby dodać zdjęcie'}
          </label>
          <input
            type="file"
            id="file-input"
            className="file-input"
            onChange={handleFileChange}
          />
        </div>
        <AppEmailInput
          inputValue={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <AppPasswordInput
          inputValue={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <AppRepeatPasswordInput
          inputValue={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        <AppTextInput
          placecholder="Imię"
          inputValue={firstName}
          onChange={(e) => setFirstName(e.target.value)}
        />
        <AppTextInput
          placecholder="Nazwisko"
          inputValue={lastName}
          onChange={(e) => setLastName(e.target.value)}
        />
        <AppDateInput
          placecholder="Data urodzenia"
          inputValue={birthDate}
          onChange={(e) => setBirthDate(e.target.value)}
        />
        <AppTextInput
          placecholder="Numer telefonu"
          inputValue={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
        />
        <div className="checkbox-container">
          <label>
            <AppCheckboxInput
              checked={isStudent}
              onChange={(e) => setIsStudent(e.target.checked)}
            />
            Uczeń
          </label>
          <label>
            <AppCheckboxInput
              checked={isTeacher}
              onChange={(e) => setIsTeacher(e.target.checked)}
            />
            Nauczyciel
          </label>
        </div>
        <div className="button-container">
          <AppButton label="Powrót" onClick={() => goToMainPage(navigate)} />
          <AppButton label="Akceptuj" onClick={handleRegistration} />
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
