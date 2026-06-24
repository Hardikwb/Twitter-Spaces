import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isAuth: false,
  user: null,
  code: {
    email: "",
    hash: "",
  },
};
// authSliceReducer
const authSlice = createSlice({
  name: "auth",
  initialState: initialState,
  reducers: {
    setAuth: (state, action) => {
      ((state.isAuth = action.payload.isAuth),
        (state.user = action.payload.user));
    },
    setCode: (state, action) => {
      const { email, hash } = action.payload;
      state.code.email = email;
      state.code.hash = hash;
    },
  },
});

export const { setAuth, setCode } = authSlice.actions;
export default authSlice.reducer;
