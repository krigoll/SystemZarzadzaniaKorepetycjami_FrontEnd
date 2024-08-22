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
        <Route path="/teacher/determiningAvailabilty/" element={<DeterminingAvailabilty />} />
        <Route path="/student" element={<StudentMenu />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/profile/edit" element={<EditProfile />} />
        <Route path="*" element={<NotFound />} />
              <Route path="/student/chooseSubject" element={<ChooseSubjectPage />} />
              <Route path="/student/chooseSubject/:id" element={<ChooseTeacherPage />} />
      </Routes>
    </Router>
  );
}

export default App;
