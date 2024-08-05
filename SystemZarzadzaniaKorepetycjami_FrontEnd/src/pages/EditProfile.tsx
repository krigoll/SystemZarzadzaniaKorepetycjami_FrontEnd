// EditProfilePage.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';

const EditProfilePage: React.FC = () => {
    const location = useLocation();
    const jsonData = location.state?.dataToEdit;
    const navigate = useNavigate();
    const [profile, setProfile] = useState({
        firstName: '',
        lastName: '',
        birthDate: '',
        email: '',
        phoneNumber: '',
        isStudent: false,
        isTeacher: false
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        setProfile({
            ...profile,
            [name]: type === 'checkbox' ? checked : value
        });
    };

    const handleSubjectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        //const selectedSubjects = Array.from(e.target.selectedOptions, option => option.value);
        setProfile({
            ...profile,
            //subjects: selectedSubjects
        });
    };

    const handleSubmit = () => {
        console.log('Profile updated:', profile);
        // Dodaj logikê aktualizacji profilu
    };

    return (
        <div className="edit-profile-container">
            <div className="edit-profile-header">Edycja Profilu</div>
            <div className="profile-picture"></div>
            <input
                type="text"
                name="firstName"
                placeholder="Imiê"
                value={profile.firstName}
                onChange={handleInputChange}
            />
            <input
                type="text"
                name="lastName"
                placeholder="Nazwisko"
                value={profile.lastName}
                onChange={handleInputChange}
            />
            <input
                type="date"
                name="birthDate"
                placeholder="Data urodzenia"
                value={profile.birthDate}
                onChange={handleInputChange}
            />
            <input
                type="email"
                name="email"
                placeholder="Adres email"
                value={profile.email}
                onChange={handleInputChange}
            />
            <input
                type="tel"
                name="phoneNumber"
                placeholder="Numer telefonu"
                value={profile.phoneNumber}
                onChange={handleInputChange}
            />
            <select
                name="subjects"
                multiple
                value={profile.subjects}
                onChange={handleSubjectChange}
            >
                <option value="Math">Matematyka</option>
                <option value="English">Angielski</option>
                <option value="Science">Nauki œcis³e</option>
                {/* Dodaj wiêcej opcji przedmiotów */}
            </select>
            <div className="checkbox-container">
                <label>
                    <input
                        type="checkbox"
                        name="isStudent"
                        checked={profile.isStudent}
                        onChange={handleInputChange}
                    />
                    Uczeñ
                </label>
                <label>
                    <input
                        type="checkbox"
                        name="isTeacher"
                        checked={profile.isTeacher}
                        onChange={handleInputChange}
                    />
                    Nauczyciel
                </label>
            </div>
            <div className="button-container">
                <button onClick={() => navigate(-1)}>Powrót</button>
                <button onClick={handleSubmit}>Akceptuj</button>
            </div>
        </div>
    );
};

export default EditProfilePage;
