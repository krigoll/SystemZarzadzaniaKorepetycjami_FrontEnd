import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getPersonDetails } from '../lib/API';
import { useSelector } from 'react-redux';
import { RootState } from '../futures/store';
import { goToEditProfile, goToMenu } from '../lib/Navigate';
import { DataToEdit } from '../types/DataToEdit';
import AppButton from '../components/AppButton';

const ProfilePage: React.FC = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState<string>('');
    const [firstName, setFirstName] = useState<string>('');
    const [lastName, setLastName] = useState<string>('');
    const [birthDate, setBirthDate] = useState<string>('');
    const [phoneNumber, setPhoneNumber] = useState<string>('');
    const [isStudent, setIsStudent] = useState<boolean>(false);
    const [isTeacher, setIsTeacher] = useState<boolean>(false);
    const [isAdmin, setIsAdmin] = useState<boolean>(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [joiningDate, setJoiningDate] = useState<string>('');
    const [idPerson, setIdPerson] = useState<number>(0);

    const emailOld = useSelector((state: RootState) => state.login.email);

    const generatePersonProfliHTML = async (email: string) => {
        try {
            const personData = await getPersonDetails(email);
            setEmail(personData.email);
            setFirstName(personData.name);
            setLastName(personData.surname);
            setBirthDate(personData.birthDate);
            setPhoneNumber(personData.phoneNumber);
            setIsStudent(personData.isStudent);
            setIsTeacher(personData.isTeacher);
            setIsAdmin(personData.isAdmin);
            setSelectedFile(personData.image);
            setJoiningDate(personData.joiningDate);
            setIdPerson(personData.idPerson);
        } catch (error) {
            console.error('Error fetching user details:', error);
        }
    };

    useEffect(() => {
        if (emailOld) {
            generatePersonProfliHTML(emailOld);
        }
    }, [emailOld]);

    const handleGoToEdit = () => {
        const dataToEdit: DataToEdit = {
            idPerson,
            firstName,
            lastName,
            birthDate,
            email,
            phoneNumber,
            isStudent,
            isTeacher,
            isAdmin,
            selectedFile
        };
        goToEditProfile(navigate, dataToEdit);
    };

    return (
        <div className="profile-container">
            <button className="delete-account" onClick={() => navigate('/delete-account')}>Usuñ konto</button>
            <div className="profile-header">Profil</div>
            <div className="profile-picture">
                {selectedFile && <img src={URL.createObjectURL(selectedFile)} alt="Profile" />}
            </div>
            <div className="profile-details">
                <p>{firstName} {lastName}</p>
                <p>{birthDate}</p>
                <p>{email}</p>
                <p>{phoneNumber}</p>
                <p>{joiningDate}</p>
            </div>
            <div className="role">
                {isStudent && 'Uczeñ'}
                {isTeacher && 'Nauczyciel'}
                {isAdmin && 'Admin'}
            </div>
            <div className="button-container">
                <AppButton label="Powrót" onClick={() => goToMenu(navigate)} />
                <AppButton label="Edytuj" onClick={handleGoToEdit} />
            </div>
        </div>
    );
};

export default ProfilePage;
