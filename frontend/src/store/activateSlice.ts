import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  username: "",
  avatarPath: "",
  avatarURL: "",
};

const activateSlice = createSlice({
  name: "activate",
  initialState: initialState,
  reducers: {
    setUserName: (state, action) => {
      state.username = action.payload;
    },
    setProfilePath: (state, action) => {
      state.avatarPath = action.payload;
    },
    setProfileURL: (state, action) => {
      state.avatarURL = action.payload;
    },
  },
});

export const { setUserName, setProfilePath, setProfileURL } =
  activateSlice.actions;

export default activateSlice.reducer;
