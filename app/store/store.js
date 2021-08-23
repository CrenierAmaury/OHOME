import {configureStore} from '@reduxjs/toolkit';
import userReducer from './slices/userSlice';
import householdReducer from './slices/householdSlice';

export default configureStore({
  reducer: {
    user: userReducer,
    household: householdReducer,
  },
});
