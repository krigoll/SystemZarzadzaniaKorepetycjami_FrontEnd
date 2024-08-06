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
  jpegFile: string | null;
}

interface TeacherSalaryProps {
    subject_LevelId: number;
    personEmail: string;
    hourlyRate: number;
}

interface EditProfileProps {
    idPerson: number;
    name: string;
    surname: string;
    birthDate: string;
    email: string;
    phoneNumber: string;
    image: File | null;
    isStudent: boolean;
    isTeacher: boolean;
    isAdmin: boolean;
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
  jpegFile,
}: RegisterProps) {
  var newBirthDate: string = birthDate.toString();
  console.log(JSON.stringify({
    name: firstName,
    surname: lastName,
    birthDate: newBirthDate,
    email: email,
    password: password,
    phoneNumber: phoneNumber,
    image: jpegFile,
    isStudent: isStudent,
    isTeacher: isTeacher,
  }));
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
          image: jpegFile,
        isStudent: isStudent,
        isTeacher: isTeacher,
      }),
    }
  );

  return response;
}

async function setTeacherSalary(teacherSalaries: TeacherSalaryProps[],token: string) {
    const response = await fetch(
        'http://localhost:5230/api/teacherSalary/setTeacherSalary',
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(teacherSalaries),
        }
    );
    return response;
}

async function getAllSubjects(token: string) {
  const response = await fetch(
    'http://localhost:5230/api/subject/getAllSubjects',
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error('Failed to fetch subjects');
  }

  return response.json();
}

async function getOne() {
  const response = await fetch('/all');
  return response.json();
}

async function getPersonDetails(email: string) {
    const response = await fetch(
      `http://localhost:5230/api/person/getUser?email=${email}`,
      {
          method: 'GET',
          headers: {
              'Content-Type': 'application/json',
          },
      }
    );

    if (!response.ok) {
      if (response.status === 400) {
          console.error("Invalid Email");
      } else if (response.status === 500) {
          console.error("Database Error");
      } else {
          console.error("Unexpected Error");
      }
      return;
  }

    return response.json();
}

async function editpersonDetails({
    idPerson,
    name,
    surname,
    birthDate,
    email,
    phoneNumber,
    image,
    isStudent,
    isTeacher,
    isAdmin
}: EditProfileProps) {
    var newBirthDate: string = birthDate.toString();
    const response = await fetch(
        `http://localhost:5230/api/person/${idPerson}/update`,
        {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name: name,
                surname: surname,
                birthDate: newBirthDate,
                email: email,
                phoneNumber: phoneNumber,
                image: image,
                isStudent: isStudent,
                isTeacher: isTeacher,
                isAdmin: isAdmin
            }),
        }
    );

    return response;
}


export { loginToApp, getOne, RegisterToApp, getAllSubjects, setTeacherSalary, getPersonDetails, editpersonDetails };
