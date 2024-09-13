import React, { useEffect, useState } from 'react';
import AppButton from '../components/AppButton';
import { useLocation, useNavigate } from 'react-router-dom';
import { goToChooseTeacherPage, goToStudentMenu } from '../lib/Navigate';
import { useSelector } from 'react-redux';
import { RootState } from '../futures/store';
import { AppDateInput } from '../components/AppInput';
import { useTeacherAvailabilityById } from '../lib/useTeacherAvailabilityById';
import { useSignUpToLesson } from '../lib/useSignUpToLesson'; // Importujemy hook

const daysOfWeek = [
  'Poniedziałek',
  'Wtorek',
  'Środa',
  'Czwartek',
  'Piątek',
  'Sobota',
  'Niedziela',
];

const TeacherDetailsPage: React.FC = () => {
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState('');
  const [duration, setDuration] = useState<number>(1);
  const [lessonTime, setLessonTime] = useState('');
  const location = useLocation();
  const DataToSignUpToLesson = location.state?.DataToSignUpToLesson;

  const [teacher] = useState({
    idTeacher: DataToSignUpToLesson.teacherId,
    name: DataToSignUpToLesson.name,
    price: DataToSignUpToLesson.price,
    image: DataToSignUpToLesson.image,
  });

  const [subjectInfo] = useState(
    DataToSignUpToLesson.subjectInfo?.split(' ')[0] +
      ' ' +
      DataToSignUpToLesson.subjectInfo?.split(' ')[1]
  );

  const [subjectLevelId] = useState(
    DataToSignUpToLesson.subjectInfo?.split(' ')[2]
  );

  const email = useSelector((state: RootState) => state.login.email);

  const { signUp, loading, error, responseStatus } = useSignUpToLesson();

  const {
    availability,
    loading: availabilityLoading,
    error: availabilityError,
  } = useTeacherAvailabilityById(teacher.idTeacher);

  const handleAcceptClick = async () => {
    await signUp({
      teacherId: teacher.idTeacher,
      email,
      subjectLevelId,
      startDate: selectedDate,
      startTime: lessonTime,
      durationInMinutes: duration,
    });
  };

  useEffect(() => {
    if (responseStatus === 200) {
      alert('Udało się zapisać na korepetycje');
      goToStudentMenu(navigate);
    } else if (error) {
      alert(`Błąd: ${error}`);
    }
  }, [responseStatus, error, navigate]);

  return (
    <div className="teacher-details-page">
      <h1>Szczegóły Nauczyciela</h1>
      <div className="teacher-info">
        <div className="teacher-photo">
          {teacher.image ? (
            <img
              src={URL.createObjectURL(teacher.image)}
              alt={`${teacher.name}`}
            />
          ) : (
            '[Brak Zdjęcia]'
          )}
        </div>
        <div className="teacher-details">
          <div className="teacher-name">{teacher.name}</div>
          <div className="teacher-subject">Przedmiot: {subjectInfo}</div>
          <div className="teacher-price">
            Cena za godzinę: {teacher.price} zł
          </div>
        </div>
      </div>

      <div className="availability-form">
        <h2>Dostępność Nauczyciela</h2>
        {availabilityLoading && <p>Loading availability...</p>}
        {availabilityError && (
          <p>Error loading availability: {availabilityError}</p>
        )}
        {!availabilityLoading && !availabilityError && availability && (
          <div>
            {daysOfWeek.map((day, index) => (
              <div key={index} className="day-row">
                <p>
                  {day}: {availability[index]?.startTime || 'Brak'} -{' '}
                  {availability[index]?.endTime || 'Dostępność'}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="lesson-form">
        <h2>Formularz do zapisu</h2>
        <div className="form-field">
          <label htmlFor="date">Data:</label>
          <AppDateInput
            placecholder="Data lekcji"
            inputValue={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
          />
        </div>
        <div className="form-field">
          <label htmlFor="time">Godzina:</label>
          <input
            type="time"
            value={lessonTime}
            onChange={(e) => setLessonTime(e.target.value)}
          />
        </div>
        <div className="form-field">
          <label htmlFor="duration">Czas trwania (minuty):</label>
          <input
            type="number"
            id="duration"
            min="10"
            value={duration}
            onChange={(e) => setDuration(parseInt(e.target.value, 10))}
          />
        </div>
      </div>

      <div className="button-container">
        <AppButton
          label="Powrót"
          onClick={() =>
            goToChooseTeacherPage(navigate, DataToSignUpToLesson.subjectInfo)
          }
        />
        <button onClick={handleAcceptClick} disabled={loading}>
          Zapisz się!
        </button>
      </div>

      {loading && <p>Trwa zapisywanie na lekcję...</p>}
      {error && <p>Błąd: {error}</p>}
    </div>
  );
};

export default TeacherDetailsPage;
