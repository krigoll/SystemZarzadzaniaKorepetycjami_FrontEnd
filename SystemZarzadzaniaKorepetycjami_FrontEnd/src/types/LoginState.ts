export interface LoginState {
  email: string;
  jwtToken: string;
  refreshToken: string;
  isAdmin: boolean;
  isTeacher: boolean;
  isStudent: boolean;
}