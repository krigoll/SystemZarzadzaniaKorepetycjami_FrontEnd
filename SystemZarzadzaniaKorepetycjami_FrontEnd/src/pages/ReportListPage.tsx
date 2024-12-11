import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import { goToAdminMenuPage, goToReportDetailsPage } from '../lib/Navigate';
import { useGetReports } from '../lib/useGetReports';

interface Report {
    idReport: number;
    title: string;
    isDealt: boolean;
}

const ReportListPage: React.FC = () => {
    const navigate = useNavigate();
    const { reports, loading, error } = useGetReports();
    const [onlyReserved, setOnlyReserved] = useState<boolean>(false);

    const handleDetails = (id: number) => {
        alert(`Wyœwietlam szczegó³y zg³oszenia o ID: ${id}`);
    };

    const filteredReports = onlyReserved
        ? reports.filter((report:Report) => !report.isDealt)
        : reports;

    return (
        <div>
            <h1>Lista Zg³oszeñ</h1>
            <label>
                Tylko nie rozpatrzone
                <input
                    type="checkbox"
                    checked={onlyReserved}
                    onChange={() => setOnlyReserved(!onlyReserved)}
                />
            </label>
            {loading && <p>£adowanie...</p>}
            {error && <p>B³¹d: {error}</p>}
            {filteredReports.length === 0 && !loading && !error && (
                <p>Brak zg³oszeñ</p>
            )}
            <ul>
                {filteredReports.map((report:Report) => (
                    <li key={report.idReport}>
                        <span>{report.title}</span> - Rozpatrzone: {report.isDealt ? "Tak" : "Nie"}
                        <button onClick={() => goToReportDetailsPage(navigate, report.idReport)}>Szczegó³y</button>
                    </li>
                ))}
            </ul>
            <button onClick={() => goToAdminMenuPage(navigate)}>Powrót</button>
        </div>
    );
};

export default ReportListPage;