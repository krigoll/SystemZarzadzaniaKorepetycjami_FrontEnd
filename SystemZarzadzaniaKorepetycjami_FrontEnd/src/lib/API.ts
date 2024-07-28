interface LoginProps {
  email: string;
  password: string;
}

interface RegisterProps {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  birthDate: string;
  phoneNumber: string;
  isStudent: boolean;
  isTeacher: boolean;
  selectedFile: File | null;
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

async function RegisterToApp({
  email,
  password,
  firstName,
  lastName,
  birthDate,
  phoneNumber,
  isStudent,
  isTeacher,
  selectedFile,
}: RegisterProps) {
  var newBirthDate: string = birthDate.toString();
  const response = await fetch(
    'http://localhost:5230/api/person/registration',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: firstName,
        surname: lastName,
        birthDate: newBirthDate,
        email: email,
        password: password,
        phoneNumber: phoneNumber,
        image: selectedFile,
        isStudent: isStudent,
        isTeacher: isTeacher,
      }),
    }
  );

  return response;
}

async function getAllSubjects(token:string) {
    const response = await fetch('http://localhost:5230/api/subject/getAllSubjects', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer '+token,
        },
    });

    if (!response.ok) {
        throw new Error('Failed to fetch subjects');
    }

    return response.json();
}

async function getOne() {
  const response = await fetch('/all');
  return response.json();
}

export { loginToApp, getOne, RegisterToApp, getAllSubjects };
