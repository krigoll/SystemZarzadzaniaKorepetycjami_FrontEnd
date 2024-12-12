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
            <button
                className="delete-account"
                onClick={() => goToDeleteAccountPage(navigate)}
            >
                Usuñ konto
            </button>
            <div className="profile-header">Profil</div>
            {personData ? (
                <div>
                    <div className="profile-picture">
                        {selectedFile && (
                            <img src={URL.createObjectURL(selectedFile)} alt="Profile" />
                        )}
                    </div>
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
                        <p>{personData.isStudent && 'Uczeñ'}</p>
                        <p>{personData.isTeacher && 'Nauczyciel'}</p>
                        <p>{personData.isAdmin && 'Admin'}</p>
                    </div>
                </div>
            ) : (
                <div>Loading...</div>
            )}

            <div className="button-container">
                <AppButton label="Powrót" onClick={() => goToUserListPage(navigate)} />
            </div>
        </div>
    );
};

export default UserDetailsPage;
