import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../futures/store';
import { goToDeleteAccountPage, goToEditProfile, goToMenu } from '../lib/Navigate';
import { DataToEdit } from '../types/DataToEdit';
import AppButton from '../components/AppButton';
import { base64ToFile } from '../lib/ConvertImage';
import { usePersonDetails } from '../lib/usePersonDetails';

const ProfilePage: React.FC = () => {
    const navigate = useNavigate();
    const email = useSelector((state: RootState) => state.login.email);

    const personData = usePersonDetails(email);

    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    useEffect(() => {
        if (personData) {
            if (personData.image) {
                const fileFromBase64 = base64ToFile(
                    personData.image,
                    'profileImage.jpg'
                );
                setSelectedFile(fileFromBase64);
            }
        }
    }, [personData]);

    const handleGoToEdit = () => {
        if (personData) {
            const dataToEdit: DataToEdit = {
                idPerson: personData.idPerson,
                firstName: personData.name,
                lastName: personData.surname,
                email: personData.email,
                phoneNumber: personData.phoneNumber,
                isStudent: personData.isStudent,
                isTeacher: personData.isTeacher,
                isAdmin: personData.isAdmin,
                selectedFile,
            };
            goToEditProfile(navigate, dataToEdit);
        }
    };

    return (
        <div className="profile-container">
            <button
                className="delete-account"
                onClick={() => goToDeleteAccountPage(navigate)}
            >
                Usuń konto
            </button>
            <div className="profile-box">
                <div className="profile-header">Twój Profil</div>
                {personData ? (
                    <>
                        <div className="profile-picture">
                            {selectedFile && (
                                <img src={URL.createObjectURL(selectedFile)} alt="Profile" />
                            )}
                        </div>
                        <div className="profile-details">
                            <p><strong>Imię i nazwisko:</strong> {personData.name} {personData.surname}</p>
                            <p><strong>Data urodzenia:</strong> {personData.birthDate}</p>
                            <p><strong>Email:</strong> {personData.email}</p>
                            <p><strong>Telefon:</strong> {personData.phoneNumber}</p>
                            <p><strong>Data dołączenia:</strong> {personData.joiningDate}</p>
                        </div>
                        <div className="role">
                            <p>Role:
                                {personData.isStudent && ' Uczeń'}
                                {personData.isTeacher && ' Nauczyciel'}
                                {personData.isAdmin && ' Admin'}
                            </p>
                        </div>
                        <div className="button-container">
                            <AppButton label="Powrót" onClick={() => goToMenu(navigate)} />
                            <AppButton label="Edytuj" onClick={handleGoToEdit} />
                        </div>
                    </>
                ) : (
                    <div>Ładowanie...</div>
                )}
            </div>
        </div>
    );
};

export default ProfilePage;
