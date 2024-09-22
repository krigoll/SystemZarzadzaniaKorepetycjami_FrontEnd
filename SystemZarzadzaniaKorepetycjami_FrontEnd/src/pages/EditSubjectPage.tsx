import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import './App.css';
import { RootState } from '../futures/store';
import AppButton from '../components/AppButton';
import { goToTeacherMenu } from '../lib/Navigate';
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
    setSubjectsList(subjects);
    const initialSelectedSubjects = subjects.reduce(
      (acc: { [key: number]: string }, subject: any) => {
        if (subject.price) {
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
        return { ...prev, [subjectLevelId]: prev[subjectLevelId] || '0' };
      } else {
        setSubjectsList((prevList) =>
          prevList.map((subject) =>
            subject.subjectLevelId === subjectLevelId
              ? { ...subject, price: 0 }
              : subject
          )
        );
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
    setSubjectsList((prevList) =>
      prevList.map((subject) =>
        subject.subjectLevelId === subjectLevelId
          ? { ...subject, price: Number(cost) }
          : subject
      )
    );
  };

  const handleSubmit = async () => {
    const teacherSalaries = subjectsList.map((subject) => ({
      subject_LevelId: Number(subject.subjectLevelId),
      personEmail: email,
      hourlyRate: Number(subject.price),
    }));
    const responseStatus = await setTeacherSalary(teacherSalaries);

    if (responseStatus === 200) {
      alert('Przedmioty i koszty zostały pomyślnie zapisane');
      goToTeacherMenu(navigate);
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
                placeholder="Koszt"
                value={selectedSubjects[subjectDTO.subjectLevelId] || ''}
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
