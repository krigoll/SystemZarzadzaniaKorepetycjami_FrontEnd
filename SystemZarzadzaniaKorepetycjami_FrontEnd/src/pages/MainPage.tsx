import React from 'react';
import './App.css';

const App: React.FC = () => {
  return (
    <div className="App">
      <header className="App-header">
        <div className="header-content">
          <span>Admin</span>
          <div className="buttons">
            <button className="login-btn">Logowanie</button>
            <button className="register-btn">Rejestracja</button>
          </div>
        </div>
      </header>
      <main className="App-main">
        <h1>Witaj w naszej aplikacji do zarządzania korepetycjami!</h1>
        <p>
          Nasza aplikacja została stworzona, aby ułatwić Ci zarządzanie
          korepetycjami. Zapewnia ona narzędzia do organizacji lekcji oraz
          komunikacji z uczniami lub nauczycielami.
        </p>
        <p>
          Aby rozpocząć korzystanie z aplikacji, zaloguj się lub załóż nowe
          konto.
        </p>
      </main>
    </div>
  );
};

export default App;
