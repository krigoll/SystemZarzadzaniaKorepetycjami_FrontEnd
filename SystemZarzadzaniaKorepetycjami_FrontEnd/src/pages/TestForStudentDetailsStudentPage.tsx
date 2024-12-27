import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import AppButton from '../components/AppButton';
import { useGetTestForStudentDetails } from '../lib/useGetTestForStudentDetails';
import { useSelector } from 'react-redux';
import { RootState } from '../futures/store';
import { goToMenu } from '../lib/Navigate';

const TestForStudentDetailsStudentPage: React.FC = () => {
  const { idTestForStudent } = useParams<{ idTestForStudent: string }>();
  const navigate = useNavigate();
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const uId = useSelector((state: RootState) => state.login.idPerson);

  const { testDetails, loading, error, refetch } = useGetTestForStudentDetails(
    Number(idTestForStudent)
  );

  const handleAnswerChange = (idAssignment: number, value: string) => {
    setAnswers((prev) => ({
      ...prev,
      [idAssignment]: value,
    }));
  };

  const handleSubmit = async () => {
    // Example: Send updated answers to the server.
    // Assuming `useSubmitAnswers` is a custom hook to handle API calls.
    const updatedAnswers = Object.entries(answers).map(
      ([idAssignment, answer]) => ({
        idAssignment: Number(idAssignment),
        answer,
      })
    );

    try {
      // Placeholder for API call
      console.log('Submitting answers:', updatedAnswers, uId);
      alert('Odpowiedzi zapisane!');
      refetch(); // Reload data after submission
    } catch (error) {
      alert('Błąd podczas zapisywania odpowiedzi.');
    }
  };

  if (loading) return <p>Loading test details...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!testDetails) return <p>Nie znaleziono szczegółów testu.</p>;

  return (
    <div className="test-details-page">
      <h1>Szczegóły Testu</h1>
      <AppButton label="Powrót" onClick={() => goToMenu(navigate)} />

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
                <p>
                  Ocena:{' '}
                  {assignment.idMark
                    ? `${assignment.description} (${assignment.value ? 'Poprawna' : 'Niepoprawna'})`
                    : 'Brak oceny'}
                </p>
                <div className="answer-field">
                  <label>Twoja odpowiedź:</label>
                  <input
                    type="text"
                    value={
                      answers[assignment.idAssignment] ??
                      assignment.studentAnswer ??
                      ''
                    }
                    onChange={(e) =>
                      handleAnswerChange(
                        assignment.idAssignment,
                        e.target.value
                      )
                    }
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <button onClick={handleSubmit}>Zapisz odpowiedzi</button>
    </div>
  );
};

export default TestForStudentDetailsStudentPage;
