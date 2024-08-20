import React, { useEffect, useState } from 'react';
import AppButton from '../components/AppButton';
import { goToTeacherMenu } from '../lib/Navigate';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../futures/store';
import { CreateAndUpdateAvailabilityByEmail, getAvailability } from '../lib/API';

const daysOfWeek = [
    'Poniedziałek',
    'Wtorek',
    'Środa',
    'Czwartek',
    'Piątek',
    'Sobota',
    'Niedziela'
];

interface EditAddAvailabilityProps {
    idDayOfTheWeek: number;
    startTime: string;
    endTime: string;
}

const AvailabilityPage: React.FC = () => {
    const email = useSelector((state: RootState) => state.login.email);
    const jwtToken = useSelector((state: RootState) => state.login.jwtToken);
    const navigate = useNavigate();

    const [availability, setAvailability] = useState<EditAddAvailabilityProps[]>(
        daysOfWeek.map((_, index) => ({
            idDayOfTheWeek: index + 1,
            startTime: '',
            endTime: ''
        }))
    );

    const fetchAvailability = async (email: string, token: string) => {
        try {
            const response = await getAvailability(email, token);
            return response.map((item: any, index: number) => ({
                idDayOfTheWeek: index + 1,
                startTime: item.startTime || '',
                endTime: item.endTime || ''
            }));
        } catch (error) {
            console.error('Error fetching availability calendar:', error);
            return [];
        }
    };

    const generateAvailabilityHTML = async (email: string, token: string) => {
        try {
            const availabilityData = await fetchAvailability(email, token);
            setAvailability(availabilityData);
        } catch (error) {
            console.error('Error generating availability calendar:', error);
            setAvailability([]);
        }
    };

    useEffect(() => {
        if (email && jwtToken) {
            generateAvailabilityHTML(email, jwtToken);
            console.log(availability);
        }
    }, [email, jwtToken]);

    const handleInputChange = (
        index: number,
        field: 'StartTime' | 'EndTime',
        value: string
    ) => {
        const newAvailability = [...availability];
        newAvailability[index][field] = value;
        setAvailability(newAvailability);
    };

    const handleSubmit = async () => {
        console.log(availability);
        await CreateAndUpdateAvailabilityByEmail(availability, email, jwtToken);
    };

    return (
        <div className="availability-page">
            <h1>Określenie dostępności</h1>
            <div className="availability-form">
                {daysOfWeek.map((day, index) => (
                    <div key={index} className="day-row">
                        <span className="day-label">{day}</span>
                        <input
                            type="time"
                            value={availability[index].StartTime}
                            onChange={(e) =>
                                handleInputChange(index, 'StartTime', e.target.value)
                            }
                        />
                        <input
                            type="time"
                            value={availability[index].EndTime}
                            onChange={(e) =>
                                handleInputChange(index, 'EndTime', e.target.value)
                            }
                        />
                    </div>
                ))}
            </div>
            <div className="button-container">
                <AppButton label="Powrót" onClick={() => goToTeacherMenu(navigate)} />
                <AppButton label="Akceptuj" onClick={handleSubmit} />
            </div>
        </div>
    );
};

export default AvailabilityPage;
