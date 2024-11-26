import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useGetTeacherReviews } from '../lib/useGetTeacherOpinionById';
import { useSelector } from 'react-redux';
import { RootState } from '../futures/store';

const TeacherOpinionPage: React.FC = () => {
  const uId = useSelector((state: RootState) => state.login.idPerson);
  const { reviews, loading, error } = useGetTeacherReviews(uId);
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div className="teacher-reviews-page">
      <h1>Opinie o Tobie</h1>

      {error ? (
        <p>Błąd podczas ładowania opinii.</p>
      ) : loading ? (
        <p>Ładowanie...</p>
      ) : (
        <>
          <button onClick={handleGoBack}>Powrót</button>

          <div className="reviews-list">
            {reviews && reviews.length > 0 ? (
              <>
                {reviews?.map((review) => (
                  <div key={review.idPerson}>
                    <p>
                      <strong>Ocena:</strong> {review.rating}/5
                    </p>
                    <p>{review.content}</p>
                  </div>
                ))}
              </>
            ) : (
              <div>
                <p>Brak opinji</p>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default TeacherOpinionPage;
