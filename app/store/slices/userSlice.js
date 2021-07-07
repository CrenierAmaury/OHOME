import {createSlice} from '@reduxjs/toolkit';

export const userSlice = createSlice({
  name: 'user',
  initialState: {
    uid: '',
    name: 'unknown',
    email: 'unknown',
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
  },
});

export const {updateName, updateEmail, updateUid} = userSlice.actions;

export default userSlice.reducer;
