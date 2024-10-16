import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useLessonDetails } from '../lib/useLessonDetails';
import AppButton from '../components/AppButton';
import { goToCalendarPage } from '../lib/Navigate';

const LessonDetailsPage: React.FC = () => {
  const { lessonId } = useParams<{ lessonId: string }>();
  const navigate = useNavigate();

  const numericLessonId = lessonId ? parseInt(lessonId) : null;

  const lessonData = useLessonDetails(numericLessonId!);

  const getDay = (): string => {
    console.log(lessonData);
    const currentDate = new Date();
    return currentDate.toISOString().split('T')[0];
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
          {/* Upewnij się, że lessonData.dateTime istnieje przed wykonaniem split */}
          {lessonData.startDate ? (
            <>
              <p>
                <strong>Data:</strong> {lessonData.startDate.split('T')[0]}
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
            <strong>Status:</strong> {lessonData.statusName}
          </p>
          <p>
            <strong>Opis:</strong> {lessonData.description || 'Brak opisu'}
          </p>
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
