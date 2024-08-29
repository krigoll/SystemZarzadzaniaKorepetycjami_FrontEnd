import React from 'react';
import AppButton from '../components/AppButton';
import Menu from './Menu';
import { useNavigate } from 'react-router-dom';
import { goToDeterminingAvailabilty, goToRequestsPage } from '../lib/Navigate';

const TeacherOptionsPage: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="options-container">
            <Menu />
            <AppButton label="Zgłoszenia" onClick={() => goToRequestsPage(navigate)} />
            <AppButton
                label="Określenie dostepności"
                onClick={() => goToDeterminingAvailabilty(navigate)}
            />
            <AppButton label="Opinie" onClick={() => console.log('Opinie')} />
            <AppButton label="Testy" onClick={() => console.log('Testy')} />
        </div>
    );
};

export default TeacherOptionsPage;
