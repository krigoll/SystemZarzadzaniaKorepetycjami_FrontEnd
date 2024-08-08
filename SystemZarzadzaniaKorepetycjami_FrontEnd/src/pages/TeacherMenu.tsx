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
            <AppButton label="Zg³oszenia" onClick={() => console.log('Zg³oszenia')} />
            <AppButton label="Okreœlenie dostêpnoœci" onClick={() => goToDeterminingAvailabilty(navigate)} />
            <AppButton label="Opinie" onClick={() => console.log('Opinie')} />
            <AppButton label="Testy" onClick={() => console.log('Testy')} />
        </div>
    );
};

export default TeacherOptionsPage;