import React, { useState } from 'react';
import AppButton from '../components/AppButton';
import { useNavigate } from 'react-router-dom';
import { goToTeacherMenu } from '../lib/Navigate';

const SetAvailabilityPage: React.FC = () => {
    const navigate = useNavigate();
    const [availability, setAvailability] = useState([
        {
            date: '2024/08/08',
            startTime: '',
            numOfClasses: '',
            breakTime: ''
        },
        {
            date: '2024/08/09',
            startTime: '',
            numOfClasses: '',
            breakTime: ''
        }
    ]);

    const handleInputChange = (
        index: number,
        field: string,
        value: string
    ) => {
        const newAvailability = [...availability];
        newAvailability[index][field] = value;
        setAvailability(newAvailability);
    };

    const handleSave = () => {
        console.log('Saved availability:', availability);
        // Dodaj logikê zapisywania danych
    };

    return (
        <div className="availability-container">
            <h2>Ustal dostêpnoœæ</h2>
            <div className="date-picker">
                {availability.map((slot, index) => (
                    <div key={index} className="availability-slot">
                        <div className="date-label">{slot.date}</div>
                        <input
                            type="time"
                            placeholder="Czas rozpoczêcia"
                            value={slot.startTime}
                            onChange={(e) =>
                                handleInputChange(index, 'startTime', e.target.value)
                            }
                        />
                        <input
                            type="text"
                            placeholder="Liczba zajêæ"
                            value={slot.numOfClasses}
                            onChange={(e) =>
                                handleInputChange(index, 'numOfClasses', e.target.value)
                            }
                        />
                        <input
                            type="time"
                            placeholder="Czas trwania przerwy"
                            value={slot.breakTime}
                            onChange={(e) =>
                                handleInputChange(index, 'breakTime', e.target.value)
                            }
                        />
                    </div>
                ))}
            </div>
            <div className="button-container">
                <AppButton label="Powrót" onClick={() => goToTeacherMenu(navigate)} />
                <AppButton label="Zapisz" onClick={handleSave} />
            </div>
        </div>
    );
};

export default SetAvailabilityPage;
