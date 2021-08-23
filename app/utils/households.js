import _ from 'lodash';

export function renderHouseholdName(households, householdId) {
  const householdCheck =
    households.length > 0 &&
    _.find(households, e => {
      return e.id === householdId;
    });
  if (householdCheck) {
    return householdCheck.name;
  }
}
