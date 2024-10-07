import { Language } from '@/mobx';

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

const getDate = (date: Date) => {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const dateNumber =  date.getDate();
  return `${year}-${month}-${dateNumber}`;
};

const getHour = (date: string) => {
  return new Date(date).getHours();
};

const getFirstDateOfMonth = (date: Date) => {
  return new Date(getFullYear(date), getMonth(date), 1);
};

const getFirstDateOfWeek = (date: Date) => {
  const thisDate = date.getDate();
  const thisDay = date.getDay();

  // 선택된 날짜의 같은주 월요일 날짜
  const firstDate = thisDate - 
    (thisDay - 1 < 0 ? 6 : thisDay - 1);
  
  // 리턴할 새로운 데이트 객체 생성
  const newDate = new Date(date);
  let newMonth = newDate.getMonth();
  // 월요일이 지난달인 경우
  if (thisDate - firstDate < 0) {
    newMonth -= 1;
  }
  newDate.setMonth(newMonth);
  newDate.setDate(firstDate);
  // 월요일 5시 0분 세팅
  newDate.setHours(5, 0, 0, 0); // 5시 0분, 초는 0, 밀리초는 0
  return newDate;
};

const getLastDateOfMonth = (date: Date) => {
  return new Date(getFullYear(date), getMonth(date) + 1, 0);
};

const getLastDateOfWeek = (date: Date) => {
  const thisDate = date.getDate();
  const thisDay = date.getDay();

  // 선택된 날짜의 다음주 월요일 날짜 계산
  const lastDate = thisDate + (8 - thisDay);

  // 새로운 Date 객체를 생성하여 일요일 날짜로 설정
  const newDate = new Date(date);
  let newMonth = newDate.getMonth();

  // 일요일이 다음 달로 넘어가는 경우 처리
  if (lastDate > new Date(newDate.getFullYear(), newMonth + 1, 0).getDate()) {
    newMonth += 1;
  }
  
  newDate.setMonth(newMonth);
  newDate.setDate(lastDate);
  // 다음주 월요일 4시 59분 세팅
  newDate.setHours(4, 59, 0, 0); // 4시 59분, 초는 0, 밀리초는 0
  return newDate;
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
    targetDateDate === thatDate &&
    targetDateHour >= 5
  ) {
    return true;
  } else if (
    targetDateYear === thatDateYear &&
    targetDateMonth === thatDateMonth &&
    targetDateDate === nextDate &&
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

const getFormatDateHourMin = (date: Date) => {
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hour = String(date.getHours()).padStart(2, '0');
  const minute = String(date.getMinutes()).padStart(2, '0');
  return `${month}/${day} ${hour}:${minute}`;
};

const getFormatHourMin = (date: Date) => {
  const hour = String(date.getHours()).padStart(2, '0');
  const minute = String(date.getMinutes()).padStart(2, '0');
  return `${hour}:${minute}`;
};

const getFormatHour = (date: Date) => {
  const hour = String(date.getHours()).padStart(2, '0');
  return `${hour}`;
};

const getFormatMin = (date: Date) => {
  const minute = String(date.getMinutes()).padStart(2, '0');
  return `${minute}`;
};

const getFormatHourMinByMinutes = (minutes: number) => {
  try {
    const hour = Math.floor(minutes / 60);
    const minute = minutes % 60;
    if (hour == 0) {
      if (minute == 0) {
        return Language.$t.Time.Minute0;
      } else {
        return minute + Language.$t.Time.M;
      }
    } else if (minute == 0) {
      return hour + Language.$t.Time.H;
    }
    return hour + Language.$t.Time.H
      + ' ' + minute + Language.$t.Time.M;
  } catch (error) {
    return Language.$t.Time.Minute0;
  }
};

const dateUtils = {
  weeksEn,
  weeksJp,
  weeksJp2,
  isTargetDate: (date: Date, targetDate: Date) => {
    return (
      date.getFullYear() === targetDate.getFullYear() &&
      date.getMonth() === targetDate.getMonth() &&
      date.getDate() === targetDate.getDate()
    );
  },
  isTargetMonth: (date: Date, targetDate: Date) => {
    return (
      date.getFullYear() === targetDate.getFullYear() &&
      date.getMonth() === targetDate.getMonth()
    );
  },
  getMonthStr: (month: number) => {
    return months[month];
  },
  getFullYear,
  getMonth,
  getDate,
  getHour,
  getFirstDateOfMonth,
  getFirstDateOfWeek,
  getLastDateOfMonth,
  getLastDateOfWeek,
  getWeeksCount,
  getWeeksCountByMonth,
  getWeeksCountByMonth2,
  getFiveToFourHour,
  getFormatDate,
  getFormatDateHourMin,
  getFormatHourMin,
  getFormatHour,
  getFormatMin,
  getFormatHourMinByMinutes,
  isSaturday: (date: Date) => {
    return date.getDay() === 6;
  },
  isSunday: (date: Date) => {
    return date.getDay() === 0;
  },
};

export default dateUtils;