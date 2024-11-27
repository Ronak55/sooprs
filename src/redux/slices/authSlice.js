import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  userDetails: {
    userId: null,
    email: null,
    name: null,
    slug: null,
    profilePic: null,
  },
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, action) => {
      state.userDetails = { ...action.payload.userDetails };
    },
  },
});

export const { login } = authSlice.actions;

export default authSlice.reducer;
