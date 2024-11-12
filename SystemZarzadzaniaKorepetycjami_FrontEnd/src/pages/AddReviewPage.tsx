import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AppButton from '../components/AppButton'; // Zakładając, że masz komponent AppButton

// Typ dla danych opinii
interface Review {
  id: number;
  content: string;
}

// Typ dla danych nauczyciela (na wypadek potrzeby wyświetlenia imienia i nazwiska nauczyciela)
interface Teacher {
  id: number;
  firstName: string;
  lastName: string;
}

// Mockowa funkcja do pobrania opinii (zastąp API)
const fetchReviews = async (teacherId: number): Promise<Review[]> => {
  // Przykładowe dane
  return [
    { id: 1, content: 'Świetny nauczyciel, polecam!' },
    { id: 2, content: 'Bardzo pomocny i cierpliwy.' },
  ];
};

const TeacherReviewsPage: React.FC = () => {
  const { teacherId } = useParams<{ teacherId: string }>();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [newReview, setNewReview] = useState<string>('');
  const navigate = useNavigate();

  useEffect(() => {
    // Pobierz opinie na temat nauczyciela
    const loadReviews = async () => {
      if (teacherId) {
        const fetchedReviews = await fetchReviews(Number(teacherId));
        setReviews(fetchedReviews);
      }
    };
    loadReviews();
  }, [teacherId]);

  const handleAddReview = () => {
    if (newReview.trim()) {
      const newReviewObj: Review = {
        id: reviews.length + 1,
        content: newReview.trim(),
      };
      setReviews([...reviews, newReviewObj]);
      setNewReview(''); // Wyczyść pole tekstowe po dodaniu opinii
    }
  };

  const handleGoBack = () => {
    navigate(-1); // Przechodzi do poprzedniej strony
  };

  return (
    <div
      className="teacher-reviews-page"
      style={{ padding: '20px', textAlign: 'center' }}
    >
      <h1>Opinie o Nauczycielu</h1>

      <div className="reviews-list" style={{ marginBottom: '20px' }}>
        {reviews.map((review) => (
          <div
            key={review.id}
            style={{
              marginBottom: '10px',
              padding: '10px',
              border: '1px solid #ccc',
              borderRadius: '5px',
            }}
          >
            {review.content}
          </div>
        ))}
      </div>

      <textarea
        value={newReview}
        onChange={(e) => setNewReview(e.target.value)}
        placeholder="Napisz swoją opinię..."
        style={{
          width: '100%',
          height: '80px',
          marginBottom: '10px',
          padding: '10px',
        }}
      />

      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginTop: '10px',
        }}
      >
        <AppButton label="Powrót" onClick={handleGoBack} />
        <AppButton label="Akceptuj" onClick={handleAddReview} />
      </div>
    </div>
  );
};

export default TeacherReviewsPage;
