import React, { useState } from 'react';
import AppButton from '../components/AppButton';
import { useNavigate } from 'react-router-dom';
import { goToAdminMenuPage } from '../lib/Navigate';
import { useAllSubjectsAdmin } from '../lib/useAllSubjectsAdmin';
import {
  useAddSubject,
  useAddSubjectCategory,
  useAddSubjectLevel,
  useSubjectCategoryDelete,
  useSubjectDelete,
  useSubjectLevelDelete,
} from '../lib/useSubjects';

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
  const [deleteSingleSubject, setDeleteSubject] = useState<boolean>(false);
  const [deleteCategory, setDeleteCategory] = useState<boolean>(false);
  const [deleteLevel, setDeleteLevel] = useState<boolean>(false);
  const [subjectName, setSubjectName] = useState<string>('');
  const [subjectCategoryName, setSubjectCategoryName] = useState<string>('');
  const [subjectLevelName, setSubjectLevelName] = useState<string>('');

  const { subjects, loading, error } = useAllSubjectsAdmin();
  const { addSubject: addSubjectAPI } = useAddSubject();
  const { addSubjectCategory } = useAddSubjectCategory();
  const { addSubjectLevel: addSubjectLevel } = useAddSubjectLevel();
  const { deleteSubject } = useSubjectDelete();
  const { deleteSubjectCategory } = useSubjectCategoryDelete();
  const { deleteLevelCategory } = useSubjectLevelDelete();

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
    setDeleteSubject(false);
    setDeleteCategory(false);
    setDeleteLevel(false);
  };

  const handleCategoryClick = (category: Category) => {
    setSelectedCategory(category);
    setSelectedLevel(null);
    setAddSubject(false);
    setAddCategory(false);
    setAddLevel(false);
    setDeleteSubject(false);
    setDeleteCategory(false);
    setDeleteLevel(false);
  };

  const handleLevelClick = (levelData: LevelData) => {
    setSelectedLevel(levelData.level);
    setAddSubject(false);
    setAddCategory(false);
    setAddLevel(false);
    setDeleteSubject(false);
    setDeleteCategory(false);
    setDeleteLevel(false);
  };

  const handleAddNewSubject = async () => {
    try {
      await addSubjectAPI(subjectName);
      console.log(`Added new subject: ${subjectName}`);
      setAddSubject(false);
    } catch (err) {
      console.error('Error adding subject:', err);
    }
  };

  const handleAddNewCategory = async () => {
    if (!selectedSubject) return;
    try {
      await addSubjectCategory({
        subjectName: selectedSubject,
        subjectCategoryName,
      });
      console.log(
        `Added new category "${subjectCategoryName}" to subject: ${selectedSubject}`
      );
      setAddCategory(false);
    } catch (err) {
      console.error('Error adding category:', err);
    }
  };

  const handleAddNewLevel = async () => {
    if (!selectedSubject || !selectedCategory) return;
    try {
      await addSubjectLevel({
        subjectName: selectedSubject,
        subjectCategoryName: selectedCategory,
        subjectLevelName: subjectLevelName,
      });
      console.log(
        `Added new level "${subjectLevelName}" to category: ${selectedCategory}`
      );
      setAddLevel(false);
    } catch (err) {
      console.error('Error adding level:', err);
    }
  };

  const handleDeleteSubject = async () => {
    if (!selectedSubject) return;
    try {
      await deleteSubject(selectedSubject);
      console.log(`Deleted subject: ${selectedSubject}`);
      setDeleteSubject(false);
    } catch (err) {
      console.error('Error deleting subject:', err);
    }
  };

  const handleDeletingCategory = async () => {
    if (!selectedSubject || !selectedCategory) return;
    try {
      await deleteSubjectCategory({
        subjectName: selectedSubject,
        subjectCategoryName: selectedCategory,
      });
      console.log(
        `Deleted category "${selectedCategory}" from subject: ${selectedSubject}`
      );
      setDeleteCategory(false);
    } catch (err) {
      console.error('Error deleting category:', err);
    }
  };

  const handleDeletingLevel = async () => {
    if (!selectedSubject || !selectedCategory || !selectedLevel) return;
    try {
      await deleteLevelCategory({
        subjectName: selectedSubject,
        subjectCategoryName: selectedCategory,
        subjectLevelName: selectedLevel,
      });
      console.log(
        `Deleted level "${selectedLevel}" from category: ${selectedCategory}`
      );
      setDeleteLevel(false);
    } catch (err) {
      console.error('Error deleting level:', err);
    }
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
              {getCategories()
                .filter((category) => category !== 'Brak Kategorii')
                .map((category) => (
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
                onClick={() => setDeleteSubject(true)}
              >
                Usuń przedmiot
              </button>
            </div>
          )}
          {selectedCategory && (
            <div className="level-selection">
              <div className="title">Poziom</div>
              {getLevels()
                .filter((levelData) => levelData.level !== 'Brak Poziomu')
                .map((levelData) => (
                  <button
                    key={levelData.id}
                    className={`option-button ${selectedLevel === levelData.level ? 'selected' : ''}`}
                    onClick={() => handleLevelClick(levelData)}
                  >
                    {selectedCategory} {levelData.level}
                  </button>
                ))}
              <button className="add-button" onClick={() => setAddLevel(true)}>
                Dodaj nowy poziom
              </button>
              <button
                className="add-button"
                onClick={() => setDeleteCategory(true)}
              >
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
              <button
                className="add-button"
                onClick={() => handleAddNewSubject()}
              >
                akceptuj
              </button>
            </div>
          )}
          {addCategory && (
            <div>
              Dodaj kategorię do przedmiotu {selectedSubject}
              <input
                type="text"
                value={subjectCategoryName}
                onChange={(e) => setSubjectCategoryName(e.target.value)}
              />
              <button
                className="add-button"
                onClick={() => handleAddNewCategory()}
              >
                akceptuj
              </button>
            </div>
          )}
          {addLevel && (
            <div>
              Dodaj poziom do kategorji {selectedCategory} w przedmiocie{' '}
              {selectedSubject}
              <input
                type="text"
                value={subjectLevelName}
                onChange={(e) => setSubjectLevelName(e.target.value)}
              />
              <button
                className="add-button"
                onClick={() => handleAddNewLevel()}
              >
                akceptuj
              </button>
            </div>
          )}
          {deleteSingleSubject && (
            <div>
              Usuń przedmiot {selectedSubject}
              <button
                className="add-button"
                onClick={() => handleDeleteSubject()}
              >
                akceptuj
              </button>
            </div>
          )}
          {deleteCategory && (
            <div>
              Usuń kategorię {selectedCategory} przedmotu {selectedSubject}
              <button
                className="add-button"
                onClick={() => handleDeletingCategory()}
              >
                akceptuj
              </button>
            </div>
          )}
          {deleteLevel && (
            <div>
              Usuń poziom {selectedLevel} kategorji {selectedCategory} poziomu{' '}
              {selectedSubject}
              <button
                className="add-button"
                onClick={() => handleDeletingLevel()}
              >
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
