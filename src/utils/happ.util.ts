import { TimeCtrllor } from '@/mobx';
import { Happ } from '@/types/Happ';
import dateUtils from './date.util';

export const getThisWeekHapp = (happList: Happ[]) => {
  const selectedDate = TimeCtrllor.selectedDate;
  const endDate = dateUtils.getLastDateOfWeek(selectedDate);
  const startDate = dateUtils.getFirstDateOfWeek(selectedDate);
  // startDate와 endDate 사이에 있는 Happ을 필터링
  return happList.filter((happ) => {
    const happedAt = new Date(happ.happedAt); // Date 객체로 변환
    return happedAt >= startDate && happedAt <= endDate;
  });
};

export const getLastSevenDaysHapp = (happList: Happ[]) => {
  const endDate = TimeCtrllor.selectedDate;
  // endDate로부터 7일 전의 startDate 계산
  const startDate = new Date(endDate);
  startDate.setDate(startDate.getDate() - 7); // 7일 전으로 설정
  // startDate와 endDate 사이에 있는 Happ을 필터링
  return happList.filter((happ) => {
    const happedAt = new Date(happ.happedAt); // Date 객체로 변환
    return happedAt >= startDate && happedAt <= endDate;
  });
};

export const getThisMonthHapp = (happList: Happ[]) => {
  const endDate = TimeCtrllor.selectedDate;
  // endDate로부터 30일 전의 startDate 계산
  const startDate = new Date(endDate);
  startDate.setDate(startDate.getDate() - 30); // 30일 전으로 설정
  // startDate와 endDate 사이에 있는 Happ을 필터링
  return happList.filter((happ) => {
    const happedAt = new Date(happ.happedAt); // Date 객체로 변환
    return happedAt >= startDate && happedAt <= endDate;
  });
};

export const getAvrHappedAt = (happList: Happ[]) => {
  // 총 시간의 합을 계산 (분 단위로 변환 후 합산)
  const totalMinutes = happList.reduce((total, happ) => {
    const happedAt = new Date(happ.happedAt);
    const hours = happedAt.getHours();
    const minutes = happedAt.getMinutes();
    
    return total + (hours * 60) + minutes;
  }, 0);

  // 평균 시간 (분 단위) 계산
  const averageMinutes = totalMinutes / happList.length;

  // 평균 시간을 다시 시간과 분으로 변환
  const avgHours = Math.floor(averageMinutes / 60); // 시간 단위
  const avgMinutes = Math.floor(averageMinutes % 60); // 분 단위

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
  return `${hours}시간 ${minutes}분`;
};

// hh:mm 형식의 시간을 분 단위로 변환하는 함수
const timeToMinutes = (time: string): number => {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
};