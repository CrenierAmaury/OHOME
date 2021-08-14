import {createSlice} from '@reduxjs/toolkit';
import _ from 'lodash';

export const householdSlice = createSlice({
  name: 'household',
  initialState: {
    id: '',
    name: '',
    calendarId: '',
    budgetId: '',
    listGroupId: '',
    mealGroupId: '',
    members: [],
  },
  reducers: {
    updateHouseholdId: (state, action) => {
      state.id = action.payload;
    },
    updateHouseholdName: (state, action) => {
      state.name = action.payload;
    },
    updateCalendarId: (state, action) => {
      state.calendarId = action.payload;
    },
    updateBudgetId: (state, action) => {
      state.budgetId = action.payload;
    },
    updateListGroupId: (state, action) => {
      state.listGroupId = action.payload;
    },
    updateMealGroupId: (state, action) => {
      state.mealGroupId = action.payload;
    },
    updateMembers: (state, action) => {
      if (
        !_.find(state.members, e => {
          return e.id === action.payload.id;
        })
      ) {
        state.members.push(action.payload);
      }
    },
  },
});

export const {
  updateHouseholdId,
  updateHouseholdName,
  updateCalendarId,
  updateBudgetId,
  updateListGroupId,
  updateMealGroupId,
  updateMembers,
} = householdSlice.actions;

export default householdSlice.reducer;
