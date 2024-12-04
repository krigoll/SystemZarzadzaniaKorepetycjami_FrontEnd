import React, { useState } from 'react';
import AppButton from '../components/AppButton';
import { useNavigate } from 'react-router-dom';
import { goToAdminMenuPage } from '../lib/Navigate';
import { useAllSubjects } from '../lib/useAllSubjects';

interface LevelData {
  level: string;
  id: number;
}

interface CategoryData {
  [category: string]: LevelData[];
}

interface SubjectsData {
  [subject: string]: CategoryData;
}

type Subject = string;
type Category = string;
type Level = string;

const SubjectListPage: React.FC = () => {
  const navigate = useNavigate();
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null
  );
  const [selectedLevel, setSelectedLevel] = useState<Level | null>(null);
  const [addSubject, setAddSubject] = useState<boolean>(false);
    const [addCategory, setAddCategory] = useState<boolean>(false);
    const [addLevel, setAddLevel] = useState<boolean>(false);
    const [deleteSubject, setDeleteSubject] = useState<boolean>(false);
    const [deleteCategory, setDeleteCategory] = useState<boolean>(false);
    const [deleteLevel, setDeleteLevel] = useState<boolean>(false);
    const [subjectName, setSubjectName] = useState<string>("");
    const [subjectCategoryName, setSubjectCategoryName] = useState<string>("");
    const [subjectLevelName, setSubjectLevelName] = useState<string>("");

  const { subjects, loading, error } = useAllSubjects();

  const processSubjectsData = (
    data: { subjectFullName: string; subjectLevelId: number }[]
  ): SubjectsData => {
    const subjectsData: SubjectsData = {};

    data.forEach(({ subjectFullName, subjectLevelId }) => {
      const [subject, category, level] = subjectFullName
        .split(',')
        .map((part) => part.trim());

      if (!subjectsData[subject]) {
        subjectsData[subject] = {};
      }

      if (!subjectsData[subject][category]) {
        subjectsData[subject][category] = [];
      }

      if (
        !subjectsData[subject][category].some((item) => item.level === level)
      ) {
        subjectsData[subject][category].push({ level, id: subjectLevelId });
      }
    });

    return subjectsData;
  };

  const subjectsData = processSubjectsData(subjects);

  const handleSubjectClick = (subject: Subject) => {
    setSelectedSubject(subject);
    setSelectedCategory(null);
    setSelectedLevel(null);
    setAddSubject(false);
    setAddCategory(false);
    setAddLevel(false);
    setDeleteCategory(false);
    setDeleteLevel(false);
    setDeleteSubject(false);
  };

  const handleCategoryClick = (category: Category) => {
    setSelectedCategory(category);
    setSelectedLevel(null);
    setAddSubject(false);
    setAddCategory(false);
    setAddLevel(false);
    setDeleteCategory(false);
    setDeleteLevel(false);
    setDeleteSubject(false);
  };

  const handleLevelClick = (selectedCategory: string, levelData: LevelData) => {
    setSelectedLevel(levelData.level);
    setAddSubject(false);
    setAddCategory(false);
    setAddLevel(false);
    setDeleteCategory(false);
    setDeleteLevel(false);
    setDeleteSubject(false);
  };

  const handleAddNewSubject = () => {
    console.log(`Add new subject functionality ${subjectName}`);
  };

  const handleAddNewCategory = () => {
    if (!selectedSubject) {
      console.error('No subject selected. Cannot add a new category.');
      return;
    }
    console.log(`Adding a new category to subject: ${selectedSubject}`);
    // Implement logic to add a new category for the selected subject
    setAddCategory(true);
  };

  const handleDeleteSubject = () => {
    if (!selectedSubject) {
      console.error('No subject selected');
      return;
    }
    console.log(`Deleting a subject: ${selectedSubject}`);
    // Implement logic to add a new category for the selected subject
    setDeleteSubject(true);
  };

  const handleAddNewLevel = () => {
    if (!selectedSubject || !selectedCategory) {
      console.error(
        'Subject or category not selected. Cannot add a new level.'
      );
      return;
    }
    console.log(
      `Adding a new level to subject: ${selectedSubject}, category: ${selectedCategory}`
    );
    // Implement logic to add a new level for the selected subject and category
    setAddLevel(true);
  };

  const handleDeletingCategory = () => {
    if (!selectedSubject || !selectedCategory) {
      console.error(
        'Subject or category not selected.'
      );
      return;
    }
    console.log(
      `Deleting subject: ${selectedSubject}, category: ${selectedCategory}`
    );
    // Implement logic to add a new level for the selected subject and category
    setDeleteCategory(true);
  };

  const handleDeletingLevel = () => {
    if (!selectedSubject || !selectedCategory || !selectedLevel) {
      console.error(
        'Subject or category not selected.'
      );
      return;
    }
    console.log(
      `Deleting subject: ${selectedSubject}, category: ${selectedCategory}, level ${selectedLevel}`
    );
    setDeleteLevel(true);
  };

  const getCategories = (): string[] => {
    if (selectedSubject && subjectsData[selectedSubject]) {
      return Object.keys(subjectsData[selectedSubject]);
    }
    return [];
  };

  const getLevels = (): LevelData[] => {
    if (selectedSubject && selectedCategory && subjectsData[selectedSubject]) {
      return subjectsData[selectedSubject][selectedCategory] || [];
    }
    return [];
  };

  return (
    <div className="choose-subject-page">
      <h1>Lista przedmiotów.</h1>

      {loading ? (
        <p>Ładowanie przedmiotów...</p>
      ) : error ? (
        <p>Wystąpił błąd: {error}</p>
      ) : (
        <div className="selection-container">
          <div className="subject-selection">
            <div className="title">Przedmiot</div>
            {Object.keys(subjectsData).map((subject) => (
              <button
                key={subject}
                className={`option-button ${selectedSubject === subject ? 'selected' : ''}`}
                onClick={() => handleSubjectClick(subject)}
              >
                {subject}
              </button>
            ))}
            <button className="add-button" onClick={() => setAddSubject(true)}>
              Dodaj nowy
            </button>
          </div>
          {selectedSubject && (
            <div className="category-selection">
              <div className="title">Kategoria</div>
              {getCategories().map((category) => (
                <button
                  key={category}
                  className={`option-button ${selectedCategory === category ? 'selected' : ''}`}
                  onClick={() => handleCategoryClick(category)}
                >
                  {category}
                </button>
              ))}
              <button
                className="add-button"
                onClick={() => setAddCategory(true)}
              >
                Dodaj nową kategorię
              </button>
              <button
                className="add-button"
                onClick={() => setDeleteCategory(true)}
              >
                Usuń przedmiot
              </button>
            </div>
          )}
          {selectedCategory && (
            <div className="level-selection">
              <div className="title">Poziom</div>
              {getLevels().map((levelData) => (
                <button
                  key={levelData.id}
                  className={`option-button ${selectedLevel === levelData.level ? 'selected' : ''}`}
                  onClick={() => handleLevelClick(selectedCategory, levelData)}
                >
                  {selectedCategory} {levelData.level}
                </button>
              ))}
              <button className="add-button" onClick={() => setAddLevel(true)}>
                Dodaj nowy poziom
              </button>
              <button className="add-button" onClick={() => setDeleteCategory(true)}>
                Usuń kategorię
              </button>
            </div>
          )}
          {selectedLevel && (
            <button className="add-button" onClick={() => setDeleteLevel(true)}>
            Usuń poziom
          </button>
          )}
          {addSubject && (
           <div>
            Dodaj przedmiot
            <input 
            type="text" 
            value={subjectName}
            onChange={(e) => setSubjectName(e.target.value)}
          />
          <button className="add-button" onClick={() => handleAddNewSubject()}>
            akceptuj
          </button>
           </div>
          )}
          {addCategory && (
           <div>
            Dodaj kategorię
            <input 
            type="text" 
            value={subjectCategoryName}
            onChange={(e) => setSubjectCategoryName(e.target.value)}
          />
          <button className="add-button" onClick={() => handleAddNewCategory()}>
            akceptuj
          </button>
           </div>
          )}
          {addLevel && (
           <div>
            Dodaj poziom
            <input 
            type="text" 
            value={subjectLevelName}
            onChange={(e) => setSubjectLevelName(e.target.value)}
          />
          <button className="add-button" onClick={() => handleAddNewLevel()}>
            akceptuj
          </button>
           </div>
          )}
          {deleteSubject && (
           <div>
            Usuń przedmiot {selectedSubject} 
            <button className="add-button" onClick={() => handleDeleteSubject()}>
            akceptuj
          </button>
           </div>
          )}
          {deleteCategory && (
           <div>
            Usuń kategorię {selectedCategory} przedmotu {selectedSubject}
            <button className="add-button" onClick={() => handleDeletingCategory()}>
            akceptuj
          </button>
           </div>
          )}
          {deleteLevel && (
           <div>
            Usuń poziom {selectedLevel} kategorji {selectedCategory} poziomu {selectedSubject}
            <button className="add-button" onClick={() => handleDeletingLevel()}>
            akceptuj
          </button>
           </div>
          )}
        </div>
      )}
      <div className="button-container">
        <AppButton label="Powrót" onClick={() => goToAdminMenuPage(navigate)} />
      </div>
    </div>
  );
};

export default SubjectListPage;
