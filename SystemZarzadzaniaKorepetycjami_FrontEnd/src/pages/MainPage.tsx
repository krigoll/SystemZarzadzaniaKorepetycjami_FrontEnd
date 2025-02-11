import React, { useEffect } from 'react';
import '../../public/App.css';
import AppButton from '../components/AppButton';
import { goToLogin, goToRegistration, goToMenu } from '../lib/Navigate';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../futures/store';

const App: React.FC = () => {
  const navigate = useNavigate();

  const { jwtToken } = useSelector((state: RootState) => state.login);

  useEffect(() => {
    if (jwtToken) {
      goToMenu(navigate);
    }
  }, [jwtToken, navigate]);

  return (
      <div className="App">
          <header className="App-header">
              <div className="header-content">
                  <div className="buttons">
                      <AppButton label="Logowanie" onClick={() => goToLogin(navigate)} />
                      <AppButton label="Rejestracja" onClick={() => goToRegistration(navigate)} />
                  </div>
              </div>
          </header>
          <main className="App-main">
              <h1>Witaj w naszej aplikacji do zarządzania korepetycjami!</h1>
              <p>
                  Nasza aplikacja została stworzona, aby ułatwić Ci zarządzanie korepetycjami.
                  Zapewnia ona narzędzia do organizacji lekcji oraz komunikacji z uczniami lub
                  nauczycielami.
              </p>
              <p>Aby rozpocząć korzystanie z aplikacji, zaloguj się lub załóż nowe konto.</p>
          </main>
      </div>

  );
};

export default App;
