import React from 'react';
import './App.css';
import AppButton from '../components/AppButton';
import { useSelector } from 'react-redux';
import { RootState } from '../futures/store';

const App: React.FC = () => {
    const { isAdmin, isTeacher, isStudent } = useSelector((state: RootState) => state.login);

    return (
        <div className="App">
            <div className="sidebar">
                <AppButton label="Profil" onClick={() => console.log('Profil')} />
                <AppButton label="Kalendarz" onClick={() => console.log('Kalendarz')} />
                {isStudent && <AppButton label="Ucze�" onClick={() => console.log('Ucze�')} />}
                {isTeacher && <AppButton label="Nauczyciel" onClick={() => console.log('Nauczyciel')} />}
                {isAdmin && <AppButton label="Admin" onClick={() => console.log('Nauczyciel')} />}
                <AppButton label="Wiadomo�ci" onClick={() => console.log('Wiadomo�ci')} />
                <AppButton label="Wyloguj si�" onClick={() => console.log('Wyloguj si�')} />
            </div>
            <div className="main-content">
                <button className="cancel-button">Anuluj zaj�cia</button>
                <a href="/help" className="help-link">Masz jaki� problem? Napisz do nas!</a>
            </div>
        </div>
    );
};

export default App;
