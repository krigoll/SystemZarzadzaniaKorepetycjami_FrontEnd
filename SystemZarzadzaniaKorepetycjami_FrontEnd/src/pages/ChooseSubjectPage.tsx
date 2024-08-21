import React, { useEffect, useState } from 'react';
import AppButton from '../components/AppButton';
import { useSelector } from 'react-redux';
import { RootState } from '../futures/store';
import { getAllSubjects } from '../lib/API';
import { goToChooseTeacherPage, goToStudentMenu } from '../lib/Navigate';
import { useNavigate } from 'react-router-dom';

// Typy dla danych przedmiotów
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

// Typy dla stanów komponentu
type Subject = string;
type Category = string;
type Level = string;

const ChooseSubjectPage: React.FC = () => {
    const navigate = useNavigate();
    const [subjectsData, setSubjectsData] = useState<SubjectsData>({});
    const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
    const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
    const [selectedLevel, setSelectedLevel] = useState<Level | null>(null);
   //const [subjectLevelId, setSubjectLevelId] = useState<number | null>(null); // Nowy stan

    const token = useSelector((state: RootState) => state.login.jwtToken);

    useEffect(() => {
        const fetchSubjects = async () => {
            try {
                const data = await getAllSubjects(token);
                const subjectsData = processSubjectsData(data);
                setSubjectsData(subjectsData);
            } catch (error) {
                console.error('Error fetching subjects:', error);
            }
        };

        fetchSubjects();
    }, [token]);

    // Funkcja przetwarzaj¹ca dane na obiekt SubjectsData
    const processSubjectsData = (data: { subjectFullName: string; subjectLevelId: number }[]): SubjectsData => {
        const subjectsData: SubjectsData = {};

        data.forEach(({ subjectFullName, subjectLevelId }) => {
            const [subject, category, level] = subjectFullName.split(',').map(part => part.trim());

            if (!subjectsData[subject]) {
                subjectsData[subject] = {};
            }

            if (!subjectsData[subject][category]) {
                subjectsData[subject][category] = [];
            }

            if (!subjectsData[subject][category].some(item => item.level === level)) {
                subjectsData[subject][category].push({ level, id: subjectLevelId });
            }
        });

        return subjectsData;
    };

    const handleSubjectClick = (subject: Subject) => {
        setSelectedSubject(subject);
        setSelectedCategory(null);
        setSelectedLevel(null);
    };

    const handleCategoryClick = (category: Category) => {
        setSelectedCategory(category);
        setSelectedLevel(null);
    };

    const handleLevelClick = (levelData: LevelData) => {
        setSelectedLevel(levelData.level);
        //setSubjectLevelId(levelData.id); // Ustawienie subjectLevelId
        goToChooseTeacherPage(navigate, levelData.id); // Wywo³anie funkcji z levelData.id
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
            <h1>Wybierz przedmiot, na który chcesz siê zapisaæ.</h1>
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
                                onClick={() => handleLevelClick(levelData)}
                            >
                                {selectedCategory} {levelData.level}
                            </button>
                        ))}
                    </div>
                )}
            </div>
            <div className="button-container">
                <AppButton label="Powrót" onClick={() => goToStudentMenu(navigate)} />
            </div>
        </div>
    );
};

export default ChooseSubjectPage;
