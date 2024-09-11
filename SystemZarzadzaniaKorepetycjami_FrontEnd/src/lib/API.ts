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

interface SignUpToLessonProps {
  email: string;
  teacherId: number;
  subjectLevelId: number;
  startDate: string;
  startTime: string;
  durationInMinutes: number;
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

// TODO
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
      const handleLogOut = useHandleLogOut();
      handleLogOut();
      throw new Error('Failed to refresh token');
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

async function singUpToLesson(
  {
    teacherId,
    email,
    subjectLevelId,
    startDate,
    startTime,
    durationInMinutes,
  }: SignUpToLessonProps,
  token: string
) {
  const requestData = {
    studentEmail: email,
    teacherId: teacherId,
    subjectLevelId: subjectLevelId,
    startDate: startDate,
    startTime: startTime,
    durationInMinutes: durationInMinutes,
  };
  console.log(requestData);
  const response = await fetch('http://localhost:5230/api/singUpToLesson', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(requestData),
  });

  return response;
}

async function GetReservedLessons(email: string, token: string) {
  try {
    const response = await fetch(
      `http://localhost:5230/api/lesson?email=${email}`,
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
          return GetReservedLessons(email, newToken);
        }
      } else if (response.status === 500) {
        console.error('Database Error');
      } else {
        console.error('Unexpected Error');
      }
      return;
    }

    return response.json();
  } catch (error) {
    console.error('Error fetching teachers:', error);
    return;
  }
}

async function AcceptLesson(lessonId: number, token: string) {
  const response = await fetch(
    `http://localhost:5230/api/lesson?lessonId=${lessonId}/accept`,
    {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response;
}

async function RejectLesson(lessonId: number, token: string) {
  const response = await fetch(
    `http://localhost:5230/api/lesson?lessonId=${lessonId}/reject`,
    {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response;
}

export {
  loginToApp,
  RegisterToApp,
  refreshAccessToken,
  singUpToLesson,
  GetReservedLessons,
  AcceptLesson,
  RejectLesson,
};
