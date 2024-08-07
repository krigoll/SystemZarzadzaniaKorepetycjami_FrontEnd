import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import AppButton from '../components/AppButton';
import { goToProfile } from '../lib/Navigate';
import { editpersonDetails } from '../lib/API';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../futures/store';
import { updateEmail, updateStudent, updateTeacher } from '../futures/login/loginSlice';
import Cookies from 'js-cookie';

const EditProfilePage: React.FC = () => {
    const location = useLocation();
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
        image: dataToEdit.selectedFile
    });
    const dispatch = useDispatch();
    const jwtToken = useSelector((state: RootState) => state.login.jwtToken);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        setProfile({
            ...profile,
            [name]: type === 'checkbox' ? checked : value
        });
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
            alert('Nieprawid³owy email.');
            return false;
        }

        if (!profile.firstName || !profile.lastName) {
            alert('Imiê i nazwisko nie mog¹ byæ puste.');
            return false;
        }

        if (!isValidPhoneNumber(profile.phoneNumber)) {
            alert('Nieprawid³owy numer telefonu.');
            return false;
        }

        if (!profile.isStudent && !profile.isTeacher && !profile.isAdmin) {
            alert('Musisz byæ nauczycielem lub uczniem');
            return false;
        }

        // let jpegFile: string | null = null;
        // if (selectedFile != null) {
        //     if (!isImageFile(selectedFile)) {
        //         alert('Wybrany plik musi byæ obrazkiem');
        //         return;
        //     }
        //     //jpegFile = encodeFileToBase64(selectedFile);
        // }
        try {
            const response = await editpersonDetails({
                idPerson: profile.idPerson,
                name: profile.firstName,
                surname: profile.lastName,
                email: profile.email,
                phoneNumber: profile.phoneNumber,
                image: profile.image,
                isStudent: profile.isStudent,
                isTeacher: profile.isTeacher,
            }, jwtToken);
            if (!response.ok) {
                if (response.status === 409) {
                    alert('Podany email ju¿ istnieje');
                    return false;
                } else {
                    alert('B³¹d bazy danych'); //dodaæ przejcie do dstony kod 500
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
