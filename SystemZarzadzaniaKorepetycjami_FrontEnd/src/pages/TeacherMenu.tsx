import React from 'react';
import AppButton from '../components/AppButton';
import Menu from './Menu';
import { useNavigate } from 'react-router-dom';
import { goToDeterminingAvailabilty } from '../lib/Navigate';

const TeacherOptionsPage: React.FC = () => {
    const navigate = useNavigate();

    const getDay = (): string => {
        const currentDate = new Date();
        return currentDate.toISOString().split('T')[0];
    }

    return (
        <div className="options-container">
            <Menu/>
            <AppButton label="Zg�oszenia" onClick={() => console.log('Zg�oszenia')} />
            <AppButton label="Okre�lenie dost�pno�ci" onClick={() => goToDeterminingAvailabilty(navigate, getDay() )} />
            <AppButton label="Opinie" onClick={() => console.log('Opinie')} />
            <AppButton label="Testy" onClick={() => console.log('Testy')} />
        </div>
    );
};

export default TeacherOptionsPage;