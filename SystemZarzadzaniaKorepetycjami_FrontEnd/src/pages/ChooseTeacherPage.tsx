import React from 'react';
import AppButton from '../components/AppButton';
import { useNavigate, useParams } from 'react-router-dom';
import { goToChooseSubjectPage, goToSignUpToLessonPage } from '../lib/Navigate';
import { DataToSignUpToLesson } from '../types/DataToSignUpToLesson';
import { useTeachersForLevel } from '../lib/useTeachersForLevel';
import { useSelector } from 'react-redux';
import { RootState } from '../futures/store';

interface Teacher {
    id: number;
    name: string;
    price: number;
    image: File | null;
}

const ChooseTeacherPage: React.FC = () => {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();

    const subjectLevelId = Number(id?.split(' ')[2]);
    const email = useSelector((state: RootState) => state.login.email);

    const { teachers, loading, error } = useTeachersForLevel(subjectLevelId, email);

    const handleSignUpToLesson = (teacher: Teacher) => {
        const dataToSignUpToLesson: DataToSignUpToLesson = {
            teacherId: teacher.id,
            name: teacher.name,
            price: teacher.price,
            image: teacher.image,
            subjectInfo: id,
        };
        goToSignUpToLessonPage(navigate, dataToSignUpToLesson);
    };

    if (loading) {
        return <p>Ładowanie...</p>;
    }

    if (error) {
        return <p>Błąd: {error}</p>;
    }

    return (
        <div className="teacher-list-page">
            <div className="teacher-list-box">
                <h1>
                    Lista Nauczycieli dla: {id?.split(' ')[0] + ' ' + id?.split(' ')[1]}
                </h1>
                <div className="teacher-list">
                    {teachers.length === 0 ? (
                        <div className="no-teachers">Brak nauczycieli</div>
                    ) : (
                        teachers.map((teacher) => (
                            <div key={teacher.id} className="teacher-item">
                                <div className="teacher-info">
                                    <div className="teacher-name">
                                        {teacher.name}, {teacher.price} zł
                                    </div>
                                </div>
                                <div className="teacher-photo">
                                    {teacher.image ? (
                                        <img
                                            src={URL.createObjectURL(teacher.image)}
                                            alt={`${teacher.name}`}
                                        />
                                    ) : null}
                                </div>
                                <div className="teacher-actions">
                                    <AppButton
                                        label="Dalej"
                                        onClick={() => handleSignUpToLesson(teacher)}
                                    />
                                </div>
                            </div>
                        ))
                    )}
                </div>
                <div className="button-container">
                    <AppButton
                        label="Powrót"
                        onClick={() => goToChooseSubjectPage(navigate)}
                    />
                </div>
            </div>
        </div>

    );
};

export default ChooseTeacherPage;
