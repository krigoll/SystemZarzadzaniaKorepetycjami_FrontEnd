import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../futures/store';
import { goToEditProfile, goToMenu } from '../lib/Navigate';
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
        onClick={() => navigate('/delete-account')}
      >
        Usuń konto
      </button>
      <div className="profile-header">Profil</div>
      {personData ? (
        <div>
          <div className="profile-picture">
            {selectedFile && (
              <img src={URL.createObjectURL(selectedFile)} alt="Profile" />
            )}
          </div>
          <div className="profile-details">
            <p>
              {personData.name} {personData.surname}
            </p>
            <p>{personData.birthDate}</p>
            <p>{personData.email}</p>
            <p>{personData.phoneNumber}</p>
            <p>{personData.joiningDate}</p>
          </div>
          <div className="role">
            Role:
            <p>{personData.isStudent && 'Uczeń'}</p>
            <p>{personData.isTeacher && 'Nauczyciel'}</p>
            <p>{personData.isAdmin && 'Admin'}</p>
          </div>
        </div>
      ) : (
        <div>Loading...</div>
      )}

      <div className="button-container">
        <AppButton label="Powrót" onClick={() => goToMenu(navigate)} />
        <AppButton label="Edytuj" onClick={handleGoToEdit} />
      </div>
    </div>
  );
};

export default ProfilePage;
