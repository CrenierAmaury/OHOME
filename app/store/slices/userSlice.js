import {createSlice} from '@reduxjs/toolkit';

export const userSlice = createSlice({
  name: 'user',
  initialState: {
    uid: '',
    name: '',
    email: '',
    avatar: 'default',
  },
  reducers: {
    updateUid: (state, action) => {
      state.uid = action.payload;
    },
    updateName: (state, action) => {
      state.name = action.payload;
    },
    updateEmail: (state, action) => {
      state.email = action.payload;
    },
    updateAvatar: (state, action) => {
      state.avatar = action.payload;
    },
  },
});

export const {updateUid, updateName, updateEmail, updateAvatar} =
  userSlice.actions;

export default userSlice.reducer;
