import React, { useEffect, useState } from 'react';
import AppButton from '../components/AppButton';
import { useNavigate, useParams } from 'react-router-dom';
import { goToCalendarPage, goToLessonDetailsPage, goToMenu } from '../lib/Navigate';
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

    // Calculate the start and end dates for the current week
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
        const currentDate = new Date(dateString ?? new Date().toISOString().split('T')[0]);
        currentDate.setDate(currentDate.getDate() + 7);
        return currentDate.toISOString().split('T')[0];
    };

    const getBeforeWeekISO = (dateString: string | undefined) => {
        const currentDate = new Date(dateString ?? new Date().toISOString().split('T')[0]);
        currentDate.setDate(currentDate.getDate() - 7);
        return currentDate.toISOString().split('T')[0];
    };

    return (
        <div className="availability-container">
            <h2>Kalendarzyk</h2>
            <div className="date-picker">
                <AppButton label="Poprzedni tydzieñ" onClick={() => goToCalendarPage(navigate, getBeforeWeekISO(startDay))} />
                <p>
                    Tydzieñ od {startOfWeek} do {endOfWeek}
                </p>
                <AppButton label="Nastêpny tydzieñ" onClick={() => goToCalendarPage(navigate, getNextWeekISO(startDay))} />
            </div>

            {/* Renderowanie dni i zajêæ dla ka¿dego dnia */}
            <div className="calendar-grid">
                {weekDates.length > 0 && calendars && weekDates.map((date, dayIndex) => (
                    <div key={date} className="day-column">
                        <h3>{date}</h3>
                        {/* SprawdŸ, czy s¹ jakieœ zajêcia dla danego dnia */}
                        {calendars[dayIndex]?.length > 0 ? (
                            calendars[dayIndex].map((lesson: Calendar) => (
                                <div key={lesson.lessonId} className="lesson-item">
                                    <p>Przedmiot: {lesson.subjectName}</p>
                                    <p>Godzina: {lesson.dateTime.substring(11, 16)}</p>
                                    <p>Status: {lesson.statusName}</p>
                                    {/* Dodanie przycisku Szczegó³y */}
                                    <AppButton label="Szczegó³y" onClick={() => goToLessonDetailsPage(navigate, lesson.lessonId)} />
                                </div>
                            ))
                        ) : (
                            <p>Brak zajêæ</p>
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
