const months = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

export const weeksEn = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export const weeksJp = ['日', '月', '火', '水', '木', '金', '土'];

export const weeksJp2 = ['月', '火', '水', '木', '金', '土', '日'];

const getFullYear = (date: Date) => {
  return date.getFullYear();
};

const getMonth = (date: Date) => {
  return date.getMonth();
};

const getHour = (date: string) => {
  return new Date(date).getHours();
};

const getFirstDateOfMonth = (date: Date) => {
  return new Date(getFullYear(date), getMonth(date), 1);
};

const getLastDateOfMonth = (date: Date) => {
  return new Date(getFullYear(date), getMonth(date) + 1, 0);
};

const getWeeksCount = (date: Date) => {
  return Math.ceil(
    (getFirstDateOfMonth(date).getDay() + getLastDateOfMonth(date).getDate()) /
      7,
  );
};

const getWeeksCountByMonth = (year: number, month: number) => {
  const date = new Date(year, month, 1);
  return Math.ceil(
    (getFirstDateOfMonth(date).getDay() + getLastDateOfMonth(date).getDate()) /
      7,
  );
};

const getWeeksCountByMonth2 = (year: number, month: number) => {
  const date = new Date(year, month, 1);
  return Math.ceil(
    (getFirstDateOfMonth(date).getDay() +
      getLastDateOfMonth(date).getDate() +
      7) /
      7,
  );
};

const getFiveToFourHour = (date: Date, targetDate: Date) => {
  const targetDateYear = targetDate.getFullYear();
  const thatDateYear = date.getFullYear();
  const targetDateMonth = targetDate.getMonth();
  const thatDateMonth = date.getMonth();
  const targetDateDate = targetDate.getDate();
  const thatDate = date.getDate();
  const nextDate = thatDate + 1;
  const targetDateHour = targetDate.getHours();
  if (
    targetDateYear === thatDateYear &&
    targetDateMonth === thatDateMonth &&
    targetDateDate == thatDate &&
    targetDateHour > 4
  ) {
    return true;
  } else if (
    targetDateYear === thatDateYear &&
    targetDateMonth === thatDateMonth &&
    targetDateDate == nextDate &&
    targetDateHour < 5
  ) {
    return true;
  }
  return false;
};

const getFormatDate = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const getFormatDateHour = (date: Date) => {
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hour = String(date.getHours()).padStart(2, '0');
  const minute = String(date.getMinutes()).padStart(2, '0');
  return `${month}/${day} ${hour}:${minute}`;
};

const getFormatHour = (date: Date) => {
  const hour = String(date.getHours()).padStart(2, '0');
  const minute = String(date.getMinutes()).padStart(2, '0');
  return `${hour}:${minute}`;
};

export default {
  weeksEn,
  weeksJp,
  weeksJp2,
  isTargetDate: (date: Date, targetDate: Date) => {
    if (
      date.getFullYear() === targetDate.getFullYear() &&
      date.getMonth() === targetDate.getMonth() &&
      date.getDate() === targetDate.getDate()
    )
      return true;

    return false;
  },
  isTargetMonth: (date: Date, targetDate: Date) => {
    if (
      date.getFullYear() === targetDate.getFullYear() &&
      date.getMonth() === targetDate.getMonth()
    )
      return true;

    return false;
  },
  getMonthStr: (month: number) => {
    return months[month];
  },
  getFullYear,
  getMonth,
  getHour,
  getFirstDateOfMonth,
  getLastDateOfMonth,
  getWeeksCount,
  getWeeksCountByMonth,
  getWeeksCountByMonth2,
  getFiveToFourHour,
  getFormatDate,
  getFormatDateHour,
  getFormatHour,
  isSaturday: (date: Date) => {
    return date.getDay() === 6;
  },
  isSunday: (date: Date) => {
    return date.getDay() === 0;
  },
};
