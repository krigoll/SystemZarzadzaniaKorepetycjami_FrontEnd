export interface DataToEdit {
    idPerson: number;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    isStudent: boolean;
    isTeacher: boolean;
    isAdmin: boolean;
    selectedFile: File | null;         
  }