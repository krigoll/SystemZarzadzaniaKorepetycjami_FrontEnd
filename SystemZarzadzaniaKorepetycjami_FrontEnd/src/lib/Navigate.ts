import { NavigateFunction } from 'react-router-dom';

function goToLogin(navigate: NavigateFunction) {
  navigate('/login');
}

export { goToLogin };
