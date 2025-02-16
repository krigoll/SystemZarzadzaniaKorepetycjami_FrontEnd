import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { goToMenu } from '../lib/Navigate';
import { useGetReservedLessons } from '../lib/useGetReservedLessons';
import { AcceptLesson, RejectLesson } from '../lib/useHandleLesson';

interface Request {
    lessonId: number;
    dateTime: string;
    subjectCategoryName: string;
    subjectLevelName: string;
    studentName: string;
    studentSurname: string;
    durationInMinutes: number;
}

const TeacherRequestsPage: React.FC = () => {
    const navigate = useNavigate();
    const [refreshFlag, setRefreshFlag] = useState<boolean>(false);
    const requests = useGetReservedLessons(refreshFlag);
    const acceptLesson = AcceptLesson();
    const rejectLesson = RejectLesson();

    useEffect(() => {

    }, [refreshFlag]);

    const handleAccept = async (requestId: number) => {
        try {
            console.log(requestId);
            const response = await acceptLesson(requestId);
            if (response.ok) {
                alert(`Lekcja została zaakceptowana!`);
                setRefreshFlag((prev) => !prev);
            } else {
                alert(`Nie udało się zaakceptować lekcji.`);
            }
        } catch (error) {
            alert(`Błąd`);
        }
    };


    const handleReject = async (requestId: number) => {
        try {
            const response = await rejectLesson(requestId);
            if (response.ok) {
                alert(`Lekcja została odrzucona!`);
                setRefreshFlag((prev) => !prev);
            } else {
                alert(`Nie udało się odrzucić lekcji.`);
            }
        } catch (error) {
            alert(`Błąd`);
        }
    };

    return (
        <div className="teacher-requests-page">
            <h1>Lista Zgłoszeń</h1>
            <div className="requests-list">
                {requests.length > 0 ? (
                    requests.map((r: Request) => (
                        <div key={r.lessonId} className="request-item">
                            <div className="request-info">
                                <div className="date">{r.dateTime}</div>
                                <div>{r.durationInMinutes} minut</div>
                                <div className="student-name">
                                    {r.studentName} {r.studentSurname}
                                </div>
                                <div className="subject">
                                    {r.subjectCategoryName} {r.subjectLevelName}
                                </div>
                            </div>
                            <div className="request-actions">
                                <button onClick={() => handleAccept(r.lessonId)}>Akceptuj</button>
                                <button onClick={() => handleReject(r.lessonId)}>Odrzuć</button>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="no-requests">Nie znaleziono zgłoszeń.</p>
                )}
            </div>
            <div className="button-container-bottom">
                <button className="back-button" onClick={() => goToMenu(navigate)}>
                    Powrót
                </button>
            </div>
        </div>


    );
};

export default TeacherRequestsPage;
