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

function goToAddSubject(navigate: NavigateFunction) {
  navigate('/addSubjects');
}

function goToMenu(navigate: NavigateFunction) {
  navigate('/menu');
}

export { goToLogin, goToRegistration, goToMainPage, goToAddSubject, goToMenu };
