import React, { useState, useEffect } from 'react';
import AppButton from '../components/AppButton';
import { goToMenu } from '../lib/Navigate';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../futures/store';
import { useAvailability } from '../lib/useAvailability';
import { useAvailabilityUpdate } from '../lib/useAvailabilityUpdate';

const daysOfWeek = [
  'Poniedziałek',
  'Wtorek',
  'Środa',
  'Czwartek',
  'Piątek',
  'Sobota',
  'Niedziela',
];

interface EditAddAvailabilityProps {
  idDayOfTheWeek: number;
  startTime: string;
  endTime: string;
}

const AvailabilityPage: React.FC = () => {
  const email = useSelector((state: RootState) => state.login.email);
  const navigate = useNavigate();

  const {
    availability: fetchedAvailability,
    loading: fetchLoading,
    error: fetchError,
  } = useAvailability(email);

  const {
    updateAvailability,
    loading: updateLoading,
    error: updateError,
  } = useAvailabilityUpdate();

  const [availability, setAvailability] = useState<EditAddAvailabilityProps[]>(
    daysOfWeek.map((_, index) => ({
      idDayOfTheWeek: index + 1,
      startTime: '',
      endTime: '',
    }))
  );

  useEffect(() => {
    if (fetchedAvailability) {
      setAvailability(
        fetchedAvailability.map((item: any, index: number) => ({
          idDayOfTheWeek: index + 1,
          startTime: item.startTime || '',
          endTime: item.endTime || '',
        }))
      );
    }
  }, [fetchedAvailability]);

  const handleInputChange = (
    index: number,
    field: 'startTime' | 'endTime',
    value: string
  ) => {
    const newAvailability = [...availability];
    newAvailability[index][field] = value;
    setAvailability(newAvailability);
  };

  const handleSubmit = async () => {
    await updateAvailability(availability);
  };

  if (fetchLoading || updateLoading) {
    return <p>Loading availability...</p>;
  }

  if (fetchError || updateError) {
    return <p>Error: {fetchError || updateError}</p>;
  }

  return (
      <div className="availability-page">
          <div className="availability-wrapper">
              <h1>Określenie dostępności</h1>
              <div className="availability-form">
                  {daysOfWeek.map((day, index) => (
                      <div key={index} className="day-row">
                          <span className="day-label">{day}</span>
                          <input
                              type="time"
                              value={availability[index].startTime}
                              onChange={(e) => handleInputChange(index, 'startTime', e.target.value)}
                          />
                          <input
                              type="time"
                              value={availability[index].endTime}
                              onChange={(e) => handleInputChange(index, 'endTime', e.target.value)}
                          />
                      </div>
                  ))}
              </div>
              <div className="button-container">
                  <AppButton label="Powrót" onClick={() => goToMenu(navigate)} />
                  <AppButton label="Akceptuj" onClick={handleSubmit} />
              </div>
          </div>
      </div>


  );
};

export default AvailabilityPage;
