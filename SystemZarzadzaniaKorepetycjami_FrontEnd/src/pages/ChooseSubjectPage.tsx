import React, { useState } from 'react';
import AppButton from '../components/AppButton';
import { useNavigate } from 'react-router-dom';
import { goToChooseTeacherPage, goToMenu } from '../lib/Navigate';
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

const ChooseSubjectPage: React.FC = () => {
    const navigate = useNavigate();
    const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
    const [selectedCategory, setSelectedCategory] = useState<Category | null>(
        null
    );
    const [selectedLevel, setSelectedLevel] = useState<Level | null>(null);

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
    };

    const handleCategoryClick = (category: Category) => {
        setSelectedCategory(category);
        setSelectedLevel(null);
    };

    const handleLevelClick = (selectedCategory: string, levelData: LevelData) => {
        setSelectedLevel(levelData.level);
        goToChooseTeacherPage(
            navigate,
            selectedCategory + ' ' + levelData.level + ' ' + levelData.id
        );
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
            <div className="choose-subject-box">
                <h1>Wybierz przedmiot, na który chcesz się zapisać.</h1>
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

export default ChooseSubjectPage;
