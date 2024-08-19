import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import AppButton from '../components/AppButton';
import { goToProfile } from '../lib/Navigate';
import { editpersonDetails } from '../lib/API';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../futures/store';
import {
  updateEmail,
  updateStudent,
  updateTeacher,
} from '../futures/login/loginSlice';
import Cookies from 'js-cookie';
import {
  convertImageToBase64,
  convertImageToJPEG,
  isImageFile,
  resizeImageTo400x400,
} from '../lib/ConvertImage';

const EditProfilePage: React.FC = () => {
  const location = useLocation();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const dataToEdit = location.state?.dataToEdit;
  const navigate = useNavigate();
  const [profile, setProfile] = useState({
    idPerson: dataToEdit.idPerson,
    firstName: dataToEdit.firstName,
    lastName: dataToEdit.lastName,
    email: dataToEdit.email,
    phoneNumber: dataToEdit.phoneNumber,
    isStudent: dataToEdit.isStudent,
    isTeacher: dataToEdit.isTeacher,
    isAdmin: dataToEdit.isAdmin,
    image: dataToEdit.selectedFile,
  });
  const dispatch = useDispatch();
  const jwtToken = useSelector((state: RootState) => state.login.jwtToken);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setProfile({
      ...profile,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setSelectedFile(event.target.files[0]);
    }
  };

  const handleSubmit = async () => {
    const isValidEmail = (email: string) => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(email);
    };

    const isValidPhoneNumber = (phoneNumber: string) => {
      return (
        phoneNumber.length >= 8 &&
        phoneNumber.length <= 50 &&
        /^\d+$/.test(phoneNumber)
      );
    };

    if (!isValidEmail(profile.email)) {
      alert('Nieprawidłowy email.');
      return false;
    }

    if (!profile.firstName || !profile.lastName) {
      alert('Imię i nazwisko nie mogą być puste.');
      return false;
    }

    if (!isValidPhoneNumber(profile.phoneNumber)) {
      alert('Nieprawidłowy numer telefonu.');
      return false;
    }

    if (!profile.isStudent && !profile.isTeacher && !profile.isAdmin) {
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
    } else if (profile.image != null) {
      jpegFile = await convertImageToBase64(profile.image);
    }
    try {
      const response = await editpersonDetails(
        {
          idPerson: profile.idPerson,
          name: profile.firstName,
          surname: profile.lastName,
          email: profile.email,
          phoneNumber: profile.phoneNumber,
          image: jpegFile,
          isStudent: profile.isStudent,
          isTeacher: profile.isTeacher,
        },
        jwtToken
      );
      if (!response.ok) {
        if (response.status === 409) {
          if (response.statusText === 'Not unique email')
            alert('Podany email już istnieje');
          else alert('Podany numer telefonu już istnieje');
          return false;
        } else {
          alert('Błąd bazy danych');
          return false;
        }
      }
      dispatch(updateEmail(profile.email));
      dispatch(updateStudent(profile.isStudent));
      dispatch(updateTeacher(profile.isTeacher));
      Cookies.set('email', profile.email, { expires: 1 });
      goToProfile(navigate);
    } catch (error) {
      console.error('Login failed', error);
      alert('Login failed');
    }
  };

  return (
    <div className="edit-profile-container">
      <div className="edit-profile-header">Edycja Profilu</div>
      <div className="profile-picture">
        {profile.image && (
          <img src={URL.createObjectURL(profile.image)} alt="Profile" />
        )}
      </div>
      <div className="file-input-container">
        <label htmlFor="file-input" className="file-input-label">
          {selectedFile ? selectedFile.name : 'Kliknij, aby zmienić zdjęcie'}
        </label>
        <input
          type="file"
          id="file-input"
          className="file-input"
          onChange={handleFileChange}
        />
      </div>
      <input
        type="text"
        name="firstName"
        placeholder="Imię"
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
            Uczeń
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
