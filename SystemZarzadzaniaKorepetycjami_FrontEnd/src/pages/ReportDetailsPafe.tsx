import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AppButton from '../components/AppButton';
import { useReportDetails } from '../lib/useReportDetails';
import { goToReportListPage } from '../lib/Navigate';
import { useUpdateReport } from '../lib/useUpdateReport';

interface UpdateReportProps {
    IdSender: number,
    Title: string,
    Content: string,
    DateTime: string,
    IsDealt: boolean
}

const ReportDetailsPage: React.FC = () => {
  const { reportId } = useParams<{ reportId: string }>();
  const navigate = useNavigate();
  const { updateReport, responseStatus, loading, error } = useUpdateReport();

  const numericReportId = reportId ? parseInt(reportId) : null;

  const reportData = useReportDetails(numericReportId!);

  const handleUpdateReport = async (rozpatrzenie: boolean) => {
    if (!numericReportId || !reportData) return;

    const reportDTO: UpdateReportProps = {
      IdSender: reportData.IdSender,
      Title: reportData.Title,
      Content: reportData.Content,
      DateTime: reportData.dateTime,
      IsDealt: rozpatrzenie,
    };

    await updateReport(numericReportId, reportDTO);

    if (responseStatus === 200) {
      alert('Zg�oszenie zosta�o zaktualizowane!');
    } else if (error) {
      alert(`Wyst�pi� b��d: ${error}`);
    }
  };

  return (
    <div className="lesson-details-container">
      <h2>Szczeg�y zg�oszenia</h2>

      {reportData ? (
        <div className="lesson-details">
          <p>
            <strong>Tytu�:</strong> {reportData.title}
          </p>
          <p>
            <strong>Data:</strong> {reportData.dateTime}
          </p>
          <p>
            <strong>Tre��:</strong> {reportData.content}
          </p>
          <p>
            <strong>Rozpatrzono: </strong> {reportData.isDealt ? "Tak" : "Nie"}
          </p>
        </div>
      ) : (
        <p>�adowanie szczeg��w zg�oszenia...</p>
      )}

      <div className="button-container">
        <button
          onClick={() => handleUpdateReport(true)}
          disabled={loading}
        >
            Rozpatrzone
        </button>

        <button
          onClick={() => handleUpdateReport(false)}
          disabled={loading}
        >
            Nie rozpatrzone
        </button>
</div>
      <div className="button-container">
        <AppButton
          label="Powr�t"
          onClick={() => goToReportListPage(navigate)}
        />
      </div>
    </div>
  );
};

export default ReportDetailsPage;
