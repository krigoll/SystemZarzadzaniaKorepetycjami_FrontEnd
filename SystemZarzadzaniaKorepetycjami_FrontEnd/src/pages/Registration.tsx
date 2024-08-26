import React, { useEffect, useState } from 'react';
import './App.css';
import { goToAddSubject, goToMainPage, goToMenu } from '../lib/Navigate';
import { useNavigate } from 'react-router-dom';
import AppButton from '../components/AppButton';
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
import { useDispatch, useSelector } from 'react-redux';
import { setUser } from '../futures/login/loginSlice';
import Cookies from 'js-cookie';
import { RootState } from '../futures/store';
import {
  convertImageToBase64,
  convertImageToJPEG,
  isImageFile,
  resizeImageTo400x400,
} from '../lib/ConvertImage';
//import { encodeFileToBase64 } from '../lib/ConvertImage';

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
  const [isNotNewTeacher, setIsNotNewTeacher] = useState<boolean>(true);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { jwtToken } = useSelector((state: RootState) => state.login);

  useEffect(() => {
    if (jwtToken && isNotNewTeacher) {
      goToMenu(navigate); //TODO
    }
  }, [jwtToken, navigate]);

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

    let jpegFile: string | null = null;
    if (selectedFile != null) {
      if (!isImageFile(selectedFile)) {
        alert('Wybrany plik musi być obrazkiem');
        return;
      }
      let jpgFile = await convertImageToJPEG(selectedFile);
      jpgFile = await resizeImageTo400x400(jpgFile);
      jpegFile = await convertImageToBase64(jpgFile);
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
        jpegFile,
      });
      if (!response.ok) {
        if (response.status === 409) {
          if (response.statusText === 'Not unique email')
            alert('Podany email już istnieje');
          else alert('Podany numer telefonu już istnieje');
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
      if (isTeacher) setIsNotNewTeacher(false);
      const personData = await handleLogin({ email, password });
      dispatch(
        setUser({
          email: email,
          jwtToken: personData.token,
          refreshToken: personData.refreshToken,
        })
      );
      Cookies.set('jwtToken', personData.token, { expires: 7 });
      Cookies.set('refreshToken', personData.refreshToken, { expires: 7 });
      Cookies.set('email', email, { expires: 7 });
      if (!isTeacher) goToMenu(navigate);
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
