import React, { useState } from 'react';
import './App.css';
import { goToMainPage } from '../lib/Navigate';
import { useNavigate } from 'react-router-dom';
import AppButton from '../components/AppButtom';

const RegisterPage: React.FC = () => {
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [confirmPassword, setConfirmPassword] = useState<string>('');
    const [firstName, setFirstName] = useState<string>('');
    const [lastName, setLastName] = useState<string>('');
    const [birthDate, setBirthDate] = useState<string>('');
    const [phoneNumber, setPhoneNumber] = useState<string>('');
    const [subjects, setSubjects] = useState<string>('');
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
                        {selectedFile ? selectedFile.name : 'Kliknij, aby dodaæ zdjêcie'}
                    </label>
                    <input
                        type="file"
                        id="file-input"
                        className="file-input"
                        onChange={handleFileChange}
                    />
                </div>
                <input
                    type="email"
                    placeholder="Adres email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <input
                    type="password"
                    placeholder="Has³o"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <input
                    type="password"
                    placeholder="Powtórz has³o"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="Imiê"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="Nazwisko"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                />
                <input
                    type="date"
                    placeholder="Data urodzenia"
                    value={birthDate}
                    onChange={(e) => setBirthDate(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="Numer telefonu"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="Przedmioty"
                    value={subjects}
                    onChange={(e) => setSubjects(e.target.value)}
                />
                <div className="checkbox-container">
                    <label>
                        <input
                            type="checkbox"
                            checked={isStudent}
                            onChange={(e) => setIsStudent(e.target.checked)}
                        />
                        Uczeñ
                    </label>
                    <label>
                        <input
                            type="checkbox"
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