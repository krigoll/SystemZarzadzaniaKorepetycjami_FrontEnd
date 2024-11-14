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

  const handleLeaveReview = (teacherId: number) => {
    console.log(`Leaving a review for teacher with id: ${teacherId}`);
  };

  const handleGoBack = () => {
    navigate(-1); // Goes back to the previous page
  };

  return (
    <div
      className="teachers-list-page"
      style={{ padding: '20px', textAlign: 'center' }}
    >
      <h1>Lista Nauczycieli</h1>

      <div className="teachers-list">
        {teachers ? (
          teachers.teachers.map((teacher: Teacher) => (
            <div
              key={teacher.id}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                margin: '10px 0',
                padding: '10px',
                border: '1px solid #ccc',
                borderRadius: '5px',
              }}
            >
              <span>{teacher.name}</span>
              <div className="teacher-photo">
                {teacher.image ? (
                  <img
                    src={URL.createObjectURL(teacher.image)}
                    alt={`${teacher.name}`}
                  />
                ) : (
                  '[Brak Zdjęcia]'
                )}
              </div>
              <AppButton
                      label="Wystaw opinię"
                      onClick={() => goToAddReviewPage(navigate, teacher.id + ' ' + teacher.name)}
              />
            </div>
          ))
        ) : (
          <p>Loading teachers...</p> // Loading message while data is being fetched
        )}
      </div>

      <div style={{ marginTop: '20px' }}>
        <AppButton label="Powrót" onClick={handleGoBack} />
      </div>
    </div>
  );
};

export default TeachersListPage;
