import React from 'react';
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

  if (loading) {
    return <p>Loading users...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
      <div className="user-list-page">
          <div className="user-list-wrapper">
              <h1>Lista Użytkowników</h1>
              <div className="user-list">
                  {users.length === 0 ? (
                      <div className="no-users">Brak użytkowników</div>
                  ) : (
                      users.map((person: Person) => (
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
                                  ) : (
                                      null
                                  )}
                              </div>
                              <div className="user-actions">
                                  <AppButton
                                      label="Szczegóły"
                                      onClick={() => goToUserDetailsPage(navigate, person.idPerson)}
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
