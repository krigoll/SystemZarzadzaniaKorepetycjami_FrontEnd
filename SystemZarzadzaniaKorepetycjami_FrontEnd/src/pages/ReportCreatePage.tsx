import React, { useState } from 'react';
import { goToMenu } from '../lib/Navigate';
import { useNavigate } from 'react-router-dom';
import { useCreateReport } from '../lib/useCreateReport';
import { useSelector } from 'react-redux';
import { RootState } from '../futures/store';

interface CreateReportProps {
  IdSender: number;
  Title: string;
  Content: string;
  DateTime: string;
  IsDealt: boolean;
}

const formatDate = (date: Date): string => {
  const padZero = (num: number): string => num.toString().padStart(2, '0');
  const day = padZero(date.getDate());
  const month = padZero(date.getMonth() + 1);
  const year = date.getFullYear();
  const hours = padZero(date.getHours());
  const minutes = padZero(date.getMinutes());
  const seconds = padZero(date.getSeconds());

  return `${day}-${month}-${year} ${hours}:${minutes}:${seconds}`;
};

const NewReportForm: React.FC = () => {
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const navigate = useNavigate();
  const { createReport, loading, error } = useCreateReport();
  const uId = useSelector((state: RootState) => state.login.idPerson);

  const handleSubmit = async () => {
    if (title.trim().length <= 1 || title.trim().length >= 50) {
      alert('Tytuł musi mieć od 1 do 50 znaków!');
      return;
    }
    if (description.trim().length <= 1 || description.trim().length >= 500) {
      alert('Opis musi mieć od 1 do 500 znaków!');
      return;
    }
    const now = new Date();
    const CreateReport: CreateReportProps = {
      IdSender: uId,
      Title: title,
      Content: description,
      DateTime: formatDate(now),
      IsDealt: false,
    };
    const returnValue = await createReport(CreateReport);
    if (returnValue == 0) {
      alert('Zgłoszenie zostało wysłane pomyślnie!');
      setTitle('');
      setDescription('');
    } else alert('Nie udało się wysłać zgłoszenia!');
  };

  return (
    <div className="ticket-form">
      <div className="ticket-form-box">
        <h1>Nowe Zgłoszenie</h1>

        <div>
          <div>
            <label htmlFor="title">Tytuł zgłoszenia</label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Wpisz tytuł zgłoszenia"
            />
          </div>

          <div>
            <label htmlFor="description">Opis zgłoszenia</label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Wpisz szczegóły zgłoszenia..."
              rows={6}
            />
          </div>

          <div className="ticket-form-actions">
            <button onClick={() => goToMenu(navigate)}>Powrót</button>
            <button onClick={handleSubmit} disabled={loading}>
              Wyślij
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewReportForm;