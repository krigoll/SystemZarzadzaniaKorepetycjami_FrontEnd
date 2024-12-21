import { useNavigate, useParams } from 'react-router-dom';
import AppButton from '../components/AppButton';
import { goToUserListPage } from '../lib/Navigate';
import { useUserDetails } from '../lib/useUserDetails';
import { useState } from 'react';
import { usePersonDelete } from '../lib/usePersonDelete';
import { useCreateBan } from '../lib/useCreateBan';

interface BanDTO {
  idPerson: number | null;
  banedName: string;
  startTime: string;
  lenghtInDays: number;
  reason: string;
}

const UserDetailsPage: React.FC = () => {
  const navigate = useNavigate();
  const { idPerson } = useParams<{ idPerson: string }>();
  const numericPersonId = idPerson ? parseInt(idPerson) : null;
  const { personData, refetch } = useUserDetails(numericPersonId);
  const [deleteDialog, setDeleteDialog] = useState<boolean>(false);
  const [ban, setBan] = useState<boolean>(false);
  const [reason, setReason] = useState<string>('');
  const [duration, setDuration] = useState<number>(1);
  const { deletePerson } = usePersonDelete();

  const { createBan, loading: creating, error: createError } = useCreateBan();

  const handleDeleteUser = async () => {
    const status = await deletePerson(personData.email);

    if (status === 200) {
      alert('Person deleted successfully');
      goToUserListPage(navigate);
    } else {
      alert('Failed to delete person');
    }
  };

  const handleBanUser = async () => {
    if (reason.length < 10 || reason.length > 99) {
      alert('Pow?d musi mie?ci? si? w przedziale od 10 do 100 znak?w.');
      return false;
    }
    if (duration < 1) {
      alert('D?ugo?? m?si by? powy?ej denego.');
      return false;
    }

    const banDTO: BanDTO = {
      idPerson: numericPersonId,
      banedName: personData.name,
      startTime: new Date().toISOString(),
      lenghtInDays: duration,
      reason: reason,
    };

    await createBan(banDTO);

    if (!createError) {
      alert('U?ytkownik zosta? zablokowany!');
      refetch();
    } else {
      alert('B³¹d podczas blokowania u¿ytkownika.');
    }
  };

  return (
    <div className="profile-container">
      <div className="profile-header">Szczegu?y u?ytkownika</div>
      {personData ? (
        <div>
          {personData.image ? (
            <img
              src={URL.createObjectURL(personData.image)}
              alt={`${personData.name}`}
            />
          ) : (
            '[Brak Zdj?cia]'
          )}
          <div className="profile-details">
            <p>Id: {numericPersonId}</p>
            <p>
              Imi? i nazwisko: {personData.name} {personData.surname}
            </p>
            <p>Data Urodzenia: {personData.birthDate}</p>
            <p>Adres email: {personData.email}</p>
            <p>Numer telefonu: {personData.phoneNumber}</p>
            <p>Data do??czenia: {personData.joiningDate}</p>
          </div>
          <div className="role">
            Role:
            <p>{personData.isStudent && 'Ucze?'}</p>
            <p>{personData.isTeacher && 'Nauczyciel'}</p>
          </div>
          <div className="role">
            <p>Czy zablokowany: {personData.isBaned ? 'Tak' : 'Nie'}</p>
            {personData.isBaned && (
              <div>
                <p> Przez {personData.numberOfDays} dni</p>
                <p> Pow?d: {personData.reason}</p>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div>?adowanie...</div>
      )}

      <div className="button-container">
        <AppButton
          label="Usu? konto"
          onClick={() => setDeleteDialog(!deleteDialog)}
        />
        {deleteDialog && (
          <div>
            Czy na pewno chcesz usun?? konto{' '}
            <AppButton label="Potwierdz" onClick={() => handleDeleteUser()} />
          </div>
        )}
        <AppButton label="Zablokuj konto" onClick={() => setBan(!ban)} />
        {ban && (
          <div>
            <div className="form-field">
              <label htmlFor="text">Pow?d:</label>
              <input
                type="text"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
              />
            </div>
            <div className="form-field">
              <label htmlFor="duration">Czas trwania (dni):</label>
              <input
                type="number"
                id="duration"
                min="1"
                value={duration}
                onChange={(e) => setDuration(parseInt(e.target.value, 10))}
              />
            </div>
            <AppButton label={creating ? 'Blokowanie...' : 'Potwierdz zablokowanie'} onClick={handleBanUser} disabled={creating}/>
                      {createError && <p style={{ color: 'red' }}>B³¹d: {createError}</p>}
          </div>
        )}
        <AppButton label="Powr?t" onClick={() => goToUserListPage(navigate)} />
      </div>
    </div>
  );
};

export default UserDetailsPage;
