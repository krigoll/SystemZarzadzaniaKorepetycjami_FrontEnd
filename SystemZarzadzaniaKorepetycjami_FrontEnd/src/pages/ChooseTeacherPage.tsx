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
  goToChooseSubjectPage,
} from '../lib/Navigate';

interface Teacher {
  id: number;
  name: string;
  price: number;
  image: File;
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
                '[Zdjęcie]'
              )}
            </div>
            <div className="teacher-actions">
              <AppButton
                label="Dalej"
                // onClick={() => goToTeacherDetailsPage(navigate, teacher.id)}
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
