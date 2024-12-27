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

function goToDeleteAccountPage(navigate: NavigateFunction) {
  navigate(`/profile/deleteAccount`);
}

function goToCalendarPage(navigate: NavigateFunction, dateDay: string) {
  navigate(`/calendar/${dateDay}`);
}

function goToLessonDetailsPage(navigate: NavigateFunction, lessonId: number) {
  navigate(`/lessonDetails/${lessonId}`);
}

function goToChat(navigate: NavigateFunction) {
  navigate(`/chat`);
}

function goToTeachersReviewsListPage(navigate: NavigateFunction) {
  navigate(`/teachersReviewsList`);
}

function goToAddReviewPage(navigate: NavigateFunction, teacherInfo: string) {
  navigate(`/addReview/${teacherInfo}`);
}

function goToTeacherOpinionPage(navigate: NavigateFunction) {
  navigate(`/teacher/myOpinion`);
}

function goToAdminMenuPage(navigate: NavigateFunction) {
  navigate(`/admin`);
}

function goToUserListPage(navigate: NavigateFunction) {
  navigate(`/admin/userList`);
}

function goToSubjectListPage(navigate: NavigateFunction) {
  navigate(`/admin/subjectList`);
}

function goToNewReportFormPage(navigate: NavigateFunction) {
  navigate(`/report/new`);
}

function goToReportListPage(navigate: NavigateFunction) {
  navigate(`/report`);
}

function goToReportDetailsPage(navigate: NavigateFunction, reportId: number) {
  navigate(`/report/${reportId}`);
}

function goToUserDetailsPage(navigate: NavigateFunction, idPerson: number) {
  navigate(`/admin/userList/${idPerson}`);
}

function goToTestsPage(navigate: NavigateFunction) {
  navigate(`/teacher/tests`);
}

function goToTestsDetailsPage(
  navigate: NavigateFunction,
  idTest: number | null
) {
  navigate(`/teacher/tests/${idTest}`);
}

function goToGiveTestToStudentPage(
  navigate: NavigateFunction,
  idTest: number | null
) {
  navigate(`/teacher/tests/${idTest}/student`);
}

function goToTestTeacherPage(navigate: NavigateFunction) {
  navigate(`/teacher/givenTersts`);
}

function goToTestStudentPage(navigate: NavigateFunction) {
  navigate(`/student/givenTersts`);
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
  goToEditSubjectPage,
  goToDeleteAccountPage,
  goToCalendarPage,
  goToLessonDetailsPage,
  goToChat,
  goToTeachersReviewsListPage,
  goToAddReviewPage,
  goToTeacherOpinionPage,
  goToAdminMenuPage,
  goToUserListPage,
  goToSubjectListPage,
  goToNewReportFormPage,
  goToReportListPage,
  goToReportDetailsPage,
  goToUserDetailsPage,
  goToTestsPage,
  goToTestsDetailsPage,
  goToGiveTestToStudentPage,
  goToTestTeacherPage,
  goToTestStudentPage,
};
