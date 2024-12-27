import React from 'react';
import AppButton from '../components/AppButton';
import { useNavigate } from 'react-router-dom';
import { goToMenu, goToTestsDetailsPage } from '../lib/Navigate';
import { useSelector } from 'react-redux';
import { RootState } from '../futures/store';
import { useGetTestsStudent } from '../lib/useGetTestsStudent';

interface Test {
  idTest: number;
  title: string;
  numberOfAssignments: number;
  fullname: string;
  creationTime: string;
}

const TestListStudentPage: React.FC = () => {
  const navigate = useNavigate();
  const uId = useSelector((state: RootState) => state.login.idPerson);
  const { tests, loading, error } = useGetTestsStudent(uId);

  if (loading) {
    return <p>Loading tests...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <div className="user-list-page">
      <h1>Lista Testów</h1>
      <div className="button-container">
        <AppButton label="Powrót" onClick={() => goToMenu(navigate)} />
      </div>
      <div className="user-list">
        {tests.length === 0 ? (
          <div className="no-users">Brak Testów</div>
        ) : (
          tests.map((test: Test) => (
            <div key={test.idTest} className="user-item">
              <div className="user-info">
                <div className="user-name">
                  <p>Tytuł: {test.title}</p>
                  <p>Ilość zadań: {test.numberOfAssignments}</p>
                  <p>Zadano przez: {test.fullname}</p>
                  <p>Data: {test.creationTime}</p>
                </div>
              </div>
              <div className="user-actions">
                <AppButton
                  label="Szczegóły"
                  onClick={() => goToTestsDetailsPage(navigate, test.idTest)}
                />
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default TestListStudentPage;
