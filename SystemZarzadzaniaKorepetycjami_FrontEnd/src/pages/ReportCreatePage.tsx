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

const NewReportForm: React.FC = () => {
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const navigate = useNavigate();
  const { createReport, loading, error } = useCreateReport();
  const uId = useSelector((state: RootState) => state.login.idPerson);

  const handleSubmit = () => {
    if (title.length < 1) return;
    if (description.length < 1) return;
    const CreateReport: CreateReportProps = {
      IdSender: uId,
      Title: title,
      Content: description,
      DateTime: new Date().toLocaleString(),
      IsDealt: false,
    };
    createReport(CreateReport);
    if (!error) {
      alert('Zgłoszenie wysłane pomyśnie');
      setTitle('');
      setDescription('');
    } else alert('nie udało się wysłać zgłoszenia');
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
                      <button onClick={handleSubmit} disabled={loading}>
                          Wyślij
                      </button>
                      <button onClick={() => goToMenu(navigate)}>
                          Powrót
                      </button>
                  </div>
                  {error && <p className="error-message">Błąd: {error}</p>}
              </div>
          </div>
      </div>

  );
};

export default NewReportForm;
