import React, { useState } from 'react';
import './App.css';

const subjectsList = [
  'Matematyka',
  'Fizyka',
  'Chemia',
  'Biologia',
  'Historia',
  'Język Polski',
  'Język Angielski',
];

const AddSubjectsPage: React.FC = () => {
  const [selectedSubjects, setSelectedSubjects] = useState<{
    [subject: string]: string;
  }>({});

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
