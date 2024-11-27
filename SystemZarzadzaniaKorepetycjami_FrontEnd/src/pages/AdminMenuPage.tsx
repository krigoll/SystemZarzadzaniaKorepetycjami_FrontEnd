import React from 'react';
import AppButton from '../components/AppButton';
import Menu from './Menu';
import { useNavigate } from 'react-router-dom';
import {
    goToChooseSubjectPage,
    goToTeachersReviewsListPage,
} from '../lib/Navigate';

const AdminMenuPage: React.FC = () => {
    const navigate = useNavigate();
    return (
        <div className="options-container">
            <Menu />
            <AppButton
                label="Lista u¿ytkowników"
                onClick={() => goToChooseSubjectPage(navigate)}
            />
            <AppButton
                label="Zg³oszenia"
                onClick={() => goToTeachersReviewsListPage(navigate)}
            />
            <AppButton label="Przedmioty"
                onClick={() => console.log('Moje testy')}
            />
        </div>
    );
};

export default AdminMenuPage;