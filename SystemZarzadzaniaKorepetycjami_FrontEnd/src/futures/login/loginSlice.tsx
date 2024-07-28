import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { LoginState } from '../../types/LoginState';

const initialState: LoginState = {
  email: '',
  jwtToken: '',
  refreshToken: '',
};

export const loginSlice = createSlice({
  name: 'login',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<{ email: string; jwtToken: string; refreshToken: string }>) => {
      state.email = action.payload.email;
      state.jwtToken = action.payload.jwtToken;
      state.refreshToken = action.payload.refreshToken;
    },
    deSetUser: (state) => {
      state.email = '';
      state.jwtToken = '';
      state.refreshToken = '';
    },
  },
});

export const { setUser, deSetUser } = loginSlice.actions;
export default loginSlice.reducer;
