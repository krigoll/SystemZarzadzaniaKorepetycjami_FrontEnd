import React, { useEffect, useState } from 'react';
import AppButton from '../components/AppButton';
import { useSelector } from 'react-redux';
import { RootState } from '../futures/store';
import { getTeachersForLevel } from '../lib/API';
import { useNavigate, useParams } from 'react-router-dom';
import {
  // goToStudentMenu,
  // goToFiltersPage,
  // goToTeacherDetailsPage,
  goToChooseSubjectPage, goToSignUpToLessonPage,
} from '../lib/Navigate';
import { DataToSignUpToLesson } from '../types/DataToSignUpToLesson';

interface Teacher {
  id: number;
  name: string;
  price: number;
  image: File | null;
}

const ChooseTeacherPage: React.FC = () => {
  const navigate = useNavigate();
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const token = useSelector((state: RootState) => state.login.jwtToken);
  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    const fetchTeachers = async () => {
      const data = await getTeachersForLevel(Number(id?.split(' ')[2]), token);
      setTeachers(data);
      console.log(data);
      console.log(teachers);
    };

    fetchTeachers();
  }, [token, id]);

const handleSingUpToLesson = (teacher: Teacher) =>{
  const DataToSignUpToLesson: DataToSignUpToLesson = {
    teacherId: teacher.id,
    name: teacher.name,
    price: teacher.price,
    image: teacher.image,
    subjectInfo: id
  }
  goToSignUpToLessonPage(navigate, DataToSignUpToLesson);
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
                onClick={() => handleSingUpToLesson(teacher)}
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
