import AppButton from '../components/AppButton';
import { goToMainPage } from '../lib/Navigate';
import { useNavigate } from 'react-router-dom';

const NotFound: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="App">
      <header className="App-header">
        <div className="header-content">
          <div className="buttons">
            <AppButton label="Podrót" onClick={() => goToMainPage(navigate)} />
          </div>
        </div>
      </header>
      <main className="App-main">
        <h1>Nie ma takiej strony</h1>
        <img
          src="https://www.zooplus.pl/magazyn/wp-content/uploads/2021/03/kot-z-nadwag%C4%85.jpeg"
          alt="pic"
        />
      </main>
    </div>
  );
};

export default NotFound;
