import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AppButton from '../components/AppButton';
import { useReportDetails } from '../lib/useReportDetails';
import { goToReportListPage } from '../lib/Navigate';
import { useUpdateReport } from '../lib/useUpdateReport';

interface UpdateReportProps {
  IdSender: number;
  Title: string;
  Content: string;
  DateTime: string;
  IsDealt: boolean;
}

const ReportDetailsPage: React.FC = () => {
  const { reportId } = useParams<{ reportId: string }>();
  const navigate = useNavigate();
  const { updateReport, loading, error } = useUpdateReport();

  const numericReportId = reportId ? parseInt(reportId) : null;

  const reportData = useReportDetails(numericReportId!);

  const handleUpdateReport = async (rozpatrzenie: boolean) => {
    if (!numericReportId || !reportData) return;

    const reportDTO: UpdateReportProps = {
      IdSender: reportData.idSender,
      Title: reportData.title,
      Content: reportData.content,
      DateTime: reportData.dateTime,
      IsDealt: rozpatrzenie,
    };
    await updateReport(numericReportId, reportDTO);

    if (!error) {
      alert('Zgłoszenie zostało zaktualizowane!');
      goToReportListPage(navigate);
    } else if (error) {
      alert(`Wystąpił blad: ${error}`);
    }
  };

  return (
      <div className="report-details-page">
          <div className="report-details-wrapper">
              <h2 className="report-details-header">Szczegóły zgłoszenia</h2>

              {reportData ? (
                  <div className="report-details-content">
                      <p>
                          <strong>Tytuł:</strong> {reportData.title}
                      </p>
                      <p>
                          <strong>Data:</strong> {reportData.dateTime}
                      </p>
                      <p>
                          <strong>Treść:</strong> {reportData.content}
                      </p>
                      <p>
                          <strong>Rozpatrzono:</strong> {reportData.isDealt ? 'Tak' : 'Nie'}
                      </p>
                  </div>
              ) : (
                  <p>Ładowanie szczegółów zgłoszenia...</p>
              )}

              <div className="button-container">
                  <button onClick={() => handleUpdateReport(true)} disabled={loading}>
                      Rozpatrzone
                  </button>
                  <button onClick={() => handleUpdateReport(false)} disabled={loading}>
                      Nierozpatrzone
                  </button>
              </div>

              <div className="button-container">
                  <AppButton label="Powrót" onClick={() => goToReportListPage(navigate)} />
              </div>
          </div>
      </div>

  );
};

export default ReportDetailsPage;
