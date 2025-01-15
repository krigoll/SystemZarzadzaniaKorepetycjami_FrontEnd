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

  const { updateAvailability, loading: updateLoading } =
    useAvailabilityUpdate();

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
    for (const entry of availability) {
      const { startTime, endTime } = entry;

      if ((startTime && !endTime) || (!startTime && endTime)) {
        alert(
          'Jeśli podano godzinę początkową, należy podać również godzinę końcową i odwrotnie.'
        );
        return;
      }

      if (startTime && endTime && startTime >= endTime) {
        alert('Godzina początkowa musi być wcześniejsza niż godzina końcowa.');
        return;
      }
    }

    const returnValue = await updateAvailability(availability);
    if (returnValue == 1) {
      alert('Błąd servera');
    }
  };

  if (fetchError) {
    alert('Błąd przy pobieraniu dostępności!');
  }

  return (
    <div className="availability-page">
      <div className="availability-wrapper">
        <h1>Dostępność</h1>
        <div className="availability-form">
          {daysOfWeek.map((day, index) => (
            <div key={index} className="day-row">
              <span className="day-label">{day}</span>
              <input
                type="time"
                value={availability[index].startTime}
                onChange={(e) =>
                  handleInputChange(index, 'startTime', e.target.value)
                }
              />
              <input
                type="time"
                value={availability[index].endTime}
                onChange={(e) =>
                  handleInputChange(index, 'endTime', e.target.value)
                }
              />
            </div>
          ))}
        </div>
        <div className="button-container">
          <AppButton label="Powrót" onClick={() => goToMenu(navigate)} />
          <AppButton
            label={fetchLoading || updateLoading ? 'Wysyłanie' : 'Akceptuj'}
            onClick={handleSubmit}
            disabled={fetchLoading || updateLoading}
          />
        </div>
      </div>
    </div>
  );
};

export default AvailabilityPage;
