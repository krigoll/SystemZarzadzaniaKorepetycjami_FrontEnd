import React from 'react';
import './App.css';
import AppButton from '../components/AppButton';
import { useSelector } from 'react-redux';
import { RootState } from '../futures/store';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { deSetUser } from '../futures/login/loginSlice';
import { goToMainPage, goToProfile, goToStudentMenu, goToTeacherMenu } from '../lib/Navigate';
import Cookies from 'js-cookie';

const App: React.FC = () => {
  const { isAdmin, isTeacher, isStudent } = useSelector(
    (state: RootState) => state.login
  );

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogOut = () =>{
    Cookies.remove('jwtToken');
    Cookies.remove('refreshToken');
    Cookies.remove('email');
    dispatch(deSetUser());
    goToMainPage(navigate)
  }

  return (
    <div className="App">
      <div className="sidebar">
        <AppButton label="Profil" onClick={() => goToProfile(navigate)} />
        <AppButton label="Kalendarz" onClick={() => console.log('Kalendarz')} />
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
          <AppButton label="Admin" onClick={() => console.log('Nauczyciel')} />
        )}
        <AppButton
          label="Wiadomości"
          onClick={() => console.log('Wiadomości')}
        />
        <AppButton
          label="Wyloguj się"
          onClick={handleLogOut}
        />
      </div>
      <div className="main-content">
        <button className="cancel-button">Anuluj zajęcia</button>
        <a href="/help" className="help-link">
          Masz jakiś problem? Napisz do nas!
        </a>
      </div>
    </div>
  );
};

export default App;
