import React from 'react';
import AppButton from '../components/AppButton';
import Menu from './Menu';

const StudentOptionsPage: React.FC = () => {
    return (
        <div className="options-container">
            <Menu/>
            <AppButton label="Umów siê na korepetycje" onClick={() => console.log('Umów siê na korepetycje')} />
            <AppButton label="Wystaw opiniê" onClick={() => console.log('Wystaw opiniê')} />
            <AppButton label="Moje testy" onClick={() => console.log('Moje testy')} />
        </div>
    );
};

export default StudentOptionsPage;
