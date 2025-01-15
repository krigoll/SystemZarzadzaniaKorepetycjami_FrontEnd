import { useNavigate, useParams } from 'react-router-dom';
import AppButton from '../components/AppButton';
import {
  goToStudentOpinionPage,
  goToTeacherOpinionAdminPage,
  goToUserListPage,
} from '../lib/Navigate';
import { useUserDetails } from '../lib/useUserDetails';
import { useState } from 'react';
import { usePersonDelete } from '../lib/usePersonDelete';
import { useCreateBan } from '../lib/useCreateBan';
import { useDeleteBan } from '../lib/useDeleteBan';

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
  const [unban, setUnban] = useState<boolean>(false);
  const [reason, setReason] = useState<string>('');
  const [duration, setDuration] = useState<number>(1);
  const { deletePerson } = usePersonDelete();

  const { createBan, loading: creating, error: createError } = useCreateBan();

  const { deleteBan, loading: deleting, error: deleteError } = useDeleteBan();

  const handleDeleteUser = async () => {
    const status = await deletePerson(personData.email);

    if (status === 200) {
      alert('Użytkownik został usunięty pomyślnie!');
      goToUserListPage(navigate);
    } else {
      alert('Nie udału sie usunąć użytkownika!');
    }
  };

  const handleBanUser = async () => {
    if (reason.length < 10 || reason.length > 99) {
      alert('Powód blokady użytkownia musi zawierać się w 10-99 znakach!');
      return false;
    }
    if (duration < 1) {
      alert(
        'Długość blokady użytkownika musi wynosić co najmniej jeden dzień!'
      );
      return false;
    }

    const banDTO: BanDTO = {
      idPerson: numericPersonId,
      banedName: personData.name,
      startTime: new Date().toISOString(),
      lenghtInDays: duration,
      reason: reason,
    };

    const returnValue = await createBan(banDTO);

    if (returnValue == 0) {
      alert('Użytkownik został zablokowany pomyślnie!');
      refetch();
      setBan(false);
    } else {
      alert('Bład podczas blokowania użytkownika.');
    }
  };

  const handleUnnanUser = async () => {
    deleteBan(personData.idBan);
    setUnban(false);
    refetch();
  };

  return (
    <div className="user-profile-container">
      <div className="user-profile-wrapper">
        <div className="user-profile-header">Szczegły użytkownika</div>
        {personData ? (
          <div>
            {personData.image ? (
              <img
                className="user-profile-image"
                src={URL.createObjectURL(personData.image)}
                alt={`${personData.name}`}
              />
            ) : null}
            <div className="user-profile-details">
              <p>
                <strong>Id:</strong> {numericPersonId}
              </p>
              <p>
                <strong>Imię i nazwisko:</strong> {personData.name}{' '}
                {personData.surname}
              </p>
              <p>
                <strong>Data urodzenia:</strong> {personData.birthDate}
              </p>
              <p>
                <strong>Adres email:</strong> {personData.email}
              </p>
              <p>
                <strong>Numer telefonu:</strong> {personData.phoneNumber}
              </p>
              <p>
                <strong>Data dołączenia:</strong> {personData.joiningDate}
              </p>
            </div>
            <div className="user-profile-role">
              <p>
                <strong>Role:</strong>
              </p>
              <p>{personData.isStudent && 'Uczeń'}</p>
              <p>{personData.isTeacher && 'Nauczyciel'}</p>
            </div>
            <div className="user-profile-role">
              <p>
                <strong>Czy zablokowany:</strong>{' '}
                {personData.isBaned ? 'Tak' : 'Nie'}
              </p>
              {personData.isBaned && (
                <div>
                  <p>
                    <strong>Przez:</strong> {personData.numberOfDays} dni
                  </p>
                  <p>
                    <strong>Powód:</strong> {personData.reason}
                  </p>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div>Ładowanie...</div>
        )}
        <div className="user-profile-button-container">
          <AppButton
            label="Usuń konto"
            onClick={() => setDeleteDialog(!deleteDialog)}
          />
          {deleteDialog && (
            <div>
              Czy na pewno chcesz usunąć konto?
              <div>
                <br></br>
              </div>
              <div>
                <AppButton
                  label="Potwierdż"
                  onClick={() => handleDeleteUser()}
                />
              </div>
            </div>
          )}
          {personData && personData.isBaned ? (
            <AppButton
              label="Odblokuj konto"
              onClick={() => setUnban(!unban)}
              disabled={deleting}
            />
          ) : (
            <AppButton label="Zablokuj konto" onClick={() => setBan(!ban)} />
          )}
          {personData && personData.isStudent && (
            <AppButton
              label="Wstawione opinie"
              onClick={() =>
                goToStudentOpinionPage(
                  navigate,
                  `${personData.email} ${personData.name} ${personData.surname}`
                )
              }
            />
          )}
          {personData && personData.isTeacher && (
            <AppButton
              label="Opinie nauczyciela"
              onClick={() =>
                goToTeacherOpinionAdminPage(
                  navigate,
                  `${numericPersonId} ${personData.name} ${personData.surname}`
                )
              }
            />
          )}
          {ban && (
            <div>
              <div className="user-profile-form-field">
                <label htmlFor="text">Powód:</label>
                <textarea
                  value={reason}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value.length > 100) {
                      alert('Maksymalna długość powodu to 100 znaków.');
                    } else {
                      setReason(value);
                    }
                  }}
                />
              </div>
              <div className="user-profile-form-field">
                <label htmlFor="duration">Czas trwania (dni):</label>
                <input
                  type="number"
                  id="duration"
                  min="1"
                  value={duration}
                  onChange={(e) => setDuration(parseInt(e.target.value, 10))}
                />
              </div>
              <AppButton
                label={creating ? 'Blokowanie...' : 'Potwierdź'}
                onClick={handleBanUser}
                disabled={creating}
              />
              {createError && (
                <p style={{ color: 'red' }}>Błąd: {createError}</p>
              )}
            </div>
          )}
          {unban && (
            <div>
              <p>
                <strong>Czy na pewno chcesz odblokować konto</strong>
              </p>
              <AppButton
                label={creating ? 'Odblokowywanie...' : 'Potwierdź'}
                onClick={handleUnnanUser}
                disabled={creating}
              />
              {deleteError && (
                <p style={{ color: 'red' }}>Błąd: {deleteError}</p>
              )}
            </div>
          )}
        </div>
        <div className="button-container">
          <AppButton
            label="Powrót"
            onClick={() => goToUserListPage(navigate)}
          />
        </div>
      </div>
    </div>
  );
};

export default UserDetailsPage;
