import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../futures/store';
import AppButton from '../components/AppButton';
import { goToMenu } from '../lib/Navigate';
import { useNavigate } from 'react-router-dom';
import { useSetTeacherSalary } from '../lib/useSetTeacherSalary';
import { useAllSubjects } from '../lib/useAllSubjects';

const AddSubjectsPage: React.FC = () => {
    const navigate = useNavigate();
    const [subjectsList, setSubjectsList] = useState<any[]>([]);
    const [selectedSubjects, setSelectedSubjects] = useState<{
        [subjectLevelId: number]: string;
    }>({});

    const email = useSelector((state: RootState) => state.login.email);
    const { subjects, loading, error } = useAllSubjects();

    const { setTeacherSalary } = useSetTeacherSalary();

    useEffect(() => {
        setSubjectsList(subjects);
    }, [subjects]);

    const handleSubjectChange = (subjectLevelId: number, checked: boolean) => {
        setSelectedSubjects((prev) => {
            if (checked) {
                return { ...prev, [subjectLevelId]: '0' };
            } else {
                const { [subjectLevelId]: _, ...rest } = prev;
                return rest;
            }
        });
    };

    const handleCostChange = (subjectLevelId: number, cost: string) => {
        setSelectedSubjects((prev) => ({
            ...prev,
            [subjectLevelId]: cost,
        }));
    };

    const handleSubmit = async () => {
        const teacherSalaries = Object.entries(selectedSubjects)
            .filter(([, hourlyRate]) => Number(hourlyRate) > 0)
            .map(([subjectLevelId, hourlyRate]) => ({
                subject_LevelId: Number(subjectLevelId),
                personEmail: email,
                hourlyRate: Number(hourlyRate),
            }));

        if (teacherSalaries.length === 0) {
            alert('Nie wybrano przedmiotów!');
            return;
        }

        const responseStatus = await setTeacherSalary(teacherSalaries);

        if (responseStatus === 200) {
            alert('Przedmioty i koszty zostały zapisane pomyślnie!');
            goToMenu(navigate);
        } else {
            alert('Nie udało się zapisać przedmiotów i kosztów!');
        }
    };

    if (loading) {
        return <div>Ładowanie...</div>;
    }

    if (error) {
        return <div>Błąd: {error}</div>;
    }

    return (
        <div className="subjects-container">
            <h1>Dodaj Przedmioty i Koszty</h1>
            <p className="instructions">
                Zaznacz przedmioty, które chcesz dodać i podaj koszt godzinowy.
            </p>
            {subjectsList.length === 0 ? (
                <p className="no-subjects">Brak dostępnych przedmiotów.</p>
            ) : (
                <div className="subjects-list">
                    {subjectsList.map((subjectDTO) => (
                        <div key={subjectDTO.subjectLevelId} className="subject-item">
                            <label className="subject-label">
                                <input
                                    type="checkbox"
                                    className="subject-checkbox"
                                    checked={!!selectedSubjects[subjectDTO.subjectLevelId]}
                                    onChange={(e) =>
                                        handleSubjectChange(
                                            subjectDTO.subjectLevelId,
                                            e.target.checked
                                        )
                                    }
                                />
                                {subjectDTO.subjectFullName}
                            </label>
                            {selectedSubjects[subjectDTO.subjectLevelId] !== undefined && (
                                <input
                                    type="text"
                                    className="cost-input"
                                    placeholder="Koszt (zł/h)"
                                    value={selectedSubjects[subjectDTO.subjectLevelId]}
                                    onChange={(e) =>
                                        handleCostChange(subjectDTO.subjectLevelId, e.target.value)
                                    }
                                />
                            )}
                        </div>
                    ))}
                </div>
            )}
            <div className="button-container">
                <AppButton label="Pomiń" onClick={() => goToMenu(navigate)} />
                <button className="submit-button" onClick={handleSubmit}>
                    Akceptuj
                </button>
            </div>
        </div>
    );
};

export default AddSubjectsPage;
