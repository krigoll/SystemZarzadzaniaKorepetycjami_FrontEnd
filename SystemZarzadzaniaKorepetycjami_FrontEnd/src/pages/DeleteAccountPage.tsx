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
            alert('Konto zostało usunięte pomyślnie!');
            handleLogOut();
        } else {
            alert('Nie udało się usunąć konta!');
        }
    };

    return (
        <div className="delete-account-page">
            <div className="delete-account-box">
                <h1>Czy aby na pewno chcesz usunąć konto?</h1>
                <div className="delete-account-button-container">
                    <button
                        className="delete-account-button"
                        onClick={handleDelete}
                    >
                        Tak
                    </button>
                    <button
                        className="delete-account-button no-button"
                        onClick={() => goToProfile(navigate)}
                    >
                        Nie
                    </button>
                </div>
            </div>
        </div>

    );
};

export default DeleteAccountPage;
