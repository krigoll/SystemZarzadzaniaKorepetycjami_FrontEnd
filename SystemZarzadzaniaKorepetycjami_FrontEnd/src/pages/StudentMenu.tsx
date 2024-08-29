import React from 'react';
import AppButton from '../components/AppButton';
import Menu from './Menu';
import { useNavigate } from 'react-router-dom';
import { goToChooseSubjectPage } from '../lib/Navigate';

const StudentOptionsPage: React.FC = () => {
    const navigate = useNavigate();
    return (
        <div className="options-container">
            <Menu />
            <AppButton
                label="Umów się na korepetycje"
                onClick={() => goToChooseSubjectPage(navigate)}
            />
            <AppButton
                label="Wystaw opinię"
                onClick={() => console.log('Wystaw opini�')}
            />
            <AppButton label="Moje testy" onClick={() => console.log('Moje testy')} />
        </div>
    );
};

export default StudentOptionsPage;
