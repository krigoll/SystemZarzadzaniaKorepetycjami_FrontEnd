import './App.css';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import MainPage from './pages/MainPage';
import Home from './pages/Home';
import Login from './pages/Login';
import Registration from './pages/Registration';
import AddSubjectsPage from './pages/AddSubjectPage';

function App() {
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
      </Routes>
    </Router>
  );
}

export default App;
