import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../futures/store';
import { updateToken } from '../futures/login/loginSlice';
import { useHandleLogOut } from '../lib/LogOut';

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
  email: string;
  phoneNumber: string;
  image: string | null;
  isStudent: boolean;
  isTeacher: boolean;
}

interface EditAddAvailabilityProps {
  IdDayOfTheWeek: number;
  StartTime: string;
  EndTime: string;
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
  console.log(
    JSON.stringify({
      name: firstName,
      surname: lastName,
      birthDate: newBirthDate,
      email: email,
      password: password,
      phoneNumber: phoneNumber,
      image: jpegFile,
      isStudent: isStudent,
      isTeacher: isTeacher,
    })
  );
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

async function setTeacherSalary(
  teacherSalaries: TeacherSalaryProps[],
  token: string
) {
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

async function getPersonDetails(email: string, token: string) {
  const response = await fetch(
    `http://localhost:5230/api/person/getUser?email=${email}`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    if (response.status === 401) {
      const newToken = await refreshAccessToken();
      if (newToken) {
        return getPersonDetails(email,token);
      } 
    } else if (response.status === 400) {
      console.error('Invalid Email');
    } else if (response.status === 500) {
      console.error('Database Error');
    } else {
      console.error('Unexpected Error');
    }
    return;
  }

  return response.json();
}

async function editpersonDetails(
  {
    idPerson,
    name,
    surname,
    email,
    phoneNumber,
    image,
    isStudent,
    isTeacher,
  }: EditProfileProps,
  token: string
) {
  const response = await fetch(
    `http://localhost:5230/api/person/${idPerson}/update`,
    {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        name: name,
        surname: surname,
        email: email,
        phoneNumber: phoneNumber,
        image: image,
        isStudent: isStudent,
        isTeacher: isTeacher,
      }),
    }
  );

  return response;
}

async function getAvailability(
  email: string,
  token: string,
) {
  const response = await fetch(
    `http://localhost:5230/api/availability?email=${email}`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    if (response.status === 401) {
      const newToken = await refreshAccessToken();
      if (newToken) {
        return getAvailability(email,token);
      } 
    } else if (response.status === 400) {
      console.error('Invalid Email');
    } else if (response.status === 500) {
      console.error('Database Error');
    } else {
      console.error('Unexpected Error');
    }
    return;
  }

  return response.json();
}

async function CreateAndUpdateAvailabilityByEmail(
  availabilities: EditAddAvailabilityProps[],
  email: string,
  token: string
) {
  console.log(JSON.stringify(availabilities));

  const response = await fetch(
    `http://localhost:5230/api/availability?email=${email}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ calendars: availabilities }), // Zwr�� uwag� na struktur� danych
    }
  );

  if (!response.ok) {
    if (response.status === 401) {
      const newToken = await refreshAccessToken();
      if (newToken) {
        return CreateAndUpdateAvailabilityByEmail(availabilities,email,token);
      } 
    } else if (response.status === 400) {
      console.error('Invalid Email');
    } else if (response.status === 500) {
      console.error('Database Error');
    } else {
      console.error('Unexpected Error');
    }
    return;
  }

  return response;
}

const refreshAccessToken = async (): Promise<string | null> => {
  try {
    const refreshToken = useSelector(
      (state: RootState) => state.login.refreshToken
    );
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    const response = await fetch('http://localhost:5230/api/login/refresh', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refreshToken }),
    });

    if (!response.ok) {
      throw new Error('Failed to refresh token');
      const handleLogOut = useHandleLogOut();
      handleLogOut();
    }

    const data = await response.json();
    const newAccessToken = data.accessToken;
    const dispatch = useDispatch();
    dispatch(updateToken(newAccessToken));

    return newAccessToken;
  } catch (error) {
    console.error('Unable to refresh token:', error);
    return null;
  }
};

export {
  loginToApp,
  getOne,
  RegisterToApp,
  getAllSubjects,
  setTeacherSalary,
  getPersonDetails,
  editpersonDetails,
  getAvailability,
  CreateAndUpdateAvailabilityByEmail,
  refreshAccessToken,
};
