interface LoginProps {
  email: string;
  password: string;
}

async function loginToApp({ email, password }: LoginProps) {
  const response = await fetch('http://localhost:5230/api/login/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email: email,
      password: password,
      twoFactorCode: 'string',
      twoFactorRecoveryCode: 'string',
    }),
  });
  const loginData = await response.json();
  if (!response.ok) {
    if (response.status === 404) {
      alert('Błędny login lub hasło');
      return;
    } else {
      alert('Bazy danych'); //dodać przejcie do dstony kod 500
      return;
    }
  }
  return loginData;
}

async function getOne() {
  const response = await fetch('/all');
  return response.json();
}

export { loginToApp, getOne };
