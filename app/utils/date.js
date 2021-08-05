export function renderDate(date) {
  let year = date.getUTCFullYear();
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
    monday.setUTCDate(monday.getUTCDate() - (weekDay - 1));
  } else {
    monday.setUTCDate(monday.getUTCDate() - 6);
  }
  return 'Semaine du ' + monday.getUTCDate() + '/' + month;
}

export function getWeek(date) {
  let week = [];
  week.push(date);
  let addInt;
  let subInt;
  let weekDay = date.getUTCDay();
  if (weekDay !== 0) {
    addInt = 7 - weekDay;
    subInt = weekDay - 1;
  } else {
    addInt = 0;
    subInt = 6;
  }
  for (let i = 1; i <= addInt; i++) {
    let tempDate = new Date();
    tempDate.setUTCDate(tempDate.getUTCDate() + i);
    week.push(tempDate);
  }
  for (let i = 1; i <= subInt; i++) {
    let tempDate = new Date();
    tempDate.setUTCDate(tempDate.getUTCDate() - i);
    week.push(tempDate);
  }
  week.sort((a, b) => {
    return a < b ? -1 : a > b ? 1 : 0;
  });
  return week;
}
