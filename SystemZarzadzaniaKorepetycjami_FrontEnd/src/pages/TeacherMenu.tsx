import React from 'react';
import AppButton from '../components/AppButton';
import Menu from './Menu';
import { useNavigate } from 'react-router-dom';
import { goToDeterminingAvailabilty } from '../lib/Navigate';

const TeacherOptionsPage: React.FC = () => {
    const navigate = useNavigate();
    return (
        <div className="options-container">
            <Menu/>
            <AppButton label="Zgłoszenia" onClick={() => console.log('Zgłoszenia')} />
            <AppButton label="Określenie dostępności" onClick={() => goToDeterminingAvailabilty(navigate)} />
            <AppButton label="Opinie" onClick={() => console.log('Opinie')} />
            <AppButton label="Testy" onClick={() => console.log('Testy')} />
        </div>
    );
};

export default TeacherOptionsPage;