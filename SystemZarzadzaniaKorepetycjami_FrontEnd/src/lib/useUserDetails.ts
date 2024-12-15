import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateToken } from '../futures/login/loginSlice';
import { useRefreshAccessToken } from './useRefreshAccessToken';
import { RootState } from '../futures/store';
import { base64ToFile } from './ConvertImage';

interface PersonResponse {
  idPerson: number;
  name: string;
  surname: string;
  birthDate: string;
  email: string;
  phoneNumber: string;
  joiningDate: Date;
  image: string | null;
  isTeacher: boolean;
  isStudent: boolean;
  isBaned: boolean;
  numberOfDays: number;
  reason: string;
}

interface Person {
  idPerson: number;
  name: string;
  surname: string;
  birthDate: string;
  email: string;
  phoneNumber: string;
  joiningDate: Date;
  image: File | null;
  isTeacher: boolean;
  isStudent: boolean;
  isBaned: boolean;
  numberOfDays: number;
  reason: string;
}

export const useUserDetails = (numericPersonId: number | null) => {
  const [personData, setPersonData] = useState<any>(null);
  const refreshAccessToken = useRefreshAccessToken();
  const dispatch = useDispatch();
  const jwtToken = useSelector((state: RootState) => state.login.jwtToken);
  const [refreshFlag, setRefreshFlag] = useState<boolean>(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        let token = jwtToken;
        let response = await fetch(
          `http://localhost:5230/api/person/getUser/${numericPersonId}`,
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
              token = newToken;
              dispatch(updateToken(token));
              response = await fetch(
                `http://localhost:5230/api/person/getUser/${numericPersonId}`,
                {
                  method: 'GET',
                  headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                  },
                }
              );
            } else {
              throw new Error('Failed to refresh token');
            }
          } else {
            throw new Error('Error fetching user details');
          }
        }

        const dataUser: PersonResponse = await response.json();
        console.log(dataUser);
        const user: Person = {
          idPerson: dataUser.idPerson,
          name: dataUser.name,
          surname: dataUser.surname,
          birthDate: dataUser.birthDate,
          email: dataUser.email,
          phoneNumber: dataUser.phoneNumber,
          joiningDate: dataUser.joiningDate,
          image: dataUser.image
            ? base64ToFile(dataUser.image, 'profileImage.jpg')
            : null,
          isTeacher: dataUser.isTeacher,
          isStudent: dataUser.isStudent,
          isBaned: dataUser.isBaned,
          numberOfDays: dataUser.numberOfDays,
          reason: dataUser.reason
        };
        setPersonData(user);
      } catch (error) {
        console.error('Error fetching user details:', error);
      }
    };

    if (numericPersonId && jwtToken) {
      fetchData();
    }
  }, [numericPersonId, refreshFlag]);

  const refetch = () => {
    setRefreshFlag(!refreshFlag);
  };

  return {personData, refetch};
};
