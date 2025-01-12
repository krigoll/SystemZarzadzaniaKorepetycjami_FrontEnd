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
  wasGiven: boolean;
}

const GiveTestToStudentPage: React.FC = () => {
  const navigate = useNavigate();

  const { idTest } = useParams<{ idTest: string }>();
  const numericTestId = idTest ? parseInt(idTest) : null;
  const uId = useSelector((state: RootState) => state.login.idPerson);
  const { students, loading, error } = useTeachetStudents(uId, numericTestId);
  const { giveTest, loading: loadingGive, error: giveError } = useGiveTest();

  const handleGiveTest = async (idStudent: number, fullName: string) => {
    await giveTest(numericTestId, idStudent);

    if (!giveError) {
      alert(`Zadano test uczniowi: ${fullName}`);
      goToTestsDetailsPage(navigate, numericTestId);
    }
  };

  if (loading) {
    return <p>Ładowanie testów...</p>;
  }

  if (error) {
    return <p>Błąd: {error}</p>;
  }

  return (
    <div className="assign-test-page">
      <div className="assign-test-box">
        <h1>Zadaj test uczniowi</h1>

        {students ? (
          <>
            <div className="assign-test-list">
              <p>
                <strong>Uczniowie:</strong>
              </p>
              {students.length === 0 ? (
                <p>Brak</p>
              ) : (
                students.map((student: Student) => (
                  <div key={student.idStudent} className="test-item">
                    <p>
                      <strong>Imię i nazwisko:</strong> {student.fullName}
                    </p>
                    <p>
                      <strong>Czy kiedyś zadano mu/jej ten test:</strong>{' '}
                      {student.wasGiven ? 'Tak' : 'Nie'}
                    </p>
                    <div className="test-actions">
                      <AppButton
                        label="Zadaj"
                        onClick={() =>
                          handleGiveTest(student.idStudent, student.fullName)
                        }
                        disabled={loadingGive}
                      />
                    </div>
                  </div>
                ))
              )}
            </div>
            <div className="button-container">
              <AppButton
                label="Powrót"
                onClick={() => goToTestsDetailsPage(navigate, numericTestId)}
              />
            </div>
          </>
        ) : (
          <p>Ładowanie danych testu...</p>
        )}
      </div>
    </div>
  );
};

export default GiveTestToStudentPage;
