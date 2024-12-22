import React from 'react';
import AppButton from '../components/AppButton';
import { useNavigate, useParams } from 'react-router-dom';
import { goToTestsDetailsPage } from '../lib/Navigate';
import { useTeachetStudents } from '../lib/useTeachetStudents';
import { useSelector } from 'react-redux';
import { RootState } from '../futures/store';

interface Student {
  idStudent: number;
  fullName: string;
}

const GiveTestToStudentPage: React.FC = () => {
  const navigate = useNavigate();

  const { idTest } = useParams<{ idTest: string }>();
  const numericTestId = idTest ? parseInt(idTest) : null;
  const uId = useSelector((state: RootState) => state.login.idPerson);
  const { students, loading, error } = useTeachetStudents(uId);

  const handleGiveTest = async (idStudent: number) => {
    alert(`Zadano ${idStudent} ${numericTestId}`);
  };

  if (loading) {
    return <p>Loading tests...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <div className="user-list-page">
      <h1>Zadaj test uczniowi</h1>
      {students ? (
        <>
          <AppButton
            label="Powrót"
            onClick={() => goToTestsDetailsPage(navigate, numericTestId)}
          />
          <div className="user-list">
            Uczniowie:
            {students.length === 0 ? (
              <div className="no-users">Brak</div>
            ) : (
              students.map((student: Student) => (
                <div key={student.idStudent} className="user-item">
                  <div className="user-info">
                    <div className="user-name">
                      <p>Imię i nazwisko: {student.fullName}</p>
                    </div>
                  </div>
                  <div className="user-actions">
                    <AppButton
                      label="Zadaj"
                      onClick={() => handleGiveTest(student.idStudent)}
                    />
                  </div>
                </div>
              ))
            )}
          </div>
        </>
      ) : (
        <p>Ładowanie danych testu...</p>
      )}
    </div>
  );
};

export default GiveTestToStudentPage;
