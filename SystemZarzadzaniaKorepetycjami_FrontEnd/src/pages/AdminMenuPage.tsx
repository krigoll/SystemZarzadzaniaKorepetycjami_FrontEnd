import React from 'react';
import AppButton from '../components/AppButton';
import Menu from './Menu';
import { useNavigate } from 'react-router-dom';
import {
  goToUserListPage,
  goToTeachersReviewsListPage,
  goToSubjectListPage,
} from '../lib/Navigate';

const AdminMenuPage: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div className="options-container">
      <Menu />
      <AppButton
        label="Lista użytkowników"
        onClick={() => goToUserListPage(navigate)}
      />
      <AppButton
        label="Zgłoszenia(NI)"
        onClick={() => goToTeachersReviewsListPage(navigate)}
      />
      <AppButton
        label="Przedmioty"
        onClick={() => goToSubjectListPage(navigate)}
      />
    </div>
  );
};

export default AdminMenuPage;
