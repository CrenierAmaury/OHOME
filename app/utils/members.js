import _ from 'lodash';

export function renderMemberName(members, memberId) {
  const member = _.find(members, e => {
    return e.id === memberId;
  });
  if (member) {
    return member.name;
  } else {
    return '**utilisateur supprimé**';
  }
}
