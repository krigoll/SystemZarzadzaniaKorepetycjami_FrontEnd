import React from 'react';
import AppButton from '../components/AppButton';
import Menu from './Menu';

const StudentOptionsPage: React.FC = () => {
    return (
        <div className="options-container">
            <Menu/>
            <AppButton label="Um�w si� na korepetycje" onClick={() => console.log('Um�w si� na korepetycje')} />
            <AppButton label="Wystaw opini�" onClick={() => console.log('Wystaw opini�')} />
            <AppButton label="Moje testy" onClick={() => console.log('Moje testy')} />
        </div>
    );
};

export default StudentOptionsPage;
