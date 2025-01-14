import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useGetTeacherReviews } from '../lib/useGetTeacherOpinionById';
import { useSelector } from 'react-redux';
import { RootState } from '../futures/store';
import { useCreateOpinion } from '../lib/useCreateOpinion';
import { OpinionDTO } from '../types/OpinionDTO';
import { useDeleteOpinion } from '../lib/useDeleteOpinion';
import AppButton from '../components/AppButton';

const AddReviewsPage: React.FC = () => {
  const { teacherInfo } = useParams<{ teacherInfo: string }>();
  const teacherId = Number(teacherInfo?.split(' ')[0]) || 0;
  const teacherName =
    teacherInfo?.split(' ')[1] + ' ' + teacherInfo?.split(' ')[2] ||
    'Unknown Teacher';

  const { reviews, loading, error, refetch } = useGetTeacherReviews(teacherId);
  const [rating, setRating] = useState<number>(1);
  const [newReview, setNewReview] = useState<string>('');
  const uId = useSelector((state: RootState) => state.login.idPerson);
  const email = useSelector((state: RootState) => state.login.email);
  const navigate = useNavigate();

  const {
    createOpinion,
    loading: creating,
    error: createError,
  } = useCreateOpinion();

  const {
    deleteOpinion,
    loading: deleting,
    error: deleteError,
  } = useDeleteOpinion();

  const handleAddReview = async () => {
    if (!newReview.trim()) {
      alert('Podaj treść opinii!');
      return;
    }
    if (newReview.trim().length > 500) {
      alert('Zbyt długa opinia, maksymalnie 500 znaków.');
      return;
    }

    if (!rating || rating < 1 || rating > 5) {
      alert('Ocena ma się mieścić od 1 do 5!');
      return;
    }

    const opinionDTO: OpinionDTO = {
      IdTeacher: teacherId,
      StudentEmail: email,
      Rating: rating,
      Content: newReview,
    };

    const returnValue = await createOpinion(opinionDTO);

    if (returnValue == 0) {
      alert('Opinia została dodana!');
      refetch();
    }
  };

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

  const filteredReviews = reviews?.filter((review) => review.idPerson !== uId);

  return (
    <div className="teacher-reviews-page">
      <div className="teacher-reviews-box">
        <h1>Opinie o nauczycielu: {teacherName}</h1>

        {error ? (
          <p className="error-message">Błąd podczas ładowania opinii.</p>
        ) : loading ? (
          <p>Ładowanie...</p>
        ) : (
          <>
            {reviews?.some((review) => review.idPerson === uId) ? (
              <div className="review-item">
                <p>Twoja opinia:</p>
                <p>
                  <strong>Ocena:</strong>{' '}
                  {reviews.find((review) => review.idPerson === uId)?.rating}
                  /5
                </p>
                <p>
                  {reviews.find((review) => review.idPerson === uId)?.content}
                </p>
                <div className="review-actions">
                  <button
                    className="delete-review"
                    onClick={() =>
                      handleDeleteReview(
                        reviews.find((review) => review.idPerson === uId)
                          ?.idOpinion
                      )
                    }
                    disabled={deleting}
                  >
                    {deleting ? 'Usuwanie...' : 'Usuń'}
                  </button>
                  {deleteError && (
                    <p className="error-message">Błąd: {deleteError}</p>
                  )}
                </div>
              </div>
            ) : (
              <div>
                <textarea
                  value={newReview}
                  onChange={(e) => setNewReview(e.target.value)}
                  placeholder="Napisz swoją opinię..."
                  disabled={creating}
                />
                <input
                  type="range"
                  min="1"
                  max="5"
                  value={rating || 1}
                  onChange={(e) => setRating(Number(e.target.value))}
                  disabled={creating}
                />
                <p>Ocena: {rating || 1}/5</p>
                <div className="button-container">
                  <AppButton
                    label={creating ? 'Dodawanie...' : 'Akceptuj'}
                    onClick={handleAddReview}
                    disabled={creating}
                  />
                </div>
              </div>
            )}
            {createError && (
              <p className="error-message">Błąd: {createError}</p>
            )}
          </>
        )}

        <div className="reviews-list">
          {filteredReviews?.length === 0 ? (
            <p>Brak opinii innych użytkowników</p>
          ) : (
            filteredReviews?.map((review) => (
              <div key={review.idPerson} className="review-item">
                <p>{review.fullName}</p>
                <p>
                  <strong>Ocena:</strong> {review.rating}/5
                </p>
                <p>{review.content}</p>
              </div>
            ))
          )}
        </div>
        <div className="button-container">
          <AppButton label="Powrót" onClick={handleGoBack} />
        </div>
      </div>
    </div>
  );
};

export default AddReviewsPage;
