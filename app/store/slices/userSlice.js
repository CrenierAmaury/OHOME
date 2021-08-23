import {createSlice} from '@reduxjs/toolkit';
import _ from 'lodash';

export const userSlice = createSlice({
  name: 'user',
  initialState: {
    uid: '',
    name: '',
    email: '',
    avatar: 'default',
    households: [],
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
    updateHouseholds: (state, action) => {
      if (
        !_.find(state.households, e => {
          return e.id === action.payload.id;
        })
      ) {
        state.households.push(action.payload);
      }
    },
    cleanAllUser: state => {
      state.uid = '';
      state.name = '';
      state.email = '';
      state.avatar = 'default';
      state.households.length = 0;
    },
  },
});

export const {
  updateUid,
  updateName,
  updateEmail,
  updateAvatar,
  updateHouseholds,
  cleanAllUser,
} = userSlice.actions;

export default userSlice.reducer;
