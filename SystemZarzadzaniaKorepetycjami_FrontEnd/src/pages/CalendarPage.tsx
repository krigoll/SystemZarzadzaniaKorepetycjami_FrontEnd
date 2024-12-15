import React, { useEffect, useState } from 'react';
import AppButton from '../components/AppButton';
import { useNavigate, useParams } from 'react-router-dom';
import {
  goToCalendarPage,
  goToLessonDetailsPage,
  goToMenu,
} from '../lib/Navigate';
import { useSelector } from 'react-redux';
import { RootState } from '../futures/store';
import { useCalendar } from '../lib/useCalendar';
import { getWeekRange } from '../lib/WeekRange';
import { Calendar } from '../types/Calendar';

const CalendarPage: React.FC = () => {
  const navigate = useNavigate();
  const { startDay } = useParams();

  const email = useSelector((state: RootState) => state.login.email);
  const calendars = useCalendar(email, startDay);

  const [weekDates, setWeekDates] = useState<string[]>([]);

  const { startOfWeek, endOfWeek } = getWeekRange(startDay);

  const getWeekDates = (startDateString: string) => {
    const startDate = new Date(startDateString);
    const week = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      week.push(date.toISOString().split('T')[0]);
    }
    return week;
  };

  useEffect(() => {
    if (email && startDay) {
      const dates = getWeekDates(startOfWeek);
      setWeekDates(dates);
    }
  }, [email, startDay]);

  const getNextWeekISO = (dateString: string | undefined) => {
    const currentDate = new Date(
      dateString ?? new Date().toISOString().split('T')[0]
    );
    currentDate.setDate(currentDate.getDate() + 7);
    return currentDate.toISOString().split('T')[0];
  };

  const getBeforeWeekISO = (dateString: string | undefined) => {
    const currentDate = new Date(
      dateString ?? new Date().toISOString().split('T')[0]
    );
    currentDate.setDate(currentDate.getDate() - 7);
    return currentDate.toISOString().split('T')[0];
  };

  return (
    <div className="availability-container">
      <h2>Kalendarz</h2>
      <div className="date-picker">
        <AppButton
          label="Poprzedni tydzień"
          onClick={() => goToCalendarPage(navigate, getBeforeWeekISO(startDay))}
        />
        <p>
          Tydzień od {startOfWeek} do {endOfWeek}
        </p>
        <AppButton
          label="Następny tydzień"
          onClick={() => goToCalendarPage(navigate, getNextWeekISO(startDay))}
        />
      </div>

      <div className="calendar-grid">
        {weekDates.length > 0 &&
          calendars &&
          weekDates.map((date, dayIndex) => (
            <div key={date} className="day-column">
              <h3>{date}</h3>
              {calendars[dayIndex]?.length > 0 ? (
                calendars[dayIndex].map((lesson: Calendar) => (
                  <div key={lesson.lessonId} className="lesson-item">
                    <p>Przedmiot: {lesson.subjectName}</p>
                    <p>Godzina: {lesson.dateTime.substring(11, 16)}</p>
                    <p>Status: {lesson.statusName}</p>
                    <AppButton
                            label="Szczegóły"
                      onClick={() =>
                        goToLessonDetailsPage(navigate, lesson.lessonId)
                      }
                    />
                  </div>
                ))
              ) : (
                <p>Brak zajęć</p>
              )}
            </div>
          ))}
      </div>

      <div className="button-container">
        <AppButton label="Powrót" onClick={() => goToMenu(navigate)} />
      </div>
    </div>
  );
};

export default CalendarPage;
