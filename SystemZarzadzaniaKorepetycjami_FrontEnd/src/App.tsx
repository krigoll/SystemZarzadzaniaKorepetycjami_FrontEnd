import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import MainPage from './pages/MainPage';
import Login from './pages/Login';
import Registration from './pages/Registration';
import AddSubjectsPage from './pages/AddSubjectPage';
import Menu from './pages/Menu';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import Cookies from 'js-cookie';
import { setUser } from './futures/login/loginSlice';
import Profile from './pages/Profile';
import EditProfile from './pages/EditProfile';
import StudentMenu from './pages/StudentMenu';
import TeacherMenu from './pages/TeacherMenu';
import DeterminingAvailabilty from './pages/DeterminingAvailabilty';
import NotFound from './pages/NotFound';
import ChooseSubjectPage from './pages/ChooseSubjectPage';
import ChooseTeacherPage from './pages/ChooseTeacherPage';
import SignUpToLesson from './pages/SignUpToLessonPage';
import RequestsPage from './pages/RequestsPage';
import EditSubjectPage from './pages/EditSubjectPage';
import DeleteAccountPage from './pages/DeleteAccountPage';
import CalendarPage from './pages/CalendarPage';
import LessonDetailsPage from './pages/LessonDetailsPage';
import ChatPage from './pages/ChatPage';
import TeachersReviewsListPage from './pages/TeachersReviewsListPage';
import AddReviewPage from './pages/AddReviewPage';
import TeacherOpinionPage from './pages/TeacherOpinionPage';
import AdminMenuPage from './pages/AdminMenuPage';
import UserListPage from './pages/UsersListPage';
import SubjectListPage from './pages/SubjectListPage';
import NewReportForm from './pages/ReportCreatePage';
import ReportListPage from './pages/ReportListPage';
import ReportDetailsPage from './pages/ReportDetailsPafe';
import UserDetailsPage from './pages/UserDetailsPage';
import TestsPage from './pages/TestsPage';
import TestDetailsPage from './pages/TestDetailsPage';
import GiveTestToStudentPage from './pages/GiveTestToStudentPage';
import TestListTeacherPage from './pages/TestListTeacherPage';
import TestListStudentPage from './pages/TestListStudentPage';

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    const jwtToken = Cookies.get('jwtToken');
    const refreshToken = Cookies.get('refreshToken');
    const email = Cookies.get('email');

    if (jwtToken && refreshToken && email) {
      dispatch(
        setUser({
          email: email,
          jwtToken: jwtToken,
          refreshToken: refreshToken,
        })
      );
    }
  }, [dispatch]);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/registration" element={<Registration />} />
        <Route path="/addSubjects" element={<AddSubjectsPage />} />
        <Route path="/menu" element={<Menu />} />
        <Route path="/teacher" element={<TeacherMenu />} />
        <Route
          path="/teacher/determiningAvailabilty/"
          element={<DeterminingAvailabilty />}
        />
        <Route path="/student" element={<StudentMenu />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/profile/edit" element={<EditProfile />} />
        <Route path="/student/chooseSubject" element={<ChooseSubjectPage />} />
        <Route
          path="/student/chooseSubject/:id"
          element={<ChooseTeacherPage />}
        />
        <Route path="/student/signUpToLesson" element={<SignUpToLesson />} />
        <Route path="/teacher/requests" element={<RequestsPage />} />
        <Route path="/teacher/editSubject" element={<EditSubjectPage />} />
        <Route path="/profile/deleteAccount" element={<DeleteAccountPage />} />
        <Route path="/calendar/:startDay" element={<CalendarPage />} />
        <Route
          path="/lessonDetails/:lessonId"
          element={<LessonDetailsPage />}
        />
        <Route path="/chat" element={<ChatPage />} />
        <Route
          path="/teachersReviewsList"
          element={<TeachersReviewsListPage />}
        />
        <Route path="/addReview/:teacherInfo" element={<AddReviewPage />} />
        <Route path="/teacher/myOpinion" element={<TeacherOpinionPage />} />
        <Route path="/admin" element={<AdminMenuPage />} />
        <Route path="/admin/userList" element={<UserListPage />} />
        <Route path="/admin/userList/:idPerson" element={<UserDetailsPage />} />
        <Route path="/admin/subjectList" element={<SubjectListPage />} />
        <Route path="/report/new" element={<NewReportForm />} />
        <Route path="/report" element={<ReportListPage />} />
        <Route path="/report/:reportId" element={<ReportDetailsPage />} />
        <Route path="/teacher/tests" element={<TestsPage />} />
        <Route path="/teacher/tests/:idTest" element={<TestDetailsPage />} />
        <Route
          path="/teacher/tests/:idTest/student"
          element={<GiveTestToStudentPage />}
        />
        <Route path="/teacher/givenTersts" element={<TestListTeacherPage />} />
        <Route path="/student/givenTersts" element={<TestListStudentPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
