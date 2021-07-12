import {createSlice} from '@reduxjs/toolkit';

export const userSlice = createSlice({
  name: 'user',
  initialState: {
    uid: '',
  },
  reducers: {
    updateUid: (state, action) => {
      state.uid = action.payload;
    },
  },
});

export const {updateUid} = userSlice.actions;

export default userSlice.reducer;
