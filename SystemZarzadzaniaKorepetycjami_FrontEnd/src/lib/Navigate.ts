import { NavigateFunction } from 'react-router-dom';
import { DataToEdit } from '../types/DataToEdit';
import { DataToSignUpToLesson } from '../types/DataToSignUpToLesson';

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
    navigate('/profile/edit', { state: { dataToEdit } });
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

function goToChooseSubjectPage(navigate: NavigateFunction) {
    navigate(`/student/chooseSubject`);
}

function goToChooseTeacherPage(
    navigate: NavigateFunction,
    idSubjectLevel: string
) {
    navigate(`/student/chooseSubject/${idSubjectLevel}`);
}

function goToSignUpToLessonPage(
    navigate: NavigateFunction,
    DataToSignUpToLesson: DataToSignUpToLesson
) {
    navigate('/student/signUpToLesson', { state: { DataToSignUpToLesson } });
}

function goToRequestsPage(navigate: NavigateFunction) {
    navigate(`/teacher/requests`);
}

function goToEditSubjectPage(navigate: NavigateFunction) {
    navigate(`/teacher/editSubject`);
}

export {
    goToLogin,
    goToRegistration,
    goToMainPage,
    goToAddSubject,
    goToMenu,
    goToProfile,
    goToEditProfile,
    goToStudentMenu,
    goToTeacherMenu,
    goToDeterminingAvailabilty,
    goToChooseSubjectPage,
    goToChooseTeacherPage,
    goToSignUpToLessonPage,
    goToRequestsPage,
    goToEditSubjectPage
};
