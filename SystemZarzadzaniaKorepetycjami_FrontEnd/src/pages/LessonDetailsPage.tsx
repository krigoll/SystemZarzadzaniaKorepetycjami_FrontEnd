import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useLessonDetails } from '../lib/useLessonDetails';
import AppButton from '../components/AppButton';
import { goToCalendarPage } from '../lib/Navigate';
import { CancelLesson } from '../lib/useHandleLesson';

const LessonDetailsPage: React.FC = () => {
    const { lessonId } = useParams<{ lessonId: string }>();
    const navigate = useNavigate();
    const [cancel, setCancel] = useState<boolean>(false);
    const cancelLesson = CancelLesson();
    const aktualnaDataICzas = new Date(
        new Date().toString().split('GMT')[0] + ' UTC'
    ).toISOString();

    const numericLessonId = lessonId ? parseInt(lessonId) : null;

    const lessonData = useLessonDetails(numericLessonId!);

    const getDay = (): string => {
        const currentDate = new Date();
        return currentDate.toISOString().split('T')[0];
    };

    const handleCancelLesson = async () => {
        try {
            const response = await cancelLesson(numericLessonId);
            if (response.ok) {
                alert(`Lekcja została anulowana!`);
                setCancel(false);
            } else {
                alert(`Nie udało się anulować lekcji!`);
            }
        } catch (error) {
            alert(`Błąd.`);
        }
    };

    const toggleCancelVisibility = () => {
        setCancel((prevCancel) => !prevCancel);
    };

    return (
        <div className="lesson-details-container">
            <h2>Szczegóły lekcji</h2>

            {lessonData ? (
                <div className="lesson-details">
                    <p>
                        <strong>Przedmiot:</strong> {lessonData.subjectName}
                    </p>
                    <p>
                        <strong>Nauczyciel:</strong> {lessonData.teacherName}
                    </p>
                    <p>
                        <strong>Uczeń:</strong> {lessonData.studentName}
                    </p>
                    {lessonData.startDate ? (
                        <>
                            <p>
                                <strong>Data:</strong> {lessonData.startDate.substring(0, 10)}
                            </p>
                            <p>
                                <strong>Godzina:</strong>{' '}
                                {lessonData.startDate.substring(11, 16)}
                            </p>
                        </>
                    ) : (
                        <p>Data nie jest dostępna</p>
                    )}
                    <p>
                        <strong>Cas trwania</strong> {lessonData.durationInMinutes} minut
                    </p>
                    <p>
                        <strong>Koszt</strong> {lessonData.cost} zł
                    </p>
                    <p>
                        <strong>Status:</strong> {lessonData.status}
                    </p>
                    {(lessonData.status != 'Anulowana' ||
                        lessonData.status != 'Odrzucona') &&
                        lessonData.startDate > aktualnaDataICzas && (
                            <button
                                className="delete-account"
                                onClick={toggleCancelVisibility}
                                style={{ marginTop: '20px' }}
                            >
                                Anuluj zajęcia
                            </button>
                        )}

                    {cancel && (
                        <div>
                            <p>Czy na pewno chcesz anulować zajęcia?</p>
                            <div className="button-container" style={{ marginTop: '5px' }}>
                                <AppButton
                                    label="Akceptuj"
                                    onClick={() => handleCancelLesson()}
                                />
                            </div>
                        </div>
                    )}
                </div>
            ) : (
                <p>Ładowanie szczegółów lekcji...</p>
            )}

            <div className="button-container">
                <AppButton
                    label="Powrót"
                    onClick={() => goToCalendarPage(navigate, getDay())}
                />
            </div>
        </div>
    );
};

export default LessonDetailsPage;
