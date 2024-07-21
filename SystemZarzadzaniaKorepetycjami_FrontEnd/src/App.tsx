import { useState } from 'react';
import './App.css';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import MainPage from './pages/MainPage';
import Home from './pages/Home';

function App() {
  const [count, setCount] = useState(0);

  return (
    <Router>
      {/**
       * tu dać elemnt menu <Menu/>
       */}
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/home" element={<Home />} />
      </Routes>
    </Router>
  );
}

export default App;
