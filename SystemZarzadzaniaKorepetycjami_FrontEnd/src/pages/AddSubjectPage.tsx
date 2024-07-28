import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import './App.css';
import { getAllSubjects } from '../lib/API';
import { RootState } from '../futures/store';

const AddSubjectsPage: React.FC = () => {
  const [subjectsList, setSubjectsList] = useState<string[]>([]);
  const [selectedSubjects, setSelectedSubjects] = useState<{
    [subject: string]: string;
  }>({});

  const token = useSelector((state: RootState) => state.login.jwtToken);

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const subjects = await getAllSubjects(token);
        setSubjectsList(subjects.map((subject: any) => subject.name));
      } catch (error) {
        console.error('Error fetching subjects:', error);
      }
    };

    fetchSubjects();
  }, [token]);

  const handleSubjectChange = (subject: string, checked: boolean) => {
    setSelectedSubjects((prev) => {
      if (checked) {
        return { ...prev, [subject]: '0' };
      } else {
        const { [subject]: _, ...rest } = prev;
        return rest;
      }
    });
  };

  const handleCostChange = (subject: string, cost: string) => {
    setSelectedSubjects((prev) => ({
      ...prev,
      [subject]: cost,
    }));
  };

  const handleSubmit = () => {
    // Implement submission logic here
    alert('Subjects and costs submitted');
  };

  const handleBack = () => {
    // Implement back navigation logic here
    alert('Going back');
  };

  return (
    <div className="subjects-container">
      <h1>Dodaj Przedmioty i Koszty</h1>
      {subjectsList.map((subject) => (
        <div key={subject} className="subject-item">
          <label>
            <input
              type="checkbox"
              checked={!!selectedSubjects[subject]}
              onChange={(e) => handleSubjectChange(subject, e.target.checked)}
            />
            {subject}
          </label>
          {selectedSubjects[subject] !== undefined && (
            <input
              type="text"
              placeholder="Koszt"
              value={selectedSubjects[subject]}
              onChange={(e) => handleCostChange(subject, e.target.value)}
            />
          )}
        </div>
      ))}
      <div className="button-container">
        <button onClick={handleBack}>Powrót</button>
        <button onClick={handleSubmit}>Akceptuj</button>
      </div>
    </div>
  );
};

export default AddSubjectsPage;
