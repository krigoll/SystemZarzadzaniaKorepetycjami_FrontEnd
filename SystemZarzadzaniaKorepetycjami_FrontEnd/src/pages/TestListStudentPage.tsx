import React from 'react';
import AppButton from '../components/AppButton';
import { useNavigate } from 'react-router-dom';
import { goToMenu, goToTestForStudentDetailsPage } from '../lib/Navigate';
import { useSelector } from 'react-redux';
import { RootState } from '../futures/store';
import { useGetTestsStudent } from '../lib/useGetTestsStudent';

interface Test {
    idTest: number;
    title: string;
    status: string;
    numberOfAssignments: number;
    fullname: string;
    creationTime: string;
    idTestForStudent: number;
}

const TestListStudentPage: React.FC = () => {
    const navigate = useNavigate();
    const uId = useSelector((state: RootState) => state.login.idPerson);
    const { tests, loading, error } = useGetTestsStudent(uId);

    if (loading) {
        return <p>Ładowanie testów...</p>;
    }

    if (error) {
        return <p>Błąd: {error}</p>;
    }

    return (
        <div className="student-test-list-page">
            <div className="student-test-list-box">
                <h1>Lista Testów</h1>

                <div className="student-test-list">
                    {tests.length === 0 ? (
                        <p>Brak Testów</p>
                    ) : (
                        tests.map((test: Test) => (
                            <div key={test.idTestForStudent} className="test-item">
                                <div className="test-item-text">
                                    <p>
                                        <strong>Tytuł:</strong> {test.title} &nbsp;
                                    </p>
                                    <p>
                                        <strong>Ilość zadań:</strong> {test.numberOfAssignments}
                                        &nbsp;
                                    </p>
                                    <p>
                                        <strong>Zadano przez:</strong> {test.fullname}&nbsp;
                                    </p>
                                    <p>
                                        <strong>Data:</strong> {test.creationTime}&nbsp;
                                    </p>
                                    <p>
                                        <strong>Status:</strong> {test.status}&nbsp;
                                    </p>
                                </div>
                                <div className="test-item-actions">
                                    <AppButton
                                        label={
                                            test.status == 'Wyslany'
                                                ? 'Rozwiąż'
                                                : test.status == 'Rozwiazany'
                                                    ? 'Szczegóły'
                                                    : 'Zobacz ocenę'
                                        }
                                        onClick={() =>
                                            goToTestForStudentDetailsPage(
                                                navigate,
                                                test.idTestForStudent
                                            )
                                        }
                                    />
                                </div>
                            </div>
                        ))
                    )}
                </div>
                <div className="button-container">
                    <AppButton label="Powrót" onClick={() => goToMenu(navigate)} />
                </div>
            </div>
        </div>
    );
};

export default TestListStudentPage;
