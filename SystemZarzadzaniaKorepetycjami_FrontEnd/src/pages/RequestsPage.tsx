import React, { useEffect, useState } from 'react';
import AppButton from '../components/AppButton';
import { useNavigate } from 'react-router-dom';
import { goToTeacherMenu } from '../lib/Navigate';
import { useSelector } from 'react-redux';
import { RootState } from '../futures/store';
import { AcceptLesson, GetReservedLessons, RejectLesson } from '../lib/API';

interface Request {
  lessonId: number;
  dateTime: string;
  subjectCategoryName: string;
  subjectLevelName: string;
  studentName: string;
  studentSurname: string;
}

const TeacherRequestsPage: React.FC = () => {
  const navigate = useNavigate();
  const email = useSelector((state: RootState) => state.login.email);
  const jwtToken = useSelector((state: RootState) => state.login.jwtToken);
  const [requests, setRequests] = useState<Request[]>([]);
  const [refreshFlag, setRefreshFlag] = useState<boolean>(false);

  const fetchRequests = async (
    email: string,
    token: string
  ): Promise<Request[]> => {
    try {
      const response = await GetReservedLessons(email, token);
      if (Array.isArray(response)) {
        return response as Request[];
      } else {
        console.error('Unexpected response format:', response);
        return [];
      }
    } catch (error) {
      console.error('Error fetching availability calendar:', error);
      return [];
    }
  };

  const generateRequestsHTML = async (email: string, token: string) => {
    try {
      const requestsData = await fetchRequests(email, token);
      setRequests(requestsData);
    } catch (error) {
      console.error('Error generating availability calendar:', error);
      setRequests([]);
    }
  };

  useEffect(() => {
    if (email && jwtToken) {
      generateRequestsHTML(email, jwtToken);
    }
  }, [email, jwtToken, refreshFlag]);

    const handleAccept = (requestId: number) => {
        AcceptLesson(requestId, jwtToken);
        setRefreshFlag(prev => !prev);
  };

  const handleReject = (requestId: number) => {
      RejectLesson(requestId, jwtToken);
      setRefreshFlag(prev => !prev);
  };

  return (
    <div className="teacher-requests-page">
      <h1>Lista Zgłoszeń</h1>
      <div className="button-container-top">
        <AppButton label="Powrót" onClick={() => goToTeacherMenu(navigate)} />
      </div>
      <div className="requests-list">
        {requests.length > 0 ? (
          requests.map((r: Request) => (
            <div key={r.lessonId} className="request-item">
              <div className="request-info">
                <div className="date">{r.dateTime}</div>
                <div className="student-name">
                  {r.studentName} {r.studentSurname}
                </div>
                <div className="subject">
                  {r.subjectCategoryName} {r.subjectLevelName}
                </div>
              </div>
              <div className="request-actions">
                <AppButton
                  label="Akceptuj"
                  onClick={() => handleAccept(r.lessonId)}
                />
                <AppButton
                  label="Odrzuć"
                  onClick={() => handleReject(r.lessonId)}
                />
              </div>
            </div>
          ))
        ) : (
          <p>Nie znaleziono zgłoszeń.</p>
        )}
      </div>
    </div>
  );
};

export default TeacherRequestsPage;
