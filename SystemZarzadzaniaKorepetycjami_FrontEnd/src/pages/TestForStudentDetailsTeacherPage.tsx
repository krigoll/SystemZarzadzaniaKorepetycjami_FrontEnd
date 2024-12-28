import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import AppButton from '../components/AppButton';
import { useGetTestForStudentDetails } from '../lib/useGetTestForStudentDetails';
import { goToTestStudentPage } from '../lib/Navigate';
import { useCreateOrUpdateMark } from '../lib/useCreateOrUpdateMark';

const TestForStudentDetailsTeacherPage: React.FC = () => {
  const { idTestForStudent } = useParams<{ idTestForStudent: string }>();
  const navigate = useNavigate();
  const [marks, setMarks] = useState<
    Record<number, { description: string; value: boolean }>
  >({});

  const { testDetails, loading, error, refetch } = useGetTestForStudentDetails(
    Number(idTestForStudent)
  );

  const {
    createOrUpdateMarks,
    loading: submittingMarks,
    error: markError,
  } = useCreateOrUpdateMark();

  const handleMarkChange = (
    idAssignment: number,
    description: string,
    value: boolean
  ) => {
    setMarks((prev) => ({
      ...prev,
      [idAssignment]: { description, value },
    }));
  };

  const handleSubmit = async () => {
    const updatedMarks = Object.entries(marks).map(
      ([idAssignment, markData]) => ({
        idMark: 0,
        description: markData.description,
        value: markData.value,
        idStudentAnswer: Number(idAssignment),
      })
    );

    try {
      const marksSuccess = await createOrUpdateMarks(updatedMarks);

      if (marksSuccess) {
        alert('Oceny zapisane!');
        refetch();
      } else {
        alert(markError || 'Błąd podczas zapisywania odpowiedzi i ocen.');
      }
    } catch (error) {
      console.error('Error during submission:', error);
      alert('Błąd podczas zapisywania ocen.');
    }
  };

  if (loading) return <p>Loading test details...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!testDetails) return <p>Nie znaleziono szczegółów testu.</p>;

  return (
    <div className="test-details-page">
      <h1>Szczegóły Testu</h1>
      <AppButton label="Powrót" onClick={() => goToTestStudentPage(navigate)} />

      <div className="test-info">
        <h2>Tytuł testu: {testDetails.title}</h2>
        <h3>Zadania:</h3>
        {testDetails.assignment.length === 0 ? (
          <p>Brak zadań.</p>
        ) : (
          <div className="assignment-list">
            {testDetails.assignment.map((assignment) => (
              <div key={assignment.idAssignment} className="assignment-item">
                <p>Treść zadania: {assignment.content}</p>
                <p>
                  Poprawna odpowiedź:{' '}
                  {assignment.answerAssignment
                    ? assignment.answerAssignment
                    : 'Brak'}
                </p>
                <div className="answer-field">
                  <label>Odpowiedź ucznia:</label>
                  <p>{assignment.studentAnswer}</p>
                </div>

                {assignment.studentAnswer && (
                  <div className="mark-field">
                    <label>Ocena:</label>
                    <input
                      type="text"
                      placeholder="Wpisz opis oceny"
                      value={marks[assignment.idAssignment]?.description || ''}
                      onChange={(e) =>
                        handleMarkChange(
                          assignment.idAssignment,
                          e.target.value,
                          marks[assignment.idAssignment]?.value || false
                        )
                      }
                    />
                    <label>Wartość oceny:</label>
                    <select
                      value={String(
                        marks[assignment.idAssignment]?.value || false
                      )} // Convert boolean to string
                      onChange={(e) =>
                        handleMarkChange(
                          assignment.idAssignment,
                          marks[assignment.idAssignment]?.description || '',
                          e.target.value === 'true' // Convert string to boolean
                        )
                      }
                    >
                      <option value="false">Niepoprawna</option>
                      <option value="true">Poprawna</option>
                    </select>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <button onClick={handleSubmit} disabled={submittingMarks}>
        {submittingMarks ? 'Trwa zapisywanie...' : 'Zapisz oceny'}
      </button>
    </div>
  );
};

export default TestForStudentDetailsTeacherPage;
