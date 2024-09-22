import React from 'react';
import AppButton from '../components/AppButton';
import { useNavigate } from 'react-router-dom';
import { goToProfile } from '../lib/Navigate';
import { usePersonDelete } from '../lib/usePersonDelete';
import { useSelector } from 'react-redux';
import { RootState } from '../futures/store';
import { useHandleLogOut } from '../lib/LogOut';

const DeleteAccountPage: React.FC = () => {
  const navigate = useNavigate();
  const email = useSelector((state: RootState) => state.login.email);
  const { deletePerson } = usePersonDelete();
  const handleLogOut = useHandleLogOut();

  const handleDelete = async () => {
    const status = await deletePerson(email);

    if (status === 200) {
      alert('Person deleted successfully');
      handleLogOut();
    } else {
      alert('Failed to delete person');
    }
  };

  return (
    <div className="delete-account-page">
      <h1>Czy aby na pewno chcesz usunąć konto?</h1>
      <div className="button-container">
        <AppButton label="Tak" onClick={handleDelete} />
        <AppButton label="Nie" onClick={() => goToProfile(navigate)} />
      </div>
    </div>
  );
};

export default DeleteAccountPage;
