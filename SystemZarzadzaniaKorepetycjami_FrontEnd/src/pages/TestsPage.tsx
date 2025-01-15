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
    if (title.length <= 3 || title.length >= 50) {
      alert('Tytuł musi mieć od 3 do 50 znaków!');
      return false;
    }

    await createTest(uId, title);

    if (!createError) {
      alert('Test został stworzony!');
      refetch();
    } else {
      alert('Błąd podczas tworzenia testu!');
    }
  };

  if (loading) {
    return <p>Ładowanie testów...</p>;
  }

  if (error) {
    return <p>Błąd: {error}</p>;
  }

  return (
    <div className="test-management-page">
      <div className="test-management-box">
        <h1>Lista Testów</h1>

        <div className="button-container">
          <AppButton
            label="Dodaj nowy"
            onClick={() => setCreateTest((prev) => !prev)}
          />
        </div>

        {createTesto && (
          <div className="test-form-field">
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

        <div className="test-list">
          {tests.length === 0 ? (
            <p>Brak Testów</p>
          ) : (
            tests.map((test: Test) => (
              <div key={test.idTest} className="test-item">
                <div>
                  <p>
                    <strong>Nazwa:</strong> {test.title}
                  </p>
                  <p>
                    <strong>Ilość zadań:</strong> {test.numberOfAssignments}
                  </p>
                </div>
                <div className="test-actions">
                  <AppButton
                    label="Szczegóły"
                    onClick={() => goToTestsDetailsPage(navigate, test.idTest)}
                  />
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

export default TestsPage;
