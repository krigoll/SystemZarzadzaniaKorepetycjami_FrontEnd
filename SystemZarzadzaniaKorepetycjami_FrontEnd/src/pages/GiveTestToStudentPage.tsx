import React from 'react';
import AppButton from '../components/AppButton';
import { useNavigate, useParams } from 'react-router-dom';
import { goToTestsDetailsPage } from '../lib/Navigate';
import { useTeachetStudents } from '../lib/useTeachetStudents';
import { useSelector } from 'react-redux';
import { RootState } from '../futures/store';
import { useGiveTest } from '../lib/useGiveTest';

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
  const { giveTest, loading: loadingGive, error: giveError } = useGiveTest();

  const handleGiveTest = async (idStudent: number) => {
    await giveTest(numericTestId, idStudent);

    if (!giveError) {
      alert(`Zadano test uczniowi`);
    }
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
                      disabled={loadingGive}
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
