import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import AppButton from '../components/AppButton';
import { useGetTestForStudentDetails } from '../lib/useGetTestForStudentDetails';
import { goToTestTeacherPage } from '../lib/Navigate';
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
    loading: submitting,
    error: submitError,
  } = useCreateOrUpdateMark();

  const handleMarkChange = (
    idAssignment: number,
    field: 'description' | 'value',
    value: string | boolean
  ) => {
    setMarks((prev) => ({
      ...prev,
      [idAssignment]: {
        ...prev[idAssignment],
        [field]: value,
      },
    }));
  };

  const handleSubmit = async () => {
    if (!testDetails) {
      console.error('testDetails is null or undefined');
      alert('Nie można zapisać ocen, ponieważ szczegóły testu są niedostępne.');
      return;
    }

    const updatedMarks = Object.entries(marks)
      .filter(([, mark]) => mark.value !== undefined)
      .map(([idAssignment, mark]) => {
        const assignment = testDetails.assignment.find(
          (a) => a.idAssignment === Number(idAssignment)
        );

        if (!assignment || !assignment.idStudentAnswer) {
          console.error(
            `Nie znaleziono odpowiedniego idStudentAnswer dla idAssignment: ${idAssignment}`
          );
          return null;
        }

        return {
          idMark: 0,
          description: mark.description ? mark.description : null,
          value: mark.value,
          idStudentAnswer: assignment.idStudentAnswer,
        };
      })
      .filter((mark) => mark !== null);

    if (updatedMarks.length === 0) {
      alert('Nie wprowadzono żadnych ocen do zapisania.');
      return;
    }

    try {
      const success = await createOrUpdateMarks(updatedMarks);

      if (success) {
        alert('Oceny zapisane!');
        refetch();
      } else {
        alert(submitError || 'Błąd podczas zapisywania ocen.');
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
    <div className="teacher-test-details-page">
      <div className="teacher-test-details-box">
        <h1>Szczegóły Testu</h1>

        <div className="teacher-test-details-info">
          <h2>Tytuł testu: {testDetails.title}</h2>
          <h3>Zadania:</h3>
          {testDetails.assignment.length === 0 ? (
            <p>Brak zadań.</p>
          ) : (
            <div className="teacher-assignment-list">
              {testDetails.assignment.map((assignment) => (
                <div
                  key={assignment.idAssignment}
                  className="teacher-assignment-item"
                >
                  <p>
                    <strong>Treść zadania:</strong> {assignment.content}
                  </p>
                  <p>
                    <strong>Odpowiedź ucznia:</strong>{' '}
                    {assignment.studentAnswer
                      ? assignment.studentAnswer
                      : 'Brak odpowiedzi'}
                  </p>
                  <p>
                    <strong>Poprawna odpowiedź:</strong>{' '}
                    {assignment.answerAssignment &&
                    assignment.answerAssignment.trim().length > 0
                      ? assignment.answerAssignment
                      : 'Brak'}
                  </p>
                  {assignment.studentAnswer && (
                    <div className="teacher-mark-field">
                      <label>Ocena:</label>
                      <select
                        value={
                          marks[assignment.idAssignment]?.value?.toString() ??
                          (assignment.value !== undefined
                            ? assignment.value.toString()
                            : '')
                        }
                        onChange={(e) =>
                          handleMarkChange(
                            assignment.idAssignment,
                            'value',
                            e.target.value === 'true'
                          )
                        }
                      >
                        <option value="">Wybierz</option>
                        <option value="true">Poprawna</option>
                        <option value="false">Niepoprawna</option>
                      </select>
                      <label>Opis/komentarz oceny (obcionalnie):</label>
                      <input
                        type="text"
                        value={
                          marks[assignment.idAssignment]?.description ??
                          assignment.description ??
                          ''
                        }
                        onChange={(e) =>
                          handleMarkChange(
                            assignment.idAssignment,
                            'description',
                            e.target.value
                          )
                        }
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
        <button
          className="teacher-submit-button"
          onClick={handleSubmit}
          disabled={submitting}
        >
          {submitting ? 'Trwa zapisywanie...' : 'Zapisz oceny'}
        </button>
      </div>
      <div className="button-container">
        <AppButton
          label="Powrót"
          onClick={() => goToTestTeacherPage(navigate)}
        />
      </div>
    </div>
  );
};

export default TestForStudentDetailsTeacherPage;
