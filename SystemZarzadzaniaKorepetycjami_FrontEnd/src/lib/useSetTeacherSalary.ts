import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateToken } from '../futures/login/loginSlice';
import { useRefreshAccessToken } from './useRefreshAccessToken';
import { RootState } from '../futures/store';

interface TeacherSalaryProps {
    subject_LevelId: number;
    personEmail: string;
    hourlyRate: number;
}

export const useSetTeacherSalary = () => {
    const [responseStatus, setResponseStatus] = useState<number | null>(null);
    const refreshAccessToken = useRefreshAccessToken();
    const dispatch = useDispatch();
    const jwtToken = useSelector((state: RootState) => state.login.jwtToken);

    const setTeacherSalary = async (teacherSalaries: TeacherSalaryProps[]) => {
        try {
            let token = jwtToken;
            let response = await fetch(
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

            if (!response.ok) {
                if (response.status === 401) {
                    const newToken = await refreshAccessToken();
                    if (newToken) {
                        token = newToken;
                        dispatch(updateToken(token));
                        response = await fetch(
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
                    } else {
                        throw new Error('Failed to refresh token');
                    }
                } else {
                    throw new Error('Error setting teacher salary');
                }
            }

            setResponseStatus(response.status);
            return response.status;
        } catch (error) {
            console.error('Error setting teacher salary:', error);
            return null;
        }
    };

    return { setTeacherSalary, responseStatus };
};
