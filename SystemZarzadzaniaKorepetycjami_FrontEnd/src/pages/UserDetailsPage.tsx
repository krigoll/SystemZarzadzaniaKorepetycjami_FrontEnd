import { useNavigate, useParams } from "react-router-dom";
import AppButton from "../components/AppButton";
import { goToDeleteAccountPage, goToUserListPage } from "../lib/Navigate";
import { useUserDetails } from "../lib/useUserDetails";

const UserDetailsPage: React.FC = () => {
    const navigate = useNavigate();
    const { idPerson } = useParams<{ idPerson: string }>();
    const numericPersonId = idPerson ? parseInt(idPerson) : null;
    const personData = useUserDetails(numericPersonId);


    return (
        <div className="profile-container">
            <div className="profile-header">Profil</div>
            {personData ? (
                <div>
                    {personData.image ? (
                  <img
                    src={URL.createObjectURL(personData.image)}
                    alt={`${person.name}`}
                  />
                ) : (
                  '[Brak Zdj�cia]'
                )}
                    <div className="profile-details">
                        <p>
                            {personData.name} {personData.surname}
                        </p>
                        <p>{personData.birthDate}</p>
                        <p>{personData.email}</p>
                        <p>{personData.phoneNumber}</p>
                        <p>{personData.joiningDate}</p>
                    </div>
                    <div className="role">
                        Role:
                        <p>{personData.isStudent && 'Ucze�'}</p>
                        <p>{personData.isTeacher && 'Nauczyciel'}</p>
                        <p>{personData.isAdmin && 'Admin'}</p>
                    </div>
                </div>
            ) : (
                <div>Loading...</div>
            )}

            <div className="button-container">
                <AppButton label="Powr�t" onClick={() => goToUserListPage(navigate)} />
            </div>
        </div>
    );
};

export default UserDetailsPage;
