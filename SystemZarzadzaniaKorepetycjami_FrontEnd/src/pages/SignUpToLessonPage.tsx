import React, { useEffect, useState } from 'react';
import AppButton from '../components/AppButton';
import { useLocation, useNavigate } from 'react-router-dom';
import { goToChooseTeacherPage, goToStudentMenu } from '../lib/Navigate';
import { useSelector } from 'react-redux';
import { RootState } from '../futures/store';
import { getAvailabilityById, singUpToLesson } from '../lib/API';
import { AppDateInput } from '../components/AppInput';

interface EditAddAvailabilityProps {
    idDayOfTheWeek: number;
    startTime: string;
    endTime: string;
}

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
    const [duration, setDuration] = useState<number>(1);
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
    const jwtToken = useSelector((state: RootState) => state.login.jwtToken);
    const email = useSelector((state: RootState) => state.login.email);

    const [availability, setAvailability] = useState<EditAddAvailabilityProps[]>(
        daysOfWeek.map((_, index) => ({
            idDayOfTheWeek: index + 1,
            startTime: 'Brak',
            endTime: 'Dostęności',
        }))
    );

    const fetchAvailabilityById = async (idTeacher: number, token: string) => {
        try {
            const response = await getAvailabilityById(idTeacher, token);
            console.log('response' + response);
            return response.map((item: any, index: number) => ({
                idDayOfTheWeek: index + 1,
                startTime: item.startTime || 'Brak',
                endTime: item.endTime || 'Dostęności',
            }));
        } catch (error) {
            console.error('Error fetching availability calendar:', error);
            return [];
        }
    };

    const generateAvailabilityHTML = async (idTeacher: number, token: string) => {
        try {
            const availabilityData = await fetchAvailabilityById(idTeacher, token);
            console.log('data' + availabilityData);
            setAvailability(availabilityData);
        } catch (error) {
            console.error('Error generating availability calendar:', error);
            setAvailability([]);
        }
    };

    useEffect(() => {
        console.log('przed efektem');
        console.log(location.state?.DataToSignUpToLesson);
        if (teacher.idTeacher && jwtToken) {
            console.log('w efekcie');
            generateAvailabilityHTML(teacher.idTeacher, jwtToken);
        }
    }, [location.state?.DataToSignUpToLesson.idTeacher, jwtToken]);

    const handleAcceptClick = async () => {
        const teacherId = teacher.idTeacher;
        const startDate = selectedDate;
        const startTime = lessonTime;
        const durationInMinutes = duration;
        const response = await singUpToLesson(
            {
                teacherId,
                email,
                subjectLevelId,
                startDate,
                startTime,
                durationInMinutes,
            },
            jwtToken
        );
        if (!response.ok) {
            if (response.status === 401) {
            } else if (response.status === 400) {
                console.error('Invalid Data');
                alert('Data z przeszłości nie wolno tak'!)
            } else if (response.status === 500) {
                console.error('Server Error');
            } else if (response.status === 409) {
                console.error('Conflict with another lesson');
                alert(
                    'W podanym czasie ty lub nauczyciel macie już nakładające się lakcię'
                );
            } else {
                console.error('Unexpected Error');
            }
        } else {
            alert('Udało się napisać na korepetycię');
            goToStudentMenu(navigate);
        }
    };

    return (
        <div className="teacher-details-page">
            <h1>Szczegóy Nauczyciela</h1>
            <div className="teacher-info">
                <div className="teacher-photo">
                    {teacher.image ? (
                        <img
                            src={URL.createObjectURL(teacher.image)}
                            alt={`${teacher.name}`}
                        />
                    ) : (
                        '[Brak Zdjęcia]'
                    )}
                </div>
                <div className="teacher-details">
                    <div className="teacher-name">{teacher.name}</div>
                    <div className="teacher-subject">Przedmiot: {subjectInfo}</div>
                    <div className="teacher-price">
                        Cena za godziny: {teacher.price} zł
                    </div>
                </div>
            </div>
            <div className="availability-form">
                <h2>Dostępność Nauczyciela</h2>
                {daysOfWeek.map((day, index) => (
                    <div key={index} className="day-row">
                        <p>
                            {day}: {availability[index].startTime}-
                            {availability[index].endTime}
                        </p>
                    </div>
                ))}
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
                    <input
                        type="number"
                        id="duration"
                        min="10"
                        value={duration}
                        onChange={(e) => setDuration(parseInt(e.target.value, 10))}
                    />
                </div>
            </div>
            <div className="button-container">
                <AppButton label="Zapisz się kolego!" onClick={handleAcceptClick} />
                <AppButton
                    label="Powrót"
                    onClick={() =>
                        goToChooseTeacherPage(navigate, DataToSignUpToLesson.subjectInfo)
                    }
                />
            </div>
        </div>
    );
};

export default TeacherDetailsPage;
