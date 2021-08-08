import _ from 'lodash';

export function renderMemberName(members, memberId) {
  return _.find(members, e => {
    return e.id === memberId;
  }).name;
}
