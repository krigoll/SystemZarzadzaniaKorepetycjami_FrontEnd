import React, { useState } from 'react';
import AppButton from '../components/AppButton';
import { useNavigate } from 'react-router-dom';
import { useGetUsers } from '../lib/useGetUsers';
import { goToMenu, goToUserDetailsPage } from '../lib/Navigate';

interface Person {
    idPerson: number;
    name: string;
    surname: string;
    image: File | null;
    isTeacher: boolean;
    isStudent: boolean;
}

const UserListPage: React.FC = () => {
    const navigate = useNavigate();
    const { users, loading, error } = useGetUsers();

    const [searchText, setSearchText] = useState<string>('');
    const [roleFilter, setRoleFilter] = useState<string>('');

    const filteredUsers = users.filter((person: Person) => {
        const fullName = `${person.name} ${person.surname}`.toLowerCase();
        const matchesSearch = fullName.includes(searchText.toLowerCase());

        const matchesRole =
            roleFilter === '' ||
            (roleFilter === 'student' && person.isStudent) ||
            (roleFilter === 'teacher' && person.isTeacher);

        return matchesSearch && matchesRole;
    });

    if (loading) {
        return <p>Ładowanie użytkowników...</p>;
    }

    if (error) {
        return <p>Błąd: {error}</p>;
    }

    return (
        <div className="user-list-page">
            <div className="user-list-wrapper">
                <h1>Lista Użytkowników</h1>
                <div className="sort-container">
                    <input
                        type="text"
                        placeholder="Wyszukaj..."
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                    />
                    <select
                        value={roleFilter}
                        onChange={(e) => setRoleFilter(e.target.value)}
                    >
                        <option value="">Wszyscy</option>
                        <option value="student">Uczeń</option>
                        <option value="teacher">Nauczyciel</option>
                    </select>
                </div>

                <div className="user-list">
                    {filteredUsers.length === 0 ? (
                        <div className="no-users">Brak użytkowników</div>
                    ) : (
                        filteredUsers.map((person: Person) => (
                            <div key={person.idPerson} className="user-item">
                                <div className="user-info">
                                    <div className="user-name">
                                        {person.name} {person.surname}
                                    </div>
                                </div>
                                <div className="role">
                                    Role:
                                    <p>{person.isStudent && 'Uczeń'}</p>
                                    <p>{person.isTeacher && 'Nauczyciel'}</p>
                                </div>
                                <div className="user-photo">
                                    {person.image ? (
                                        <img
                                            src={URL.createObjectURL(person.image)}
                                            alt={`${person.name}`}
                                        />
                                    ) : null}
                                </div>
                                <div className="user-actions">
                                    <AppButton
                                        label="Szczegóły"
                                        onClick={() =>
                                            goToUserDetailsPage(navigate, person.idPerson)
                                        }
                                    />
                                </div>
                            </div>
                        ))
                    )}
                </div>
                <div className="button-container">
                    <AppButton label="Powrót" onClick={() => goToMenu(navigate)} />
                </div>
            </div>
        </div>
    );
};

export default UserListPage;
