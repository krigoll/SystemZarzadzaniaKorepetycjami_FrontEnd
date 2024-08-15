import React, { useEffect, useState, ChangeEvent } from 'react';
import AppButton from '../components/AppButton';
import { useNavigate, useParams } from 'react-router-dom';
import { goToDeterminingAvailabilty, goToTeacherMenu } from '../lib/Navigate';
import { useSelector } from 'react-redux';
import { RootState } from '../futures/store';
import { getAvailabilityCalendar } from '../lib/API';

interface CalendarItem {
    StartingDate: string;
    NumberOfLessons: number;
    BreakTime: number;
}

const SetAvailabilityPage: React.FC = () => {
    const navigate = useNavigate();
    const { startDay } = useParams();

    const [calendars, setCalendars] = useState<CalendarItem[]>([]);

    const emailOld = useSelector((state: RootState) => state.login.email);
    const jwtToken = useSelector((state: RootState) => state.login.jwtToken);

    const fetchAvailabilityCalendar = async (email: string, token: string, setDate: string) => {
        try {
            const response = await getAvailabilityCalendar(email, token, setDate);
            return response;  // assuming this returns the parsed JSON directly
        } catch (error) {
            console.error('Error fetching availability calendar:', error);
            return [];  // return an empty array on error
        }
    };

    const generateAvailabilityCalendarHTML = async (email: string, token: string, setDate: string) => {
        try {
            const availabilityCalendarData = await fetchAvailabilityCalendar(email, token, setDate);
            if (availabilityCalendarData) {
                setCalendars(availabilityCalendarData);  // ensure this is always an array
            } else {
                setCalendars([]);  // default to an empty array if no data
            }
        } catch (error) {
            console.error('Error generating availability calendar:', error);
            setCalendars([]);  // handle error by setting to an empty array
        }
    };

    useEffect(() => {
        if (emailOld && jwtToken && startDay) {
            generateAvailabilityCalendarHTML(emailOld, jwtToken, startDay);
        }
    }, [emailOld, jwtToken, startDay]);  // added startDay to the dependency array

    function getNextWeekISO(dateString: string | undefined) {
        const currentDate = new Date(dateString ?? new Date().toISOString().split('T')[0]);
        currentDate.setDate(currentDate.getDate() + 7);
        return currentDate.toISOString().split('T')[0];
    }

    function getBeforeWeekISO(dateString: string | undefined) {
        const currentDate = new Date(dateString ?? new Date().toISOString().split('T')[0]);
        currentDate.setDate(currentDate.getDate() - 7);
        return currentDate.toISOString().split('T')[0];
    }

    const handleInputChange = (index: number, event: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;

        setCalendars(prevCalendars => {
            const newCalendars = [...prevCalendars];
            const calendarItem = { ...newCalendars[index] };

            if (name === "NumberOfLessons") {
                calendarItem.NumberOfLessons = Number(value);
            } else if (name === "BreakTime") {
                calendarItem.BreakTime = Number(value);
            }

            newCalendars[index] = calendarItem;
            return newCalendars;
        });
    };

    return (
        <div className="availability-container">
            <h2>Ustal dostępność</h2>
            <div className="date-picker">
                <AppButton label="Następny tydzień" onClick={() => goToDeterminingAvailabilty(navigate, getNextWeekISO(startDay))} />
                {startDay}
                <AppButton label="Poprzedni tydzień" onClick={() => goToDeterminingAvailabilty(navigate, getBeforeWeekISO(startDay))} />
            </div>
            <div>
                {calendars.length > 0 ? calendars.map((calendar, index) => (
                    <div key={calendar.StartingDate}>
                        <p>{calendar.StartingDate}</p> //TODO
                        <p>
                            Liczba lekcji
                            <input
                                type="number"
                                name="NumberOfLessons"
                                placeholder="Liczba lekcji"
                                value={calendar.NumberOfLessons}
                                onChange={(event) => handleInputChange(index, event)}
                            />
                        </p>
                        <p>
                            Czas przerwy
                            <input
                                type="number"
                                name="BreakTime"
                                placeholder="Czas przerwy"
                                value={calendar.BreakTime}
                                onChange={(event) => handleInputChange(index, event)}
                            />
                        </p>
                    </div>
                )) : <p>Brak danych dostępności na wybrany tydzień.</p>}
            </div>
            <div className="button-container">
                <AppButton label="Powrót" onClick={() => goToTeacherMenu(navigate)} />
                <AppButton label="Zapisz" />
            </div>
        </div>
    );
};

export default SetAvailabilityPage;
