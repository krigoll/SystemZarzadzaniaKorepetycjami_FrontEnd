import './App.css';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import MainPage from './pages/MainPage';
import Home from './pages/Home';
import Login from './pages/Login';
import Registration from './pages/Registration';
import AddSubjectsPage from './pages/AddSubjectPage';
import Menu from './pages/Menu';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import Cookies from 'js-cookie';
import { setUser } from './futures/login/loginSlice';

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
      {/**
       * tu dać elemnt menu <Menu/>
       */}
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/home" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/registration" element={<Registration />} />
        <Route path="/addSubjects" element={<AddSubjectsPage />} />
        <Route path="/menu" element={<Menu />} />
      </Routes>
    </Router>
  );
}

export default App;
