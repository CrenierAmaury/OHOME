import {createSlice} from '@reduxjs/toolkit';

export const householdSlice = createSlice({
  name: 'household',
  initialState: {
    id: '',
    calendarId: '',
    budgetId: '',
    listGroupId: '',
    mealGroupId: '',
  },
  reducers: {
    updateHouseholdId: (state, action) => {
      state.id = action.payload;
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
  },
});

export const {
  updateHouseholdId,
  updateCalendarId,
  updateBudgetId,
  updateListGroupId,
  updateMealGroupId,
} = householdSlice.actions;

export default householdSlice.reducer;
