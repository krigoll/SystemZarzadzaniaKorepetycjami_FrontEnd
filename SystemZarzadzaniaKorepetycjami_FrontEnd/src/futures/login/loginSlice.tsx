import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  email: null,
  jwtToken: null,
  refreshToken: null,
};

export const loginSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action) => {
      const { email, jwtToken, refreshToken } = JSON.parse(action.payload);
      state.email = email;
      state.jwtToken = jwtToken;
      state.refreshToken = refreshToken;
    },
    deSetUser: (state) => {
      state.email = null;
      state.jwtToken = null;
      state.refreshToken = null;
    },
  },
});
export const { setUser, deSetUser } = loginSlice.actions;
export default loginSlice.reducer;
