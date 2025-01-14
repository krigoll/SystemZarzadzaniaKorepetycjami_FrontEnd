import React, { useState } from 'react';
import AppButton from '../components/AppButton';
import { useNavigate, useParams } from 'react-router-dom';
import { goToChooseSubjectPage, goToSignUpToLessonPage } from '../lib/Navigate';
import { DataToSignUpToLesson } from '../types/DataToSignUpToLesson';
import { useTeachersForLevel } from '../lib/useTeachersForLevel';
import { useSelector } from 'react-redux';
import { RootState } from '../futures/store';

interface Teacher {
  id: number;
  name: string;
  price: number;
  image: File | null;
  avgOpinion: number;
}

const ChooseTeacherPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const subjectLevelId = Number(id?.split(' ')[2]);
  const email = useSelector((state: RootState) => state.login.email);

  const { teachers, loading, error } = useTeachersForLevel(
    subjectLevelId,
    email
  );

  const [sortOption, setSortOption] = useState('name');

  const handleSignUpToLesson = (teacher: Teacher) => {
    const dataToSignUpToLesson: DataToSignUpToLesson = {
      teacherId: teacher.id,
      name: teacher.name,
      price: teacher.price,
      image: teacher.image,
      subjectInfo: id,
    };
    goToSignUpToLessonPage(navigate, dataToSignUpToLesson);
  };

  const sortedTeachers = [...teachers].sort((a, b) => {
    if (sortOption === 'name') {
      return a.name.localeCompare(b.name);
    } else if (sortOption === 'price') {
      return a.price - b.price;
    } else if (sortOption === 'avgOpinion') {
      return b.avgOpinion - a.avgOpinion;
    }
    return 0;
  });

  if (loading) {
    return <p>Ładowanie...</p>;
  }

  if (error) {
    return <p>Błąd: {error}</p>;
  }

  return (
    <div className="teacher-list-page">
      <div className="teacher-list-box">
        <h1>
          Lista Nauczycieli dla: {id?.split(' ')[0] + ' ' + id?.split(' ')[1]}
        </h1>
        <div className="sort-container">
          <label htmlFor="sort">Sortuj według:</label>
          <select
            id="sort"
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
          >
            <option value="name">Imię</option>
            <option value="price">Cena</option>
            <option value="avgOpinion">Ocena</option>
          </select>
        </div>
        <div className="teacher-list">
          {sortedTeachers.length === 0 ? (
            <div className="no-teachers">Brak nauczycieli</div>
          ) : (
            sortedTeachers.map((teacher) => (
              <div key={teacher.id} className="teacher-item">
                <div className="teacher-info">
                  <div className="teacher-name">
                    {teacher.name}, {teacher.price} zł, Średnia ocena:{' '}
                    {teacher.avgOpinion === 0
                      ? 'Brak'
                      : teacher.avgOpinion + '/5'}
                  </div>
                </div>
                <div className="teacher-photo">
                  {teacher.image ? (
                    <img
                      src={URL.createObjectURL(teacher.image)}
                      alt={`${teacher.name}`}
                    />
                  ) : null}
                </div>
                <div className="teacher-actions">
                  <AppButton
                    label="Dalej"
                    onClick={() => handleSignUpToLesson(teacher)}
                  />
                </div>
              </div>
            ))
          )}
        </div>
        <div className="button-container">
          <AppButton
            label="Powrót"
            onClick={() => goToChooseSubjectPage(navigate)}
          />
        </div>
      </div>
    </div>
  );
};

export default ChooseTeacherPage;
