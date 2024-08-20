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

const AvailabilityPage: React.FC = () => {
    const email = useSelector((state: RootState) => state.login.email);
    const jwtToken = useSelector((state: RootState) => state.login.jwtToken);
    const navigate = useNavigate();
    
    // Initialize availability as an empty array
    const [availability, setAvailability] = useState(
        Array(7).fill({ startTime: '', endTime: '' })
    );

    const fetchAvailability = async (email: string, token: string) => {
        try {
            const response = await getAvailability(email, token);
            return response; // assuming this returns the parsed JSON directly
        } catch (error) {
            console.error('Error fetching availability calendar:', error);
            return Array(7).fill({ startTime: '', endTime: '' }); // return an empty array on error
        }
    };

    const generateAvailabilityHTML = async (email: string, token: string) => {
        try {
            const availabilityData = await fetchAvailability(email, token);
            if (availabilityData) {
                const mappedAvailability = daysOfWeek.map((_, index) => {
                    const dayAvailability = availabilityData.find((avail: { IdDayOfTheWeek: number; }) => avail.IdDayOfTheWeek === index + 1);
                    return dayAvailability ? { startTime: dayAvailability.StartTime, endTime: dayAvailability.EndTime } : { startTime: '', endTime: '' };
                });
                setAvailability(mappedAvailability);
            } else {
                setAvailability(Array(7).fill({ startTime: '', endTime: '' }));
            }
        } catch (error) {
            console.error('Error generating availability calendar:', error);
            setAvailability(Array(7).fill({ startTime: '', endTime: '' }));
        }
    };

    useEffect(() => {
        if (email && jwtToken) {
            generateAvailabilityHTML(email, jwtToken);
        }
    }, [email, jwtToken]);

    const handleInputChange = (index: number, field: 'startTime' | 'endTime', value: string) => {
        const newAvailability = [...availability];
        newAvailability[index] = { ...newAvailability[index], [field]: value };
        setAvailability(newAvailability);
    };

    const handleSubmit = async () => {
        const updatedAvailability = availability.map((avail, index) => ({
            IdDayOfTheWeek: index + 1,
            StartTime: avail.startTime,
            EndTime: avail.endTime,
        }));
        await CreateAndUpdateAvailabilityByEmail(updatedAvailability, email, jwtToken);
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
                            value={availability[index]?.startTime || ''}
                            onChange={(e) => handleInputChange(index, 'startTime', e.target.value)}
                        />
                        <input
                            type="time"
                            value={availability[index]?.endTime || ''}
                            onChange={(e) => handleInputChange(index, 'endTime', e.target.value)}
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