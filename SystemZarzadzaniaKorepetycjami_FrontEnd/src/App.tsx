import './App.css';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import MainPage from './pages/MainPage';
import Home from './pages/Home';
import Login from './pages/Login';

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
      </Routes>
    </Router>
  );
}

export default App;
