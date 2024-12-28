import React, { useState } from 'react';
import AppButton from '../components/AppButton';
import { useNavigate } from 'react-router-dom';
import { goToMenu } from '../lib/Navigate';
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

  const { subjects, loading, error, refresh } = useAllSubjectsAdmin();
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
      refresh();
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
      refresh();
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
      refresh();
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
      refresh();
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
      refresh();
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
      refresh();
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
      <div className="subject-management-page">
          <div className="subject-management-box">
              <h1>Lista przedmiotów.</h1>

              {loading ? (
                  <p>Ładowanie przedmiotów...</p>
              ) : error ? (
                  <p>Wystąpił błąd: {error}</p>
              ) : (
                  <div className="subject-management-container">
                      <div className="subject-management-column">
                          <div className="subject-management-title">Przedmiot</div>
                          {Object.keys(subjectsData).map((subject) => (
                              <button
                                  key={subject}
                                  className={`subject-management-button ${selectedSubject === subject ? 'selected' : ''
                                      }`}
                                  onClick={() => handleSubjectClick(subject)}
                              >
                                  {subject}
                              </button>
                          ))}
                          <button
                              className="subject-management-add-button"
                              onClick={() => setAddSubject((prev) => !prev)} // Przełączanie stanu
                          >
                              Dodaj nowy
                          </button>
                      </div>

                      {selectedSubject && (
                          <div className="subject-management-column">
                            <button
                        className="subject-management-add-button"
                        onClick={() => setDeleteSubject((prev) => !prev)} // Przełączanie stanu
                    >
                        Usuń przedmiot
                    </button>
                              <div className="subject-management-title">Kategoria</div>
                              {getCategories()
                                  .filter((category) => category !== 'Brak Kategorii')
                                  .map((category) => (
                                      <button
                                          key={category}
                                          className={`subject-management-button ${selectedCategory === category ? 'selected' : ''
                                              }`}
                                          onClick={() => handleCategoryClick(category)}
                                      >
                                          {category}
                                      </button>
                                  ))}
                              <button
                                  className="subject-management-add-button"
                                  onClick={() => setAddCategory((prev) => !prev)} // Przełączanie stanu
                              >
                                  Dodaj nową kategorię
                              </button>
                          </div>
                      )}

                      {selectedCategory && (
                          <div className="subject-management-column">
                            <button
                                  className="subject-management-add-button"
                                  onClick={() => setDeleteCategory((prev) => !prev)} // Przełączanie stanu
                              >
                                  Usuń kategorię
                              </button>
                              <div className="subject-management-title">Poziom</div>
                              {getLevels()
                                  .filter((levelData) => levelData.level !== 'Brak Poziomu')
                                  .map((levelData) => (
                                      <button
                                          key={levelData.id}
                                          className={`subject-management-button ${selectedLevel === levelData.level ? 'selected' : ''
                                              }`}
                                          onClick={() => handleLevelClick(levelData)}
                                      >
                                          {levelData.level}
                                      </button>
                                  ))}
                              <button
                                  className="subject-management-add-button"
                                  onClick={() => setAddLevel((prev) => !prev)} // Przełączanie stanu
                              >
                                  Dodaj nowy poziom
                              </button>
                              {selectedLevel && (
                        <button
                        className="subject-management-add-button"
                        onClick={() => setDeleteLevel((prev) => !prev)} // Przełączanie stanu
                    >
                        Usuń poziom
                    </button>
                      )}

                          </div>
                      )}

                      
                      {addSubject && (
                          <div className="subject-management-column">
                              <p>Dodaj przedmiot</p>
                              <input
                                  type="text"
                                  value={subjectName}
                                  onChange={(e) => setSubjectName(e.target.value)}
                                  placeholder="Nazwa przedmiotu"
                              />
                              <button
                                  className="subject-management-add-button"
                                  onClick={() => handleAddNewSubject()}
                              >
                                  Akceptuj
                              </button>
                          </div>
                      )}

                      {deleteSingleSubject && (
                          <div className="subject-management-column">
                              <p>Usuń przedmiot: {selectedSubject}</p>
                              <button
                                  className="subject-management-add-button"
                                  onClick={() => handleDeleteSubject()}
                              >
                                  Akceptuj
                              </button>
                          </div>
                      )}

                      {addCategory && (
                          <div className="subject-management-column">
                              <p>Dodaj kategorię do przedmiotu {selectedSubject}</p>
                              <input
                                  type="text"
                                  value={subjectCategoryName}
                                  onChange={(e) => setSubjectCategoryName(e.target.value)}
                                  placeholder="Nazwa kategorii"
                              />
                              <button
                                  className="subject-management-add-button"
                                  onClick={() => handleAddNewCategory()}
                              >
                                  Akceptuj
                              </button>
                          </div>
                      )}

                      {deleteCategory && (
                          <div className="subject-management-column">
                              <p>
                                  Usuń kategorię {selectedCategory} z przedmiotu {selectedSubject}
                              </p>
                              <button
                                  className="subject-management-add-button"
                                  onClick={() => handleDeletingCategory()}
                              >
                                  Akceptuj
                              </button>
                          </div>
                      )}

                      {addLevel && (
                          <div className="subject-management-column">
                              <p>
                                  Dodaj poziom do kategorii {selectedCategory} w przedmiocie{' '}
                                  {selectedSubject}
                              </p>
                              <input
                                  type="text"
                                  value={subjectLevelName}
                                  onChange={(e) => setSubjectLevelName(e.target.value)}
                                  placeholder="Nazwa poziomu"
                              />
                              <button
                                  className="subject-management-add-button"
                                  onClick={() => handleAddNewLevel()}
                              >
                                  Akceptuj
                              </button>
                          </div>
                      )}

                      {deleteLevel && (
                          <div className="subject-management-column">
                              <p>
                                  Usuń poziom {selectedLevel} z kategorii {selectedCategory} w
                                  przedmiocie {selectedSubject}
                              </p>
                              <button
                                  className="subject-management-add-button"
                                  onClick={() => handleDeletingLevel()}
                              >
                                  Akceptuj
                              </button>
                          </div>
                      )}
                  </div>
              )}

              <div className="button-container">
                  <AppButton label="Powrót" onClick={() => goToMenu(navigate)} />
              </div>
          </div>
      </div>



  );
};

export default SubjectListPage;
