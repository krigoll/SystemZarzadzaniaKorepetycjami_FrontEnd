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

    const generatePersonProfliHTML = async () => {
        try {
            const personData = await getPersonDetails(emailOld);
            setEmail(personData.Email);
            setFirstName(personData.FirstName);
            setLastName(personData.LastName);
            setBirthDate(personData.BithDate);
            setPhoneNumber(personData.PhoneNumber);
            setIsStudent(personData.IsStudent);
            setIsTeacher(personData.IsTeacher);
            setIsAdmin(personData.IsAdmin);
            setSelectedFile(personData.Image);
            setJoiningDate(personData.JoiningDate);
            setIdPerson(personData.IdPerson);
        } catch (error) {
            console.error('B³¹d generowania listy u¿ytkowników:', error);
        }
    };

    useEffect(() => {
        generatePersonProfliHTML();
    }, []);

    const handleGoToEdit = () => {
        const dataToEdit : DataToEdit = {
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
        }
        goToEditProfile(navigate, dataToEdit);
    }

    return (
        <div className="profile-container">
            <button className="delete-account" onClick={() => navigate('/delete-account')}>Usuñ konto</button>
            <div className="profile-header">Profil</div>
            <div className="profile-picture"></div>
            <div className="profile-details">
                <p>{firstName} {lastName}</p>
                <p>{birthDate}</p>
                <p>{email}</p>
                <p>{phoneNumber}</p>
                <p>{joiningDate}</p>
            </div>
            <div className="role">Uczeñ, Nauczyciel</div>
            <div className="button-container">
                <AppButton label="Powrót" onClick={() => goToMenu(navigate)} />
                <AppButton label="Edytuj" onClick={() => handleGoToEdit} />
            </div>
        </div>
    );
};

export default ProfilePage;
