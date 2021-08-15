import _ from 'lodash';

export function renderHouseholdName(households, householdId) {
  return _.find(households, e => {
    return e.id === householdId;
  }).name;
}
