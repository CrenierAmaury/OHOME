export function renderDate(date) {
  let year = date.getFullYear();
  let month = date.getUTCMonth() + 1;
  let day = date.getUTCDate();
  let weekDay = date.getUTCDay();
  let week = [
    'dimanche',
    'lundi',
    'mardi',
    'mercredi',
    'jeudi',
    'vendredi',
    'samedi',
  ];
  let dayName = week[weekDay];
  return dayName + ' ' + day + '/' + month + '/' + year;
}

export function renderWeek(date) {
  let monday = new Date();
  let month = date.getUTCMonth() + 1;
  let weekDay = date.getUTCDay();
  if (weekDay !== 0) {
    monday.setDate(monday.getDate() - (weekDay - 1));
  } else {
    monday.setDate(monday.getDate() - 6);
  }
  return 'Semaine du ' + monday.getUTCDate() + '/' + month;
}
