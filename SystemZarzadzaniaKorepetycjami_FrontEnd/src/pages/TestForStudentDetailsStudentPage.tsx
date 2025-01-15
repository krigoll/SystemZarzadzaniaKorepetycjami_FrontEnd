import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import AppButton from '../components/AppButton';
import { useGetTestForStudentDetails } from '../lib/useGetTestForStudentDetails';
import { goToTestStudentPage } from '../lib/Navigate';
import { useCreateOrUpdateStudentAnswer } from '../lib/useCreateOrUpdateStudentAnswer';

const TestForStudentDetailsStudentPage: React.FC = () => {
    const { idTestForStudent } = useParams<{ idTestForStudent: string }>();
    const navigate = useNavigate();
    const [answers, setAnswers] = useState<Record<number, string>>({});

    const { testDetails, loading, error } = useGetTestForStudentDetails(
        Number(idTestForStudent)
    );

    const {
        createOrUpdateStudentAnswers,
        loading: submitting,
        error: submitError,
    } = useCreateOrUpdateStudentAnswer();

    const handleAnswerChange = (idAssignment: number, value: string) => {
        setAnswers((prev) => ({
            ...prev,
            [idAssignment]: value,
        }));
    };

    const handleSubmit = async () => {
        const updatedAnswers = Object.entries(answers).map(
            ([idAssignment, answer]) => ({
                idAssignment: Number(idAssignment),
                answer,
                idStudentAnswer: 0,
            })
        );
        try {
            const success = await createOrUpdateStudentAnswers(
                Number(idTestForStudent),
                updatedAnswers
            );

            if (success) {
                alert('Odpowiedzi zostały zapisane!');
                goToTestStudentPage(navigate);
            } else {
                alert(submitError || 'Błąd podczas zapisywania odpowiedzi!');
            }
        } catch (error) {
            alert('Błąd podczas zapisywania odpowiedzi!');
        }
    };

    if (loading) return <p>Ładowanie testu...</p>;
    if (error) return <p>Błąd: {error}</p>;
    if (!testDetails) return <p>Nie znaleziono szczegółów testu.</p>;

    return (
        <div className="student-test-details-page">
            <div className="student-test-details-box">
                <h1>Szczegóły Testu</h1>

                <div className="student-test-details-info">
                    <h2>{testDetails.title}</h2>
                    <h3>Zadania:</h3>
                    {testDetails.assignment.length === 0 ? (
                        <p>Brak zadań.</p>
                    ) : (
                        <div className="student-assignment-list">
                            {testDetails.assignment.map((assignment) => (
                                <div
                                    key={assignment.idAssignment}
                                    className="student-assignment-item"
                                >
                                    <p>
                                        <strong>Treść zadania:</strong> {assignment.content}
                                    </p>
                                    {testDetails.status != 'Wyslany' && (
                                        <div>
                                            <p>
                                                <strong>Poprawna odpowiedź:</strong>{' '}
                                                {assignment.answerAssignment &&
                                                    assignment.answerAssignment.trim().length > 0 &&
                                                    assignment.idMark
                                                    ? assignment.answerAssignment
                                                    : 'Brak'}
                                            </p>
                                            
                                            {testDetails.status == 'Sprawdzony' && (
                                                <p>
                                                    <strong>Ocena:</strong>{' '}
                                                    {assignment.idMark
                                                        ? `${assignment.value ? 'Poprawne' : 'Niepoprawne'}`
                                                        : 'Brak oceny'}
                                                    {assignment.description && (
                                                        <div style={{ marginTop: '10px' }}>
                                                            <strong>Komentarz:</strong>
                                                            {assignment.description}
                                                        </div>
                                                    )}
                                                </p>
                                            )}
                                        </div>
                                    )}

                                    {testDetails.status == 'Wyslany' ? (
                                        <div className="student-answer-field">
                                            <label>Twoja odpowiedź:</label>
                                            <textarea
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
                                    ) : (
                                        <div>
                                            <strong>Twoja odpowiedź:</strong>{' '}
                                            {assignment.studentAnswer}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
                {testDetails.status == 'Wyslany' && (
                    <button
                        className="student-submit-button"
                        onClick={handleSubmit}
                        disabled={submitting}
                    >
                        {submitting ? 'Trwa przesyłanie...' : 'Prześlij odpowiedzi'}
                    </button>
                )}
            </div>
            <div className="button-container">
                <AppButton
                    label="Powrót"
                    onClick={() => goToTestStudentPage(navigate)}
                />
            </div>
        </div>
    );
};

export default TestForStudentDetailsStudentPage;
