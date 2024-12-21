import React, { useState } from 'react';
import AppButton from '../components/AppButton';
import { useNavigate, useParams } from 'react-router-dom';
import { goToTestsPage } from '../lib/Navigate';
import { useCreateAssignment } from '../lib/useCreateAssignment';
import { useTestDetails } from '../lib/useTestDetails';

interface Assignment {
  idAssignment: number;
  content: string;
  answer: string;
}

const TestDetailsPage: React.FC = () => {
  const navigate = useNavigate();
  const [createAssignmento, setCreateAssignment] = useState<boolean>(false);
  const [content, setContent] = useState<string>('');
  const [answer, setAnswer] = useState<string>('');

  const { idTest } = useParams<{ idTest: string }>();
  const numericTestId = idTest ? parseInt(idTest) : null;
  const { testData, refetch } = useTestDetails(numericTestId!);

  const {
    createAssignment,
    loading: creating,
    error: createError,
  } = useCreateAssignment(numericTestId);

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
      alert('Test został stworzony');
      refetch();
    } else {
      alert('Błąd podczas tworzenia testu.');
    }
  };

  const handleDeleteAssignment = (idAssignment: number) => {
    alert(`usuwamy ${idAssignment}`);
  };

  return (
    <div className="user-list-page">
      <h1>Szczeguły testu</h1>
      {testData ? (
        <>
          <p>Tytuł: {testData.title}</p>
          <AppButton label="Powrót" onClick={() => goToTestsPage(navigate)} />
          <AppButton
            label="Dodaj nowe zadanie"
            onClick={() => setCreateAssignment(!createAssignmento)}
          />
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
                      <p>Odpowiedz (opcjonalne): {assignment.answer}</p>
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
