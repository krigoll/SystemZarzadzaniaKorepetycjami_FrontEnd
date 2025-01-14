import React from 'react';
import AppButton from '../components/AppButton';
import { useNavigate } from 'react-router-dom';
import {
  goToMenu,
  goToTestForStudentDetailsTeacherPage,
} from '../lib/Navigate';
import { useSelector } from 'react-redux';
import { RootState } from '../futures/store';
import { useGetTestsTeacher } from '../lib/useGetTestsTeacher';

interface Test {
  idTest: number;
  title: string;
  status: string;
  numberOfAssignments: number;
  fullname: string;
  creationTime: string;
  idTestForStudent: number;
}

const TestListTeacherPage: React.FC = () => {
  const navigate = useNavigate();
  const uId = useSelector((state: RootState) => state.login.idPerson);
  const { tests, loading, error } = useGetTestsTeacher(uId);

  if (loading) {
    return <p>Loading tests...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <div className="teacher-test-list-page">
      <div className="teacher-test-list-box">
        <h1>Lista Testów</h1>

        <div className="teacher-test-list">
          {tests.length === 0 ? (
            <p>Brak Testów</p>
          ) : (
            tests.map((test: Test) => (
              <div key={test.idTestForStudent} className="test-item">
                <div className="test-item-text">
                  <p>
                    <strong>Tytuł:</strong> {test.title}
                  </p>
                  <p>
                    <strong>Ilość zadań:</strong> {test.numberOfAssignments}
                  </p>
                  <p>
                    <strong>Wystawiono studentowi:</strong> {test.fullname}
                  </p>
                  <p>
                    <strong>Data:</strong> {test.creationTime}
                  </p>
                  <p>
                    <strong>Status:</strong> {test.status}&nbsp;
                  </p>
                </div>
                <div className="test-item-actions">
                  {test.status != 'Wyslany' && (
                    <AppButton
                      label={
                        test.status == 'Rozwiazany'
                          ? 'Sprawdż'
                          : 'Sprawdż ponownie'
                      }
                      onClick={() =>
                        goToTestForStudentDetailsTeacherPage(
                          navigate,
                          test.idTestForStudent
                        )
                      }
                    />
                  )}
                </div>
              </div>
            ))
          )}
        </div>
        <div className="button-container">
          <AppButton label="Powrót" onClick={() => goToMenu(navigate)} />
        </div>
      </div>
    </div>
  );
};

export default TestListTeacherPage;
