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
    }),
  });
  
  return response;
}

async function getOne() {
  const response = await fetch('/all');
  return response.json();
}

export { loginToApp, getOne };
