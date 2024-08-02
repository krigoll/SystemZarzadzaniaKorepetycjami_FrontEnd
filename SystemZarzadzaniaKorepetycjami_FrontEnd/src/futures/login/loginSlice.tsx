import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { jwtDecode } from 'jwt-decode';
import { LoginState } from '../../types/LoginState';

interface DecodedToken {
  isAdmin: string;
  isTeacher: string;
  isStudent: string;
}

const initialState: LoginState = {
  email: '',
  jwtToken: '',
  refreshToken: '',
  isAdmin: false,
  isTeacher: false,
  isStudent: false,
};

export const loginSlice = createSlice({
  name: 'login',
  initialState,
  reducers: {
    setUser: (
      state,
      action: PayloadAction<{
        email: string;
        jwtToken: string;
        refreshToken: string;
      }>
    ) => {
      const { email, jwtToken, refreshToken } = action.payload;

      let decoded: DecodedToken = {
        isAdmin: 'false',
        isTeacher: 'false',
        isStudent: 'false',
      };

      try {
        decoded = jwtDecode(jwtToken);
      } catch (error) {
        console.error('Invalid JWT token:', error);
      }

      state.email = email;
      state.jwtToken = jwtToken;
      state.refreshToken = refreshToken;
      state.isAdmin = decoded.isAdmin === 'True';
      state.isTeacher = decoded.isTeacher === 'True';
      state.isStudent = decoded.isStudent === 'True';
    },
    deSetUser: (state) => {
      state.email = '';
      state.jwtToken = '';
      state.refreshToken = '';
      state.isAdmin = false;
      state.isTeacher = false;
      state.isStudent = false;
    },
  },
});

export const { setUser, deSetUser } = loginSlice.actions;
export default loginSlice.reducer;
