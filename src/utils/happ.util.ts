import { TimeCtrllor } from '@/mobx';
import { Happ, MoneyUnit, TodoStatus } from '@/types/Happ';
import dateUtils from './date.util';
import { CounterUnit } from '@/types/UserStamp';
import { StampType } from '@/types/Stamp';

export const getThisDateHapp = (happList: Happ[]) => {
  const selectedDate = new Date(TimeCtrllor.selectedDate);
  // startDate와 endDate 사이에 있는 Happ을 필터링
  return happList.filter((happ) => {
    const startTime = new Date(happ.startTime); // Date 객체로 변환
    return dateUtils.getFiveToFourHour(selectedDate, startTime) && happ.todo != TodoStatus.TODO;
  });
};

export const getThisWeekHapp = (happList: Happ[], selectedDate: Date) => {
  const endDate = dateUtils.getLastDateOfWeek(selectedDate);
  const startDate = dateUtils.getFirstDateOfWeek(selectedDate);
  // startDate와 endDate 사이에 있는 Happ을 필터링
  return happList.filter((happ) => {
    const startTime = new Date(happ.startTime); // Date 객체로 변환
    return startTime >= startDate && startTime <= endDate && happ.todo != TodoStatus.TODO;
  });
};

export const getLastWeekHapp = (happList: Happ[], selectedDate: Date) => {
  const lastWeekDate = new Date(selectedDate);
  lastWeekDate.setDate(lastWeekDate.getDate() - 7);
  return getThisWeekHapp(happList, lastWeekDate);
};

export const getThisMonthHapp = (happList: Happ[], selectedDate: Date) => {
  const endDate = new Date(selectedDate);
  const startDate = new Date(endDate);
  startDate.setDate(1);
  endDate.setMonth(endDate.getMonth() + 1);
  endDate.setDate(-1);
  // startDate와 endDate 사이에 있는 Happ을 필터링
  return happList.filter((happ) => {
    const startTime = new Date(happ.startTime); // Date 객체로 변환
    return startTime >= startDate && startTime <= endDate && happ.todo != TodoStatus.TODO;
  });
};

export const getLastMonthHapp = (happList: Happ[], selectedDate: Date) => {
  const lastMonthDate = new Date(selectedDate);
  lastMonthDate.setDate(lastMonthDate.getDate() - 30);
  return getThisMonthHapp(happList, lastMonthDate);
};

export const getAvrStartTime = (happList: Happ[]) => {
  // 총 시간의 합을 계산 (분 단위로 변환 후 합산)
  const totalMinutes = happList.reduce((total, happ) => {
    const startTime = new Date(happ.startTime);
    const hours = startTime.getHours();
    const minutes = startTime.getMinutes();
    
    return total + (hours * 60) + minutes;
  }, 0);

  // 평균 시간 (분 단위) 계산
  const averageMinutes = totalMinutes / happList.length || 0;

  // 평균 시간을 다시 시간과 분으로 변환
  const avgHours = Math.floor(averageMinutes / 60); // 시간 단위
  const avgMinutes = Math.floor(averageMinutes % 60); // 분 단위

  // 평균 시간을 "hh:mm" 형식으로 반환
  return `${String(avgHours).padStart(2, '0')}:${String(avgMinutes).padStart(2, '0')}`;
};

export const getAvrStartTimeForNight = (happList: Happ[]) => {
  // 총 시간의 합을 계산 (분 단위로 변환 후 합산)
  const totalMinutes = happList.reduce((total, happ) => {
    const startTime = new Date(happ.startTime);
    const hours = normalizeTime(startTime.getHours());
    const minutes = startTime.getMinutes();
    
    return total + (hours * 60) + minutes;
  }, 0);

  // 평균 시간 (분 단위) 계산
  const averageMinutes = totalMinutes / happList.length || 0;

  // 평균 시간을 다시 시간과 분으로 변환
  let avgHours = Math.floor(averageMinutes / 60); // 시간 단위
  const avgMinutes = Math.floor(averageMinutes % 60); // 분 단위

  // 24시가 넘을 경우 알맞은 표기로 변경 (예: 25:34 -> 01:34)
  avgHours = avgHours > 24 ? avgHours - 24 : avgHours;
  
  // 평균 시간을 "hh:mm" 형식으로 반환
  return `${String(avgHours).padStart(2, '0')}:${String(avgMinutes).padStart(2, '0')}`;
};

export const getSleepTime = (wakeUp: string, goToBed: string) => {
  // wakeUp과 goToBed를 각각 분 단위로 변환
  const wakeUpMinutes = timeToMinutes(wakeUp);
  const goToBedMinutes = timeToMinutes(goToBed);

  // 수면 시간이 자정을 넘겼는지 확인
  let sleepMinutes;
  if (wakeUpMinutes >= goToBedMinutes) {
    // 자정을 넘기지 않았다면
    sleepMinutes = wakeUpMinutes - goToBedMinutes;
  } else {
    // 자정을 넘긴 경우
    sleepMinutes = (24 * 60 - goToBedMinutes) + wakeUpMinutes;
  }

  // 분 단위 수면 시간을 시간과 분으로 변환
  const hours = Math.floor(sleepMinutes / 60);
  const minutes = sleepMinutes % 60;

  // 시간과 분을 'h시간 m분' 형태로 반환
  if (hours == 0) {
    if (minutes !== 0) {
      return `${minutes}분`;
    }
  } else {
    if (minutes == 0) {
      return `${hours}시간`;
    }
  }
  return `${hours}시간 ${minutes}분`;
};

// hh:mm 형식의 시간을 분 단위로 변환하는 함수
const timeToMinutes = (time: string): number => {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
};

// 자정을 기준으로 시간을 계산하는 함수
const normalizeTime = (hours: number): number => {
  return hours < 12 ? hours + 24 : hours;
};

export const getTotalDurationTime = (happList: Happ[]) => {
  const totalMinutes = happList.reduce((total, happ) => {
    const start = new Date(happ.startTime);
    const end = new Date(happ.endTime);
    return total + dateUtils.calculateDuration(start, end);
  }, 0);
  return dateUtils.getFormatHourMinByMinutes(totalMinutes);
}

export const getTotalMoneyDollar = (happList: Happ[]) => {
  const total = happList.reduce((total, happ) => {
    if (happ.moneyUnit === MoneyUnit.Dollar) {
      return total + Number(happ.money);
    }
    return total + 0;
  }, 0);
  return total / 1000;
}

export const getTotalMoneyYen = (happList: Happ[]) => {
  const total = happList.reduce((total, happ) => {
    if (happ.moneyUnit === MoneyUnit.Yen) {
      return total + Number(happ.money);
    }
    return total + 0;
  }, 0);
  return total / 1000;
}

export const getTotalMoneyWon = (happList: Happ[]) => {
  const total = happList.reduce((total, happ) => {
    if (happ.moneyUnit === MoneyUnit.Won) {
      return total + Number(happ.money);
    }
    return total + 0;
  }, 0);
  return total / 10000;
}

export const getBookCount = (happList: Happ[]) => {
  const uniqueBookIds = new Set<string>();

  happList.forEach(happ => {
    if (happ.Book && happ.Book.id) {
      uniqueBookIds.add(happ.Book.id);
    }
  });

  return uniqueBookIds.size;
}

export const getGoalCount = (goalUnit: CounterUnit, list: Happ[], type: StampType) => {
  switch (goalUnit) {
    case CounterUnit.Milliliter:
      return list.reduce((total, happ) => total + Number(happ.water), 0);
    case CounterUnit.Book:
      return getBookCount(list);
    case CounterUnit.Number:
      return list.length;
    case CounterUnit.Hour:
      if (type == StampType.GO_TO_BED) {
        return getAvrStartTimeForNight(list);
      }
      return getAvrStartTime(list);
    case CounterUnit.Time:
      return getTotalDurationTime(list);
    case CounterUnit.Dollar:
      return getTotalMoneyDollar(list);
    case CounterUnit.Won:
      return getTotalMoneyWon(list);
    case CounterUnit.Yen:
      return getTotalMoneyYen(list);
  }
  return ''
}

export const getGoalNumber = (unit: CounterUnit, goalNumber: string) => {
  if (unit == CounterUnit.Time) {
    return dateUtils.getFormatHourMinByMinutes(Number(goalNumber));
  }
  return goalNumber;
};

export const getBalance = (income: number | null, expense: number | null) => {
  if (income && expense) {
    const balance = income - expense;
    return Math.round(balance * 10) / 10;
  }
  return 0;
}