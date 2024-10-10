import './App.css';
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
                <Route path="/lessonDetails/:idLesson" element={<LessonDetailsPage />} />
                <Route path="*" element={<NotFound />} />
            </Routes>
        </Router>
    );
}

export default App;
