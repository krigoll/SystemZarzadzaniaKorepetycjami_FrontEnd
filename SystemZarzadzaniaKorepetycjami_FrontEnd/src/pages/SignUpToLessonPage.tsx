import React, { useEffect, useState } from 'react';
import AppButton from '../components/AppButton';
import { useLocation, useNavigate } from 'react-router-dom';
import { goToChooseTeacherPage, goToMenu } from '../lib/Navigate';
import { useSelector } from 'react-redux';
import { RootState } from '../futures/store';
import { AppDateInput } from '../components/AppInput';
import { useTeacherAvailabilityById } from '../lib/useTeacherAvailabilityById';
import { useSignUpToLesson } from '../lib/useSignUpToLesson';
import { useGetTeacherReviews } from '../lib/useGetTeacherOpinionById';

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
  const [duration, setDuration] = useState<number>(0);
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

  const {
    reviews,
    loading: reviewsLoading,
    error: reviewsError,
  } = useGetTeacherReviews(teacher.idTeacher);

  const isDateInPast = (date: string, time: string) => {
    const selected = new Date(`${date}T${time}`);
    const now = new Date();
    return selected < now;
  };

  const isTeacherAvailable = (date: string, time: string) => {
    if (!date || !time || !availability) {
      return false;
    }

    const dayOfWeek = new Date(date).getDay();
    const availabilityForDay = availability?.[dayOfWeek - 1];

    if (
      !availabilityForDay ||
      !availabilityForDay.startTime ||
      !availabilityForDay.endTime
    ) {
      return false;
    }

    const [startHour, startMinute] = availabilityForDay.startTime
      .split(':')
      .map(Number);
    const [endHour, endMinute] = availabilityForDay.endTime
      .split(':')
      .map(Number);
    const [lessonHour, lessonMinute] = time.split(':').map(Number);

    if (
      isNaN(startHour) ||
      isNaN(startMinute) ||
      isNaN(endHour) ||
      isNaN(endMinute) ||
      isNaN(lessonHour) ||
      isNaN(lessonMinute)
    ) {
      return false;
    }

    const startTime = startHour * 60 + startMinute;
    const endTime = endHour * 60 + endMinute;
    const lessonTimeInMinutes = lessonHour * 60 + lessonMinute;

    return (
      lessonTimeInMinutes >= startTime &&
      lessonTimeInMinutes + duration <= endTime
    );
  };

  const handleAcceptClick = async () => {
    if (!selectedDate || !lessonTime || duration == 0) {
      alert('Proszę uzupełnić wszystkie pola formularza!');
      return;
    }

    if (isDateInPast(selectedDate, lessonTime)) {
      alert('Nie poprawna data!');
      return;
    }

    if (!isTeacherAvailable(selectedDate, lessonTime)) {
      alert('Nauczyciel nie jest dostępny w wybranym terminie!');
      return;
    }

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
      alert('Udało się zapisać na korepetycje!');
      goToMenu(navigate);
    } else if (error) {
      alert(`${error}`);
    }
  }, [responseStatus, error, navigate]);

  return (
    <div className="teacher-details-page">
      <div className="teacher-details-box">
        <h1>Szczegóły Nauczyciela</h1>
        <div className="teacher-info">
          <div className="teacher-details">
            <div className="teacher-name">{teacher.name}</div>
            <div className="teacher-subject">Przedmiot: {subjectInfo}</div>
            <div className="teacher-price">
              Cena za godzinę: {teacher.price} zł
            </div>
          </div>
          <div className="teacher-photo">
            {teacher.image && (
              <img
                src={URL.createObjectURL(teacher.image)}
                alt={`${teacher.name}`}
              />
            )}
          </div>
        </div>

        <div className="availability-form">
          <h2>Dostępność nauczyciela</h2>
          {availabilityLoading && <p>Ładowanie dostępności...</p>}
          {availabilityError && (
            <p>Błąd ładowania dostępności: {availabilityError}</p>
          )}
          {!availabilityLoading && !availabilityError && availability && (
            <div>
              {daysOfWeek.map((day, index) => (
                <div key={index} className="day-row">
                  <p>
                    {day}: {availability[index]?.startTime || 'Brak'}
                    {' - '}
                    {availability[index]?.endTime}
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
            <select
              id="duration"
              value={duration}
              onChange={(e) => setDuration(parseInt(e.target.value, 10))}
            >
              <option value="0">Nie wybrano</option>
              <option value="30">30 minut</option>
              <option value="45">45 minut</option>
              <option value="60">60 minut</option>
              <option value="75">75 minut</option>
              <option value="90">90 minut</option>
              <option value="105">105 minut</option>
              <option value="120">120 minut</option>
            </select>
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

        <div className="reviews-section">
          <h2>Opinie Nauczyciela</h2>
          {reviewsLoading && <p>Ładowanie opinii...</p>}
          {reviewsError && <p>Błąd ładowania opinii: {reviewsError}</p>}
          {!reviewsLoading && !reviewsError && reviews && reviews.length > 0 ? (
            <div>
              {reviews.map((review) => (
                <div key={review.idOpinion} className="review">
                  <div className="review-rating">
                    <p>
                      <strong>Imię Nazwisko:</strong> {review.fullName}
                    </p>
                    <strong>Ocena:</strong> {review.rating}/5
                  </div>
                  <div className="review-content">
                    <strong>Treść:</strong> {review.content}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p>Ten nauczyciel nie ma jeszcze wystawionych opinii.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default TeacherDetailsPage;
