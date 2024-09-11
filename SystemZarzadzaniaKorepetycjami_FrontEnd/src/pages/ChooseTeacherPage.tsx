import React from 'react';
import AppButton from '../components/AppButton';
import { useSelector } from 'react-redux';
import { RootState } from '../futures/store';
import { useNavigate, useParams } from 'react-router-dom';
import { goToChooseSubjectPage, goToSignUpToLessonPage } from '../lib/Navigate';
import { DataToSignUpToLesson } from '../types/DataToSignUpToLesson';
import { useTeachersForLevel } from '../lib/useTeachersForLevel'; // The hook to fetch teachers

interface Teacher {
  id: number;
  name: string;
  price: number;
  image: File | null;
}

const ChooseTeacherPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const token = useSelector((state: RootState) => state.login.jwtToken);

  const subjectCategoryId = Number(id?.split(' ')[2]);

  // Use the useTeachersForLevel hook to fetch teachers
  const { teachers, loading, error } = useTeachersForLevel(
    subjectCategoryId,
    token
  );

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

  if (loading) {
    return <p>Loading teachers...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <div className="teacher-list-page">
      <h1>
        Lista Nauczycieli dla: {id?.split(' ')[0] + ' ' + id?.split(' ')[1]}
      </h1>
      <div className="teacher-list">
        {teachers.map((teacher) => (
          <div key={teacher.id} className="teacher-item">
            <div className="teacher-info">
              <div className="teacher-name">
                {teacher.name}, {teacher.price} zł
              </div>
            </div>
            <div className="teacher-photo">
              {teacher.image ? (
                <img
                  src={URL.createObjectURL(teacher.image)}
                  alt={`${teacher.name}`}
                />
              ) : (
                '[Brak Zdjęcia]'
              )}
            </div>
            <div className="teacher-actions">
              <AppButton
                label="Dalej"
                onClick={() => handleSignUpToLesson(teacher)}
              />
            </div>
          </div>
        ))}
      </div>
      <div className="button-container">
        <AppButton
          label="Powrót"
          onClick={() => goToChooseSubjectPage(navigate)}
        />
        {/* <AppButton label="Filtry" onClick={() => goToFiltersPage(navigate)} /> */}
      </div>
    </div>
  );
};

export default ChooseTeacherPage;
