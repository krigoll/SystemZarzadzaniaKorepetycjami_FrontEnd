import React, { useState } from 'react';
import AppButton from '../components/AppButton';
import { useNavigate } from 'react-router-dom';
import { goToMenu, goToTestsDetailsPage } from '../lib/Navigate';
import { useSelector } from 'react-redux';
import { RootState } from '../futures/store';
import { useGetTests } from '../lib/useGetTests';
import { useCreateTest } from '../lib/useCreateTest';

interface Test {
  idTest: number;
  title: string;
  numberOfAssignments: number;
}

const TestsPage: React.FC = () => {
  const navigate = useNavigate();
  const uId = useSelector((state: RootState) => state.login.idPerson);
  const { tests, loading, error, refetch } = useGetTests(uId);
  const [createTesto, setCreateTest] = useState<boolean>(false);
  const [title, setTitle] = useState<string>('');

  const { createTest, loading: creating, error: createError } = useCreateTest();

  const handleCreateTest = async () => {
    if (title.length < 3 || title.length > 50) {
      alert('Tytuł nie tak');
      return false;
    }

    await createTest(uId, title);

    if (!createError) {
      alert('Test został stworzony');
      refetch();
    } else {
      alert('Błąd podczas tworzenia testu.');
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
      <h1>Lista Testów</h1>
      <div className="button-container">
        <AppButton label="Powrót" onClick={() => goToMenu(navigate)} />
        <AppButton
          label="Dodaj nowy"
          onClick={() => setCreateTest(!createTesto)}
        />
      </div>
      {createTesto && (
        <div className="form-field">
          <label htmlFor="text">Tytuł:</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <button onClick={handleCreateTest} disabled={creating}>
            {creating ? 'Tworzenie...' : 'Utwórz'}
          </button>
        </div>
      )}
      <div className="user-list">
        {tests.length === 0 ? (
          <div className="no-users">Brak Testów</div>
        ) : (
          tests.map((test: Test) => (
            <div key={test.idTest} className="user-item">
              <div className="user-info">
                <div className="user-name">
                  <p>Tytuł: {test.title}</p>
                  <p>Ilość zadań: {test.numberOfAssignments - 1}</p>
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

export default TestsPage;
