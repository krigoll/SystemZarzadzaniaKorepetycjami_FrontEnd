import React, { useEffect, useState, ChangeEvent } from 'react';
import AppButton from '../components/AppButton';
import { useNavigate, useParams } from 'react-router-dom';
import { goToDeterminingAvailabilty, goToTeacherMenu } from '../lib/Navigate';
import { useSelector } from 'react-redux';
import { RootState } from '../futures/store';
import { CreateAndUpdateCalendarsByEmail, getAvailabilityCalendar } from '../lib/API';

interface CalendarItem {
  startingDate: string;
  numberOfLessons: number;
  breakTime: number;
}

const SetAvailabilityPage: React.FC = () => {
  const navigate = useNavigate();
  const { startDay } = useParams();

  const [calendars, setCalendars] = useState<CalendarItem[]>([]);

  const emailOld = useSelector((state: RootState) => state.login.email);
  const jwtToken = useSelector((state: RootState) => state.login.jwtToken);

  const fetchAvailabilityCalendar = async (
    email: string,
    token: string,
    setDate: string
  ) => {
    try {
      const response = await getAvailabilityCalendar(email, token, setDate);
      return response; // assuming this returns the parsed JSON directly
    } catch (error) {
      console.error('Error fetching availability calendar:', error);
      return []; // return an empty array on error
    }
  };

  const generateAvailabilityCalendarHTML = async (
    email: string,
    token: string,
    setDate: string
  ) => {
    try {
      const availabilityCalendarData = await fetchAvailabilityCalendar(
        email,
        token,
        setDate
      );
      if (availabilityCalendarData) {
        setCalendars(availabilityCalendarData); // ensure this is always an array
      } else {
        setCalendars([]); // default to an empty array if no data
      }
    } catch (error) {
      console.error('Error generating availability calendar:', error);
      setCalendars([]); // handle error by setting to an empty array
    }
  };

  useEffect(() => {
    if (emailOld && jwtToken && startDay) {
      generateAvailabilityCalendarHTML(emailOld, jwtToken, startDay);
    }
  }, [emailOld, jwtToken, startDay]); // added startDay to the dependency array

  useEffect(() => {
    console.log(calendars);
  }, [calendars]); // Logs the updated calendars state

  function getNextWeekISO(dateString: string | undefined) {
    const currentDate = new Date(
      dateString ?? new Date().toISOString().split('T')[0]
    );
    currentDate.setDate(currentDate.getDate() + 7);
    return currentDate.toISOString().split('T')[0];
  }

  function getBeforeWeekISO(dateString: string | undefined) {
    const currentDate = new Date(
      dateString ?? new Date().toISOString().split('T')[0]
    );
    currentDate.setDate(currentDate.getDate() - 7);
    return currentDate.toISOString().split('T')[0];
  }

  const handleInputChange = (
    index: number,
    event: ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = event.target;

    setCalendars((prevCalendars) => {
      const newCalendars = [...prevCalendars];
        const calendarItem = { ...newCalendars[index] };

        const numericValue = Math.max(0, Number(value));

      if (name === 'numberOfLessons') {
          calendarItem.numberOfLessons = numericValue;
      } else if (name === 'breakTime') {
          calendarItem.breakTime = numericValue;
      }

      newCalendars[index] = calendarItem;
      return newCalendars;
    });
  };

  const handleSubmit = async () => {
    try {
      const responce = await CreateAndUpdateCalendarsByEmail(calendars,emailOld,jwtToken);
      if (!responce.ok) {
        alert("Nie udało się!"); 
      } else {
        alert("Udało się!"); 
      }
    } catch (error) {
      console.log(error);
    }
    
  }

  return (
    <div className="availability-container">
      <h2>Ustal dostępność</h2>
      <div className="date-picker">
        <AppButton
          label="Następny tydzień"
          onClick={() =>
            goToDeterminingAvailabilty(navigate, getNextWeekISO(startDay))
          }
        />
        {startDay}
        <AppButton
          label="Poprzedni tydzień"
          onClick={() =>
            goToDeterminingAvailabilty(navigate, getBeforeWeekISO(startDay))
          }
        />
      </div>
      <div>
        {calendars.length > 0 ? (
          calendars.map((calendar, index) => (
            <div key={calendar.startingDate}>
              <p>{calendar.startingDate}</p>
              <p>
                Liczba lekcji
                <input
                  type="number"
                  name="numberOfLessons"
                  placeholder="Liczba lekcji"
                  value={calendar.numberOfLessons}
                  onChange={(event) => handleInputChange(index, event)}
                          min="0"
                />
              </p>
              <p>
                Czas przerwy
                <input
                  type="number"
                  name="breakTime"
                  placeholder="Czas przerwy"
                  value={calendar.breakTime}
                  onChange={(event) => handleInputChange(index, event)}
                          min="0"
                />
              </p>
            </div>
          ))
        ) : (
          <p>Brak danych dostępności na wybrany tydzień.</p>
        )}
      </div>
      <div className="button-container">
        <AppButton label="Powrót" onClick={() => goToTeacherMenu(navigate)} />
        <AppButton label="Zapisz" onClick={() => handleSubmit}/>
      </div>
    </div>
  );
};

export default SetAvailabilityPage;
