import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { goToGiveTestToStudentPage, goToTestsPage } from '../lib/Navigate';
import { useCreateAssignment } from '../lib/useCreateAssignment';
import { useTestDetails } from '../lib/useTestDetails';
import { useDeleteAssignment } from '../lib/useDeleteAssignment';
import { useDeleteTest } from '../lib/useDeleteTest';

interface Assignment {
  idAssignment: number;
  content: string;
  answer: string;
}

const TestDetailsPage: React.FC = () => {
  const navigate = useNavigate();
  const [createAssignmento, setCreateAssignment] = useState<boolean>(false);
  const [deleteTesto, setDeleteTest] = useState<boolean>(false);
  const [content, setContent] = useState<string>(' ');
  const [answer, setAnswer] = useState<string>(' ');

  const { idTest } = useParams<{ idTest: string }>();
  const numericTestId = idTest ? parseInt(idTest) : null;
  const { testData, refetch } = useTestDetails(numericTestId!);

  const {
    createAssignment,
    loading: creating,
    error: createError,
  } = useCreateAssignment(numericTestId);

  const {
    deleteAssignment,
    loading: deleting,
    error: deleteError,
  } = useDeleteAssignment();

  const {
    deleteTest,
    loading: deletingTest,
    error: deleteErrorTest,
  } = useDeleteTest();

  const handleCreateAssignment = async () => {
    if (content.length < 3 || content.length > 500) {
      alert('Tytuł nie tak');
      return;
    }

    if (answer && answer.length > 50) {
      alert('odpowiez nie tak');
      return;
    }

    const assignment: Assignment = {
      idAssignment: 0,
      content: content,
      answer: answer,
    };

    await createAssignment(assignment);

    if (!createError) {
      alert('Zadanie zostało stworzone');
      setContent(' ');
      setAnswer(' ');
      setCreateAssignment(false);
      refetch();
    } else {
      alert('Błąd podczas tworzenia zadania.');
    }
  };

  const handleDeleteAssignment = async (idAssignment: number) => {
    const status = await deleteAssignment(numericTestId, idAssignment);

    if (status == 200) {
      alert('Zadanie zostało usunięte!');
      refetch();
    }
  };

  const handleDeleteTest = async () => {
    const status = await deleteTest(numericTestId);

    if (status == 200) {
      alert('Test został usunięty!');
      goToTestsPage(navigate);
    }
  };

  return (
    <div className="test-details-page">
      <div className="test-details-box">
        <h1>Szczegóły testu</h1>

        {testData ? (
          <>
            <p>
              <strong>Tytuł:</strong> {testData.title}
            </p>
            <div className="test-details-buttons">
              <button
                className="test-details-button"
                onClick={() => setDeleteTest((prev) => !prev)}
              >
                Usuń test
              </button>
              <button
                className="test-details-button"
                onClick={() => setCreateAssignment((prev) => !prev)}
                disabled={deleting}
              >
                Dodaj nowe zadanie
              </button>
              {!(testData.assignments.length === 0) && (
                <button
                  className="test-details-button"
                  onClick={() =>
                    goToGiveTestToStudentPage(navigate, numericTestId)
                  }
                >
                  Zadaj test uczniowi
                </button>
              )}
              <button
                className="test-details-button"
                onClick={() => goToTestsPage(navigate)}
              >
                Powrót
              </button>
            </div>

            {deleteError && (
              <p style={{ color: 'red' }}>
                Błąd podczas usuwania: {deleteError}
              </p>
            )}
            {deleteTesto && (
              <div className="test-form-field">
                <p>Czy na pewno chcesz usunąć ten test?</p>
                <button
                  className="test-details-button"
                  onClick={handleDeleteTest}
                  disabled={deletingTest}
                >
                  Tak
                </button>
              </div>
            )}
            {deleteErrorTest && (
              <p style={{ color: 'red' }}>
                Błąd podczas usuwania testu: {deleteErrorTest}
              </p>
            )}

            {createAssignmento && (
              <div className="test-form-field">
                <label htmlFor="text">Treść zadania:</label>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                />
                <label htmlFor="text">Poprawna odpowiedź (opcjonalnie):</label>
                <textarea
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                />
                <button
                  className="test-details-button"
                  onClick={handleCreateAssignment}
                  disabled={creating}
                >
                  {creating ? 'Tworzenie...' : 'Utwórz'}
                </button>
              </div>
            )}

            <div className="test-assignments-list">
              <p>
                <strong>Zadania:</strong>
              </p>
              {testData.assignments.length === 0 ? (
                <p>Brak</p>
              ) : (
                testData.assignments.map((assignment: Assignment) => (
                  <div
                    key={assignment.idAssignment}
                    className="test-assignment-item"
                  >
                    <p>
                      <strong>Treść:</strong> {assignment.content}
                    </p>
                    <p>
                      <strong>Odpowiedź (opcjonalnie):</strong>{' '}
                      {assignment.answer.trim().length > 0
                        ? assignment.answer
                        : 'Brak'}
                    </p>
                    <div className="test-assignment-actions">
                      <button
                        onClick={() =>
                          handleDeleteAssignment(assignment.idAssignment)
                        }
                      >
                        Usuń
                      </button>
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
    </div>
  );
};

export default TestDetailsPage;
