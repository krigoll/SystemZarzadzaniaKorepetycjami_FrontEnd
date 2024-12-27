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
      alert('U¿ytkownik zosta³ usuniêty pomyœlnie!');
      goToUserListPage(navigate);
    } else {
      alert('Nie uda³u siê usun¹æ u¿ytkownika!');
    }
  };

  const handleBanUser = async () => {
    if (reason.length < 10 || reason.length > 99) {
      alert('Powód blokady u¿ytkownia musi zawieraæ siê w 10-99 znakach!');
      return false;
    }
    if (duration < 1) {
      alert('D³ugoœæ blokady u¿ytkownika musi wynosiæ co najmniej jeden dzieñ!');
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
      alert('U¿ytkownik zosta³ zablokowany pomyœlnie!');
      refetch();
    } else {
      alert('B³¹d podczas blokowania u¿ytkownika.');
    }
  };

  return (
      <div className="user-profile-container">
          <div className="user-profile-wrapper">
              <div className="user-profile-header">Szczegó³y u¿ytkownika</div>
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
                          <p><strong>Id:</strong> {numericPersonId}</p>
                          <p><strong>Imiê i nazwisko:</strong> {personData.name} {personData.surname}</p>
                          <p><strong>Data urodzenia:</strong> {personData.birthDate}</p>
                          <p><strong>Adres email:</strong> {personData.email}</p>
                          <p><strong>Numer telefonu:</strong> {personData.phoneNumber}</p>
                          <p><strong>Data do³¹czenia:</strong> {personData.joiningDate}</p>
                      </div>
                      <div className="user-profile-role">
                          <p><strong>Role:</strong></p>
                          <p>{personData.isStudent && 'Uczeñ'}</p>
                          <p>{personData.isTeacher && 'Nauczyciel'}</p>
                      </div>
                      <div className="user-profile-role">
                          <p><strong>Czy zablokowany:</strong> {personData.isBaned ? 'Tak' : 'Nie'}</p>
                          {personData.isBaned && (
                              <div>
                                  <p><strong>Przez:</strong> {personData.numberOfDays} dni</p>
                                  <p><strong>Powód:</strong> {personData.reason}</p>
                              </div>
                          )}
                      </div>
                  </div>
              ) : (
                  <div>£adowanie...</div>
              )}
              <div className="user-profile-button-container">
                  <AppButton
                      //className="delete-button"
                      label="Usuñ konto"
                      onClick={() => setDeleteDialog(!deleteDialog)}
                  />
                  {deleteDialog && (
                      <div>
                          Czy na pewno chcesz usun¹æ konto?
                          <div>
                          <br></br>
                          </div>
                          <div>
                          <AppButton
                              //className="delete-button"
                              label="PotwierdŸ"
                              onClick={() => handleDeleteUser()}
                          />
                          </div>
                      </div>
                  )}
                  <AppButton
                      //className="ban-button"
                      label="Zablokuj konto"
                      onClick={() => setBan(!ban)}
                  />
                  {ban && (
                      <div>
                          <div className="user-profile-form-field">
                              <label htmlFor="text">Powód:</label>
                              <input
                                  type="text"
                                  value={reason}
                                  onChange={(e) => setReason(e.target.value)}
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
                              //className="ban-button"
                              label={creating ? 'Blokowanie...' : 'PotwierdŸ'}
                              onClick={handleBanUser}
                              disabled={creating}
                          />
                          {createError && (
                              <p style={{ color: 'red' }}>B³¹d: {createError}</p>
                          )}
                          </div>
                  )}
              </div>
              <div className ="button-container">
              <AppButton label="Powrót" onClick={() => goToUserListPage(navigate)} />
                  </div>
              
          </div>
      </div>



  );
};

export default UserDetailsPage;
