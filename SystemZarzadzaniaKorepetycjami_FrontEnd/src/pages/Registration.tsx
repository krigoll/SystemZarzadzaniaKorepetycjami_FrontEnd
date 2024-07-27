import React, { useState } from 'react';
import './App.css';
import { goToMainPage } from '../lib/Navigate';
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

    const handleSubmit = () => {
        // Implement submission logic here
        alert('Form submitted');
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
                    <button onClick={handleSubmit}>Akceptuj</button>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;