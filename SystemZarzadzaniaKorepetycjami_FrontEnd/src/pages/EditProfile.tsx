import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import AppButton from '../components/AppButton';
import { goToProfile } from '../lib/Navigate';

const EditProfilePage: React.FC = () => {
    const location = useLocation();
    const dataToEdit = location.state?.dataToEdit;
    const navigate = useNavigate();
    const [profile, setProfile] = useState({
        firstName: dataToEdit.firstName,
        lastName: dataToEdit.lastName,
        email: dataToEdit.email,
        phoneNumber: dataToEdit.phoneNumber,
        isStudent: dataToEdit.isStudent,
        isTeacher: dataToEdit.isTeacher
    });

    const [profilePicture, setProfilePicture] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        setProfile({
            ...profile,
            [name]: type === 'checkbox' ? checked : value
        });
    };

    const handlePictureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setProfilePicture(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = () => {
        console.log('Profile updated:', profile);
        if (profilePicture) {
            console.log('Profile picture:', profilePicture);
            // Dodaj logikê aktualizacji zdjêcia profilowego
        }
        // Dodaj logikê aktualizacji profilu
    };

    return (
        <div className="edit-profile-container">
            <div className="edit-profile-header">Edycja Profilu</div>
            <div className="profile-picture-container">
                {preview ? (
                    <img src={preview} alt="Profile Preview" className="profile-picture" />
                ) : (
                    <div className="profile-picture-placeholder">Zdjêcie</div>
                )}
                <input type="file" onChange={handlePictureChange} />
            </div>
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
            {!dataToEdit.isAdmin && (
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
            )}
            <div className="button-container">
                <AppButton label="Powrót" onClick={() => goToProfile(navigate)} />
                <button onClick={handleSubmit}>Akceptuj</button>
            </div>
        </div>
    );
};

export default EditProfilePage;
