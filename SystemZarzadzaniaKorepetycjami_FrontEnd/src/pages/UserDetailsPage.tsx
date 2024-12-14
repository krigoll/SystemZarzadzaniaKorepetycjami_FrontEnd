import { useNavigate, useParams } from 'react-router-dom';
import AppButton from '../components/AppButton';
import { goToUserListPage } from '../lib/Navigate';
import { useUserDetails } from '../lib/useUserDetails';
import { useState } from 'react';
import { usePersonDelete } from '../lib/usePersonDelete';

const UserDetailsPage: React.FC = () => {
  const navigate = useNavigate();
  const { idPerson } = useParams<{ idPerson: string }>();
  const numericPersonId = idPerson ? parseInt(idPerson) : null;
  const personData = useUserDetails(numericPersonId);
  const [deleteDialog, setDeleteDialog] = useState<boolean>(false);
  const [ban, setBan] = useState<boolean>(false);
  const [reason, setReason] = useState<string>("");
  const [duration, setDuration] = useState<number>(1);
  const { deletePerson } = usePersonDelete();

  const handleDeleteUser = async () => {
    const status = await deletePerson(personData.email);

    if (status === 200) {
      alert('Person deleted successfully');
      goToUserListPage(navigate);
    } else {
      alert('Failed to delete person');
    }
  };
  
  const handleBanUser = () =>{
    if (reason.length < 10 || reason.length > 99) {
        alert('Powód musi mieœciæ siê w przedziale od 10 do 100 znaków.');
        return false;
    }
    if (duration < 1) {
        alert('D³ugoœæ mósi byæ powy¿ej denego.');
        return false;
    }
  }

  return (
    <div className="profile-container">
      <div className="profile-header">Szczegu³y u¿ytkownika</div>
      {personData ? (
        <div>
          {personData.image ? (
            <img
              src={URL.createObjectURL(personData.image)}
              alt={`${personData.name}`}
            />
          ) : (
            '[Brak Zdjêcia]'
          )}
          <div className="profile-details">
            <p>Id: {numericPersonId}</p>
            <p>
              Imiê i nazwisko: {personData.name} {personData.surname}
            </p>
            <p>Data Urodzenia: {personData.birthDate}</p>
            <p>Adres email: {personData.email}</p>
            <p>Numer telefonu: {personData.phoneNumber}</p>
            <p>Data do³¹czenia: {personData.joiningDate}</p>
          </div>
          <div className="role">
            Role:
            <p>{personData.isStudent && 'Uczeñ'}</p>
            <p>{personData.isTeacher && 'Nauczyciel'}</p>
          </div>
        </div>
      ) : (
        <div>£adowanie...</div>
      )}
    
      <div className="button-container">
        <AppButton label="Usuñ konto" onClick={() => setDeleteDialog(!deleteDialog)} />
            {deleteDialog && (
                <div>
                    Czy na pewno chcesz usun¹æ konto <AppButton label="Potwierdz" onClick={() => handleDeleteUser()} />
                </div>
            )}
        <AppButton label="Zablokuj konto" onClick={() => setBan(!ban)} />
            {ban && (
                <div>
                    <div className="form-field">
                    <label htmlFor="text">Powód:</label>
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
                    onChange={(e) => setDuration(parseInt(e.target.value, 1))}
                    />
                </div>
                <AppButton label="Potwierdz zablokowanie" onClick={() => handleBanUser()} />
                </div>
            )}
        <AppButton label="Powrót" onClick={() => goToUserListPage(navigate)} />
      </div>
    </div>
  );
};

export default UserDetailsPage;
