import {createSlice} from '@reduxjs/toolkit';

export const householdSlice = createSlice({
  name: 'household',
  initialState: {
    id: '',
    budgetId: '',
  },
  reducers: {
    updateHouseholdId: (state, action) => {
      state.id = action.payload;
    },
    updateBudgetId: (state, action) => {
      state.budgetId = action.payload;
    },
  },
});

export const {updateHouseholdId, updateBudgetId} = householdSlice.actions;

export default householdSlice.reducer;
