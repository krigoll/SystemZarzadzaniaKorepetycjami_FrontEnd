import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { goToMenu, goToReportDetailsPage } from '../lib/Navigate';
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

  const filteredReports = onlyReserved
    ? reports.filter((report: Report) => !report.isDealt)
    : reports;

  return (
      <div className="report-page-container">
          <div className="report-page-wrapper">
              <h1 className="report-page-header">Lista Zgłoszeń</h1>
              <label className="report-page-filter">
                  <span className="report-page-filter-text">Tylko nie rozpatrzone: </span>
                  <input
                      className="report-page-filter-checkbox"
                      type="checkbox"
                      checked={onlyReserved}
                      onChange={() => setOnlyReserved(!onlyReserved)}
                  />
              </label>
              {loading && <p>Ładowanie...</p>}
              {error && <p>Błąd: {error}</p>}
              {filteredReports.length === 0 && !loading && !error && (
                  <p>Brak zgłoszeń.</p>
              )}
              <ul className="report-page-list">
                  {filteredReports.map((report: Report) => (
                      <li key={report.idReport} className="report-page-item">
                          <span>{report.title} - Rozpatrzone: {report.isDealt ? 'Tak' : 'Nie'}</span>
                          <button
                              onClick={() => goToReportDetailsPage(navigate, report.idReport)}
                          >
                              Szczegóły
                          </button>
                      </li>
                  ))}
              </ul>
              <div className="button-container">
              <button
                  className="report-page-butt-button"
                  onClick={() => goToMenu(navigate)}
              >
                  Powrót
                  </button>
              </div>
          </div>
      </div>

  );
};

export default ReportListPage;
