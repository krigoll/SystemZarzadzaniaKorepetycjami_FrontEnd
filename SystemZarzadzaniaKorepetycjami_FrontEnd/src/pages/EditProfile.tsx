import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import AppButton from '../components/AppButton';
import { goToProfile } from '../lib/Navigate';
import { useEditPersonDetails } from '../lib/useEditPersonDetails';
import { useDispatch } from 'react-redux';
import Cookies from 'js-cookie';
import {
  convertImageToBase64,
  convertImageToJPEG,
  isImageFile,
  resizeImageTo400x400,
} from '../lib/ConvertImage';
import {
  updateEmail,
  updateStudent,
  updateTeacher,
} from '../futures/login/loginSlice';

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
  const { editPersonDetails, loading, error, responseStatus } =
    useEditPersonDetails();

  useEffect(() => {
    if (responseStatus === 200) {
      dispatch(updateEmail(profile.email));
      dispatch(updateStudent(profile.isStudent));
      dispatch(updateTeacher(profile.isTeacher));
      Cookies.set('email', profile.email, { expires: 1 });
      goToProfile(navigate);
    } else if (error) {
      alert(`Error: ${error}`);
    }
  }, [responseStatus, error, profile, dispatch, navigate]);

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
        phoneNumber.length >= 7 &&
        phoneNumber.length <= 15 &&
        /^\d+$/.test(phoneNumber)
      );
    };

    if (!isValidEmail(profile.email)) {
      alert('Nieprawidłowy email.');
      return;
    }

    if (!profile.firstName || !profile.lastName) {
      alert('Imię i nazwisko nie mogą być puste.');
      return;
    }

    if (!isValidPhoneNumber(profile.phoneNumber)) {
      alert('Nieprawidłowy numer telefonu.');
      return;
    }

    if (!profile.isStudent && !profile.isTeacher && !profile.isAdmin) {
      alert('Musisz być nauczycielem lub uczniem');
      return;
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

    await editPersonDetails({
      idPerson: profile.idPerson,
      name: profile.firstName,
      surname: profile.lastName,
      email: profile.email,
      phoneNumber: profile.phoneNumber,
      image: jpegFile,
      isStudent: profile.isStudent,
      isTeacher: profile.isTeacher,
    });
  };

    return (
        <div className="edit-profile-container">
            <div className="profile-box">
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
                <label style={{ textAlign: 'left', display: 'block' }}>Imię:</label>
                <input
                    type="text"
                    name="firstName"
                    placeholder="Imię"
                    value={profile.firstName}
                    onChange={handleInputChange}
                />
                <label style={{ textAlign: 'left', display: 'block' }}>Nazwisko:</label>
                <input
                    type="text"
                    name="lastName"
                    placeholder="Nazwisko"
                    value={profile.lastName}
                    onChange={handleInputChange}
                />
                <label style={{ textAlign: 'left', display: 'block' }}>Adres email:</label>
                <input
                    type="email"
                    name="email"
                    placeholder="Adres email"
                    value={profile.email}
                    onChange={handleInputChange}
                />
                <label style={{ textAlign: 'left', display: 'block' }}>Numer telefonu:</label>
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
                    <button onClick={handleSubmit} disabled={loading}>
                        {loading ? 'Trwa aktualizacja...' : 'Akceptuj'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EditProfilePage;
