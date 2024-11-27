import React from 'react';
import AppButton from '../components/AppButton';
import { useNavigate } from 'react-router-dom';
import { useGetUsers } from '../lib/useGetUsers'; 
import { goToAdminMenuPage } from '../lib/Navigate';


interface Person {
    id: number;
    name: string;
    surname: string;
    image: File | null;
    isTeacher: boolean;
    isStudent: boolean;
}

const UserListPage: React.FC = () => {
    const navigate = useNavigate();
    const { users, loading, error } = useGetUsers();

    if (loading) {
        return <p>Loading users...</p>;
    }

    if (error) {
        return <p>Error: {error}</p>;
    }

    return (
        <div className="user-list-page">
            <h1>
                Lista U¿ytkowników
            </h1>
            <div className="user-list">
                {users.length === 0 ? (
                    <div className="no-users">Brak u¿ytkowników</div>
                ) : (
                    users.map((person: Person) => (
                        <div key={person.id} className="user-item">
                            <div className="user-info">
                                <div className="user-name">
                                    {person.name} {person.surname} 
                                </div>
                            </div>
                            <div className="role">
                                Role:
                                <p>{person.isStudent && 'Uczeñ'}</p>
                                <p>{person.isTeacher && 'Nauczyciel'}</p>
                            </div>
                            <div className="user-photo">
                                {person.image ? (
                                    <img
                                        src={URL.createObjectURL(person.image)}
                                        alt={`${person.name}`}
                                    />
                                ) : (
                                    '[Brak Zdjêcia]'
                                )}
                            </div>
                            <div className="user-actions">
                                <AppButton
                                    label="Szczegó³y"
                                    onClick={() => console.log("Jajko")}
                                />
                            </div>
                        </div>
                    ))
                )}
            </div>
            <div className="button-container">
                <AppButton
                    label="Powrót"
                    onClick={() => goToAdminMenuPage(navigate)}
                />
                {/* <AppButton label="Filtry" onClick={() => goToFiltersPage(navigate)} /> */}
            </div>
        </div>
    );
};

export default UserListPage;
