import { NavigateFunction } from 'react-router-dom';

function goToLogin(navigate: NavigateFunction) {
  navigate('/login');
}

function goToRegistration(navigate: NavigateFunction) {
  navigate('/registration');
}

function goToMainPage(navigate: NavigateFunction) {
  navigate('/');
}


export { goToLogin, goToRegistration, goToMainPage };
