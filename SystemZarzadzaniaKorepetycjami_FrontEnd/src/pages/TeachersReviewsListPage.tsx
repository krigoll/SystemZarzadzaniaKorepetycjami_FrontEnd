import React from 'react';
import { useNavigate } from 'react-router-dom';
import AppButton from '../components/AppButton';
import { useTeachers } from '../lib/useTeachers';
import { useSelector } from 'react-redux';
import { RootState } from '../futures/store';
import { goToAddReviewPage } from '../lib/Navigate';

interface Teacher {
  id: number;
  name: string;
  price: number;
  image: File | null;
}

const TeachersListPage: React.FC = () => {
  const navigate = useNavigate();
  const email = useSelector((state: RootState) => state.login.email);

  const teachers = useTeachers(email);

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
      <div className="teachers-list-page">
          <div className="teachers-list-box">
              <h1>Lista Nauczycieli</h1>
              <div className="teachers-list">
                  {teachers ? (
                      teachers.teachers.length > 0 ? (
                          teachers.teachers.map((teacher: Teacher) => (
                              <div key={teacher.id} className="teacher-item">
                                  <span>{teacher.name}</span>
                                  <div className="teacher-photo">
                                      {teacher.image ? (
                                          <img
                                              src={URL.createObjectURL(teacher.image)}
                                              alt={`${teacher.name}`}
                                          />
                                      ) : null}
                                  </div>
                                  <AppButton
                                      label="Szczegóły"
                                      onClick={() =>
                                          goToAddReviewPage(navigate, `${teacher.id} ${teacher.name}`)
                                      }
                                  />
                              </div>
                          ))
                      ) : (
                          <p className="no-teachers">Brak nauczycieli!</p>
                      )
                  ) : (
                      <p className="loading-teachers">Ładowanie nauczycieli...</p>
                  )}
              </div>
              <div className="button-container">
                  <AppButton label="Powrót" onClick={handleGoBack} />
              </div>
          </div>
      </div>

  );
};

export default TeachersListPage;
