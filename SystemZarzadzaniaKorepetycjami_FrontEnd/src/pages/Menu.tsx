import React from 'react';
import AppButton from '../components/AppButton';
import { useSelector } from 'react-redux';
import { RootState } from '../futures/store';
import { useNavigate } from 'react-router-dom';
import {
  goToProfile,
  goToStudentMenu,
  goToTeacherMenu,
  goToCalendarPage,
  goToChat,
  goToAdminMenuPage,
} from '../lib/Navigate';
import { useHandleLogOut } from '../lib/LogOut';

const App: React.FC = () => {
  const { isAdmin, isTeacher, isStudent } = useSelector(
    (state: RootState) => state.login
  );

  const navigate = useNavigate();
  const handleLogOut = useHandleLogOut();

  const getDay = (): string => {
    const currentDate = new Date();
    return currentDate.toISOString().split('T')[0];
  };

  return (
    <div className="App">
      <div className="sidebar">
        <AppButton label="Profil" onClick={() => goToProfile(navigate)} />
        <AppButton
          label="Kalendarz"
          onClick={() => goToCalendarPage(navigate, getDay())}
        />
        {isStudent && (
          <AppButton label="Uczeń" onClick={() => goToStudentMenu(navigate)} />
        )}
        {isTeacher && (
          <AppButton
            label="Nauczyciel"
            onClick={() => goToTeacherMenu(navigate)}
          />
        )}
        {isAdmin && (
          <AppButton
            label="Admin"
            onClick={() => goToAdminMenuPage(navigate)}
          />
        )}
        <AppButton label="Wiadomości" onClick={() => goToChat(navigate)} />
        <AppButton label="Wyloguj się" onClick={handleLogOut} />
      </div>
      {!isAdmin && (
        <div className="main-content">
          <a href="/report/new" className="help-link">
            Masz jakiś problem? Napisz do nas!
          </a>
        </div>
      )}
    </div>
  );
};

export default App;
