import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currentUser: null,
  loader: false,
  error: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    signInStart: (state) => {
      state.loader = true;
      state.error = null;
    },
    signInSuccess: (state, action) => {
      state.currentUser = action.payload;
      state.loader = false;
      state.error = null;
    },
    signInFailure: (state, action) => {
      state.error = action.payload;
      state.loader = false;
    },
    updateStart: (state) => {
      state.loader = true;
      state.error = null;
    },
    updateSuccess: (state, action) => {
      state.currentUser = action.payload;
      state.loader = false;
      state.error = null;
    },
    updateFailure: (state, action) => {
      state.loader = false;
      state.error = action.payload;
    },
    deleteUserStart: (state) => {
      state.loader = true;
      state.error = null;
    },
    deleteUserSuccess: (state) => {
      state.currentUser = null;
      state.loader = false;
      state.error = null;
    },
    deleteUserFailure: (state, action) => {
      state.error = action.payload;
      state.loader = false;
    },
    signOutStart: (state) => {
      state.loader = true;
      state.error = null;
    },
    signOutSuccess: (state) => {
      state.currentUser = null;
      state.loader = false;
      state.error = null;
    },
    signOutFailure: (state, action) => {
      state.loader = false;
      state.error = action.payload;
    },
  },
});

export const {
  signInStart,
  signInSuccess,
  signInFailure,
  updateStart,
  updateSuccess,
  updateFailure,
  deleteUserStart,
  deleteUserSuccess,
  deleteUserFailure,
  signOutSuccess,
} = userSlice.actions;
export default userSlice.reducer;
