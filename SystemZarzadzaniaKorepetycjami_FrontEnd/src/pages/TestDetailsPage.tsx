import React, { useState } from 'react';
import AppButton from '../components/AppButton';
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
    <div className="user-list-page">
      <h1>Szczeguły testu</h1>
      {testData ? (
        <>
          <p>Tytuł: {testData.title}</p>
          <AppButton label="Powrót" onClick={() => goToTestsPage(navigate)} />
          <AppButton
            label="Usuń test"
            onClick={() => setDeleteTest(!deleteTesto)}
          />
          <AppButton
            label="Dodaj nowe zadanie"
            onClick={() => setCreateAssignment(!createAssignmento)}
            disabled={deleting}
          />
          {!(testData.assignments.length === 0) && (
            <AppButton
              label="Zadaj test uczniowi"
              onClick={() => goToGiveTestToStudentPage(navigate, numericTestId)}
            />
          )}
          {deleteError && <p>Błąd podczas usuwania {deleteError}</p>}
          {deleteTesto && (
            <div>
              Czy na pewcho chcesz usunąc ten test?
              <AppButton
                label="Tak"
                onClick={handleDeleteTest}
                disabled={deletingTest}
              />
            </div>
          )}
          {deleteErrorTest && <p>Błąd podczas usuwania {deleteErrorTest}</p>}
          {createAssignmento && (
            <div className="form-field">
              <label htmlFor="text">Treść zadania:</label>
              <input
                type="text"
                value={content}
                onChange={(e) => setContent(e.target.value)}
              />
              <label htmlFor="text">Poprawna odpowiedż (obcionalnie):</label>
              <input
                type="text"
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
              />
              <button onClick={handleCreateAssignment} disabled={creating}>
                {creating ? 'Tworzenie...' : 'Utwórz'}
              </button>
            </div>
          )}
          <div className="user-list">
            Zadania:
            {testData.assignments.length === 0 ? (
              <div className="no-users">Brak</div>
            ) : (
              testData.assignments.map((assignment: Assignment) => (
                <div key={assignment.idAssignment} className="user-item">
                  <div className="user-info">
                    <div className="user-name">
                      <p>Treść: {assignment.content}</p>
                      <p>
                        Odpowiedz (opcjonalne):{' '}
                        {assignment.answer.trim().length > 0
                          ? assignment.answer
                          : 'Brak'}
                      </p>
                    </div>
                  </div>
                  <div className="user-actions">
                    <AppButton
                      label="Usuń"
                      onClick={() =>
                        handleDeleteAssignment(assignment.idAssignment)
                      }
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

export default TestDetailsPage;
