import React, { useState } from 'react';
import AppButton from '../components/AppButton';
import { useSelector } from 'react-redux';
import { RootState } from '../futures/store';
import { useNavigate } from 'react-router-dom';
import {
  goToProfile,
  //goToStudentMenu,
  //goToTeacherMenu,
  goToCalendarPage,
  goToChat,
  //goToAdminMenuPage,
  goToChooseSubjectPage,
  goToTeachersReviewsListPage,
  goToDeterminingAvailabilty,
  goToEditSubjectPage,
  goToRequestsPage,
  goToTeacherOpinionPage,
  goToReportListPage,
  goToSubjectListPage,
  goToUserListPage,
} from '../lib/Navigate';
import { useHandleLogOut } from '../lib/LogOut';

const App: React.FC = () => {
  const { isAdmin, isTeacher, isStudent } = useSelector(
    (state: RootState) => state.login
  );

  const navigate = useNavigate();
  const handleLogOut = useHandleLogOut();

  const [isStudentMenuVisible, setStudentMenuVisible] = useState(false); // Stan do zarządzania widocznością menu Uczeń
  const [isTeacherMenuVisible, setTeacherMenuVisible] = useState(false); // Stan do zarządzania widocznością menu Nauczyciel
  const [isAdminMenuVisible, setAdminMenuVisible] = useState(false); // Stan do zarządzania widocznością menu Admin
  const [isTeacherTestVisible, setTeacherTestVisible] = useState(false);

  const handleStudentMenuClick = () => {
    setStudentMenuVisible((prevState) => !prevState); // Zmieniamy widoczność menu Uczeń
  };

  const handleTeacherMenuClick = () => {
    setTeacherMenuVisible((prevState) => !prevState); // Zmieniamy widoczność menu Nauczyciel
  };

  const handleAdminMenuClick = () => {
    setAdminMenuVisible((prevState) => !prevState); // Zmieniamy widoczność menu Admin
  };

  const handleTeacherTestClick = () => {
    setTeacherTestVisible((prevState) => !prevState); // Zmieniamy widoczność menu Admin
  };

  const getDay = (): string => {
    const currentDate = new Date();
    return currentDate.toISOString().split('T')[0];
  };

  return (
    <div className="menu-container">
      <div className="menu-box">
        <h1>Menu</h1>
        <div className="menu-buttons">
          <AppButton label="Profil" onClick={() => goToProfile(navigate)} />
          <AppButton
            label="Kalendarz"
            onClick={() => goToCalendarPage(navigate, getDay())}
          />
          {isStudent && (
            <>
              <AppButton label="Uczeń" onClick={handleStudentMenuClick} />{' '}
              {/* Przycisk rozwijający menu */}
              {isStudentMenuVisible && (
                <div className="student-menu">
                  <AppButton
                    label="Umów się na korepetycje"
                    onClick={() => goToChooseSubjectPage(navigate)}
                  />
                  <AppButton
                    label="Wystaw opinię"
                    onClick={() => goToTeachersReviewsListPage(navigate)}
                  />
                  <AppButton
                    label="Moje testy"
                    onClick={() => console.log('Moje testy')}
                  />
                </div>
              )}
            </>
          )}
          {isTeacher && (
            <>
              <AppButton label="Nauczyciel" onClick={handleTeacherMenuClick} />{' '}
              {/* Przycisk rozwijający menu dla nauczyciela */}
              {isTeacherMenuVisible && (
                <div className="teacher-menu">
                  <AppButton
                    label="Zgłoszenia"
                    onClick={() => goToRequestsPage(navigate)}
                  />
                  <AppButton
                    label="Przedmioty"
                    onClick={() => goToEditSubjectPage(navigate)}
                  />
                  <AppButton
                    label="Określenie dostępności"
                    onClick={() => goToDeterminingAvailabilty(navigate)}
                  />
                  <AppButton
                    label="Opinie"
                    onClick={() => goToTeacherOpinionPage(navigate)}
                  />
                  <AppButton label="Testy" onClick={handleTeacherTestClick} />
                  {isTeacherTestVisible && (
                    <div>
                      <AppButton
                        label="Moje testy"
                        onClick={() => goToDeterminingAvailabilty(navigate)}
                      />
                      <AppButton
                        label="Wysłane testy"
                        onClick={() => goToTeacherOpinionPage(navigate)}
                      />
                    </div>
                  )}
                </div>
              )}
            </>
          )}
          {isAdmin && (
            <>
              <AppButton label="Admin" onClick={handleAdminMenuClick} />{' '}
              {/* Przycisk rozwijający menu dla administratora */}
              {isAdminMenuVisible && (
                <div className="admin-menu">
                  <AppButton
                    label="Lista użytkowników"
                    onClick={() => goToUserListPage(navigate)}
                  />
                  <AppButton
                    label="Zgłoszenia"
                    onClick={() => goToReportListPage(navigate)}
                  />
                  <AppButton
                    label="Przedmioty"
                    onClick={() => goToSubjectListPage(navigate)}
                  />
                </div>
              )}
            </>
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
    </div>
  );
};

export default App;
