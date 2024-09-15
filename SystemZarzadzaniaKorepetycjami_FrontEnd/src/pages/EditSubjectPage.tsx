import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import './App.css';
import { RootState } from '../futures/store';
import AppButton from '../components/AppButton';
import { goToMenu, goToTeacherMenu } from '../lib/Navigate';
import { useNavigate } from 'react-router-dom';
import { useSetTeacherSalary } from '../lib/useSetTeacherSalary';
import { useAllSubjectsEdit } from '../lib/useAllSubjectsEdit';

const AddSubjectsPage: React.FC = () => {
  const navigate = useNavigate();
  const [subjectsList, setSubjectsList] = useState<any[]>([]);
  const [selectedSubjects, setSelectedSubjects] = useState<{
    [subjectLevelId: number]: string;
  }>({});

  const email = useSelector((state: RootState) => state.login.email);
  const { subjects, loading, error } = useAllSubjectsEdit(email);
  const { setTeacherSalary } = useSetTeacherSalary();

  useEffect(() => {
    // Ustawianie listy przedmiotów
    setSubjectsList(subjects);
    // Ustawianie stanu przedmiotów na podstawie pobranych danych
    const initialSelectedSubjects = subjects.reduce(
      (acc: { [key: number]: string }, subject: any) => {
        if (subject.price) {
          // Zakładamy, że 'price' jest przypisane w obiekcie przedmiotu
          acc[subject.subjectLevelId] = subject.price;
        }
        return acc;
      },
      {}
    );
    setSelectedSubjects(initialSelectedSubjects);
  }, [subjects]);

  const handleSubjectChange = (subjectLevelId: number, checked: boolean) => {
    setSelectedSubjects((prev) => {
      if (checked) {
        // Ustawiamy domyślną wartość '0' dla kosztów, jeśli zaznaczymy przedmiot
        return { ...prev, [subjectLevelId]: prev[subjectLevelId] || '0' };
      } else {
        // Usuwamy przedmiot z listy zaznaczonych, jeśli odznaczony
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
      alert('Nie wybrano przedmiotów.');
      return;
    }

    const responseStatus = await setTeacherSalary(teacherSalaries);

    if (responseStatus === 200) {
      alert('Przedmioty i koszty zostały pomyślnie zapisane');
      goToMenu(navigate);
    } else {
      alert('Nie udało się zapisać przedmiotów i kosztów');
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
      {subjectsList.length === 0 ? (
        <p>Brak dostępnych przedmiotów</p>
      ) : (
        subjectsList.map((subjectDTO) => (
          <div key={subjectDTO.subjectLevelId} className="subject-item">
            <label>
              <input
                type="checkbox"
                checked={!!selectedSubjects[subjectDTO.subjectLevelId]} // Sprawdzamy, czy przedmiot jest zaznaczony
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
                placeholder="Koszt"
                value={selectedSubjects[subjectDTO.subjectLevelId]}
                onChange={(e) =>
                  handleCostChange(subjectDTO.subjectLevelId, e.target.value)
                }
              />
            )}
          </div>
        ))
      )}
      <div className="button-container">
        <AppButton label="Powrót" onClick={() => goToTeacherMenu(navigate)} />
        <button onClick={handleSubmit}>Akceptuj</button>
      </div>
    </div>
  );
};

export default AddSubjectsPage;
