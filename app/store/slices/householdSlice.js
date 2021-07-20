import {createSlice} from '@reduxjs/toolkit';

export const householdSlice = createSlice({
  name: 'household',
  initialState: {
    id: '',
    budgetId: '',
    listGroupId: '',
  },
  reducers: {
    updateHouseholdId: (state, action) => {
      state.id = action.payload;
    },
    updateBudgetId: (state, action) => {
      state.budgetId = action.payload;
    },
    updateListGroupId: (state, action) => {
      state.listGroupId = action.payload;
    },
  },
});

export const {updateHouseholdId, updateBudgetId, updateListGroupId} =
  householdSlice.actions;

export default householdSlice.reducer;
