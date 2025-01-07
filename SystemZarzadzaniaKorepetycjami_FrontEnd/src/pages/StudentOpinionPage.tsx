import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDeleteOpinion } from '../lib/useDeleteOpinion';
import AppButton from '../components/AppButton';
import { useGetStudentReviews } from '../lib/useGetStudentReviews';

const StudentOpinionPage: React.FC = () => {
  const { studentInfo } = useParams<{ studentInfo: string }>();
  const email = studentInfo?.split(' ')[0];
  const studentName =
    studentInfo?.split(' ')[1] + ' ' + studentInfo?.split(' ')[2] ||
    'Unknown Teacher';

  const { reviews, loading, error, refetch } = useGetStudentReviews(email);
  const navigate = useNavigate();

  const { deleteOpinion, loading: deleting } = useDeleteOpinion();

  const handleDeleteReview = async (idOpinion: number) => {
    const status = await deleteOpinion(idOpinion);

    if (status == 200) {
      alert('Opinia została usunięta!');
      refetch();
    }
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div className="teacher-reviews-page">
      <div className="teacher-reviews-box">
        <h1>Opinie ucznia {studentName}</h1>

        {error ? (
          <p className="error-message">Błąd podczas ładowania opinii.</p>
        ) : loading ? (
          <p>Ładowanie...</p>
        ) : (
          <div className="reviews-list">
            {reviews?.map(
              (
                review //dodać jeszcze imie i nazwisko nauczyciela
              ) => (
                <div key={review.idPerson} className="review-item">
                  <p>
                    <strong>Ocena:</strong> {review.rating}/5
                  </p>
                  <p>{review.content}</p>
                  <button
                    className="delete-review"
                    onClick={() => handleDeleteReview(review.idOpinion)}
                    disabled={deleting}
                  >
                    {deleting ? 'Usuwanie...' : 'Usuń'}
                  </button>
                </div>
              )
            )}
          </div>
        )}
        <div className="button-container">
          <AppButton label="Powrót" onClick={handleGoBack} />
        </div>
      </div>
    </div>
  );
};

export default StudentOpinionPage;
