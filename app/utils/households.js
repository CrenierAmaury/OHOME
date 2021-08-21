import _ from 'lodash';

export function renderHouseholdName(households, householdId) {
  return (
    households.length > 0 &&
    _.find(households, e => {
      return e.id === householdId;
    }).name
  );
}
