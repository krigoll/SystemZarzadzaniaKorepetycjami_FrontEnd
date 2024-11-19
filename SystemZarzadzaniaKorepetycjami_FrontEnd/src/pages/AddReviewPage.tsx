import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useGetTeacherReviews } from '../lib/useGetTeacherOpinionById';
import { useSelector } from 'react-redux';
import { RootState } from '../futures/store';
import { useCreateOpinion } from '../lib/useCreateOpinion';
import { OpinionDTO } from '../types/OpinionDTO';
import { useDeleteOpinion } from '../lib/useDeleteOpinion';

const AddReviewsPage: React.FC = () => {
  const { teacherInfo } = useParams<{ teacherInfo: string }>();
  const teacherId = Number(teacherInfo?.split(' ')[0]) || 0;
  const teacherName =
    teacherInfo?.split(' ')[1] + ' ' + teacherInfo?.split(' ')[2] ||
    'Unknown Teacher';

  const { reviews, loading, error, refetch } = useGetTeacherReviews(teacherId);
  const [rating, setRating] = useState<number>();
  const [newReview, setNewReview] = useState<string>('');
  const uId = useSelector((state: RootState) => state.login.idPerson);
  const email = useSelector((state: RootState) => state.login.email);
  const navigate = useNavigate();

  const {
    createOpinion,
    responseStatus,
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
      alert('Podaj ocenę opisową');
      return;
    }

    if (!rating || rating < 1 || rating > 5) {
      alert('Ocena ma się mieścić od 1 do 5');
      return;
    }

    const opinionDTO: OpinionDTO = {
      IdTeacher: teacherId,
      StudentEmail: email,
      Rating: rating,
      Content: newReview,
    };

    await createOpinion(opinionDTO);

    if (responseStatus === 200) {
      alert('Opinia została dodana!');
      refetch();
    }
  };

  const handleDeleteReview = async (idOpinion: number) => {
    const status = await deleteOpinion(idOpinion);

    if (status === 200) {
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
      <h1>Opinie o Nauczycielu {teacherName}</h1>

      {error ? (
        <p>Błąd podczas ładowania opinii.</p>
      ) : loading ? (
        <p>Ładowanie...</p>
      ) : (
        <>
          {reviews?.some((review) => review.idPerson === uId) ? (
            <div>
              <p>Twoja opinia:</p>
              <p>
                <strong>Ocena:</strong>{' '}
                {reviews.find((review) => review.idPerson === uId)?.rating}/5
              </p>
              <p>
                {reviews.find((review) => review.idPerson === uId)?.content}
              </p>
              <button
                onClick={() =>
                  handleDeleteReview(
                    reviews.find((review) => review.idPerson === uId)?.idOpinion
                  )
                }
                disabled={deleting}
              >
                {deleting ? 'Usuwanie...' : 'Usuń'}
              </button>
              {deleteError && (
                <p style={{ color: 'red' }}>Błąd: {deleteError}</p>
              )}
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
              <div>
                <button onClick={handleAddReview} disabled={creating}>
                  {creating ? 'Dodawanie...' : 'Akceptuj'}
                </button>
              </div>
            </div>
          )}
          {createError && <p style={{ color: 'red' }}>Błąd: {createError}</p>}
        </>
      )}

      <button onClick={handleGoBack}>Powrót</button>

      <div className="reviews-list">
        {filteredReviews?.map((review) => (
          <div key={review.idPerson}>
            <p>
              <strong>Ocena:</strong> {review.rating}/5
            </p>
            <p>{review.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AddReviewsPage;
