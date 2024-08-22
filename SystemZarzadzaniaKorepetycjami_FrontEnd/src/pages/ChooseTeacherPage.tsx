import React, { useEffect, useState } from 'react';
import AppButton from '../components/AppButton';
import { useSelector } from 'react-redux';
import { RootState } from '../futures/store';
import { getTeachersForLevel } from '../lib/API';
import { useNavigate } from 'react-router-dom';
import { goToStudentMenu, goToFiltersPage, goToTeacherDetailsPage } from '../lib/Navigate';

interface Teacher {
    id: number;
    name: string;
    price: number;
    positiveFeedback: number;
}

const ChooseTeacherPage: React.FC = () => {
    const navigate = useNavigate();
    const [teachers, setTeachers] = useState<Teacher[]>([]);
    const token = useSelector((state: RootState) => state.login.jwtToken);

    useEffect(() => {
        const fetchTeachers = async () => {
            try {
                const data = await getTeachersForLevel(token);
                setTeachers(data);
            } catch (error) {
                console.error('Error fetching teachers:', error);
            }
        };

        fetchTeachers();
    }, [token]);

    return (
        <div className="teacher-list-page">
            <h1>Lista Nauczycieli dla: Angielski B2</h1>
            <div className="teacher-list">
                {teachers.map((teacher) => (
                    <div key={teacher.id} className="teacher-item">
                        <div className="teacher-info">
                            <div className="teacher-name">{teacher.name}, {teacher.price} z³</div>
                            <div className="teacher-feedback">{teacher.positiveFeedback}% pozytywnych opinii</div>
                        </div>
                        <div className="teacher-photo">[Zdjêcie]</div>
                        <div className="teacher-actions">
                            <AppButton
                                label="Dalej"
                                onClick={() => goToTeacherDetailsPage(navigate, teacher.id)}
                            />
                        </div>
                    </div>
                ))}
            </div>
            <div className="button-container">
                <AppButton label="Powrót" onClick={() => goToStudentMenu(navigate)} />
                <AppButton label="Filtry" onClick={() => goToFiltersPage(navigate)} />
            </div>
        </div>
    );
};

export default ChooseTeacherPage;
