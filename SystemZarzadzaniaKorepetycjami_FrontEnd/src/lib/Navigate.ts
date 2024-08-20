import { NavigateFunction } from 'react-router-dom';
import { DataToEdit } from '../types/DataToEdit';

function goToLogin(navigate: NavigateFunction) {
  navigate('/login');
}

function goToRegistration(navigate: NavigateFunction) {
  navigate('/registration');
}

function goToMainPage(navigate: NavigateFunction) {
  navigate('/');
}

function goToAddSubject(navigate: NavigateFunction) {
  navigate('/addSubjects');
}

function goToMenu(navigate: NavigateFunction) {
  navigate('/menu');
}

function goToProfile(navigate: NavigateFunction) {
  navigate('/profile');
}

function goToEditProfile(navigate: NavigateFunction, dataToEdit: DataToEdit) {
  navigate('/profile/edit', { state: { dataToEdit } })
}

function goToStudentMenu(navigate: NavigateFunction) {
    navigate('/student');
}

function goToTeacherMenu(navigate: NavigateFunction) {
    navigate('/teacher');
}

function goToDeterminingAvailabilty(navigate: NavigateFunction) {
    navigate(`/teacher/determiningAvailabilty`);
}

export { goToLogin, goToRegistration, goToMainPage, goToAddSubject, goToMenu, goToProfile, goToEditProfile, goToStudentMenu, goToTeacherMenu, goToDeterminingAvailabilty };
