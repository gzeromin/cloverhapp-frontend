import { action, computed, makeObservable, observable } from 'mobx';

import DateUtils from '@/utils/date.util';

class timeCtrllor {
  // type
  UNIT_YEAR = 1;
  UNIT_MONTH = 2;
  UNIT_WEEK = 3;
  UNIT_DAY = 4;

  // initial value
  selectedDate = new Date();
  unit = this.UNIT_WEEK;

  constructor() {
    makeObservable(this, {
      today: computed,
      isToday: action,
      isSelectedDate: action,
      isThisMonth: action,
      isSelectedMonth: action,
      selectDate: action,
      selectedDate: observable,
      selectedYear: computed,
      selectedMonth: computed,
      selectedFirstDate: computed,
      selectedLastDate: computed,
      setUnit: action,
      unit: observable,
      goPrev: action,
      goNext: action,
      prevDayLog: action,
      getWeeksCountByMonth: action,
      getWeeksCountByMonth2: action,
    });
  }

  get today() {
    return new Date();
  }

  isToday = (date: Date) => {
    return DateUtils.isTargetDate(date, this.today);
  };

  isSelectedDate = (date: Date) => {
    return DateUtils.isTargetDate(date, this.selectedDate);
  };

  isThisMonth = (month: number) => {
    if (
      this.today.getFullYear() === this.selectedYear &&
      this.today.getMonth() === month - 1
    )
      return true;

    return false;
  };

  isSelectedMonth = (date: Date) => {
    return DateUtils.isTargetMonth(date, this.selectedDate);
  };

  selectDate = (date: Date) => {
    this.selectedDate = date;
  };

  get selectedYear() {
    return DateUtils.getFullYear(this.selectedDate);
  }

  get selectedMonth() {
    return DateUtils.getMonth(this.selectedDate);
  }

  get formattedSelectedDate() {
    return DateUtils.getDate(this.selectedDate);
  }

  get selectedFirstDate() {
    return DateUtils.getFirstDateOfMonth(this.selectedDate);
  }

  get selectedLastDate() {
    return DateUtils.getLastDateOfMonth(this.selectedDate);
  }

  getWeeksCountByMonth(month: number) {
    return DateUtils.getWeeksCountByMonth(this.selectedYear, month);
  }

  getWeeksCountByMonth2(month: number) {
    return DateUtils.getWeeksCountByMonth2(this.selectedYear, month);
  }

  setUnit = (unit: number) => {
    this.unit = unit;
  };

  goPrev = () => {
    switch (this.unit) {
    case 1:
      this.selectedDate = new Date(
        this.selectedDate.setFullYear(this.selectedDate.getFullYear() - 1),
      );
      break;
    case 2:
      this.selectedDate = new Date(
        this.selectedDate.setMonth(this.selectedDate.getMonth() - 1),
      );
      break;
    case 3:
      this.selectedDate = new Date(
        this.selectedDate.setDate(this.selectedDate.getDate() - 7),
      );
      break;
    default:
      break;
    }
  };

  goNext = () => {
    switch (this.unit) {
    case 1:
      this.selectedDate = new Date(
        this.selectedDate.setFullYear(this.selectedDate.getFullYear() + 1),
      );
      break;
    case 2:
      this.selectedDate = new Date(
        this.selectedDate.setMonth(this.selectedDate.getMonth() + 1),
      );
      break;
    case 3:
      this.selectedDate = new Date(
        this.selectedDate.setDate(this.selectedDate.getDate() + 7),
      );
      break;
    default:
      break;
    }
  };

  prevDayLog = () => {
    this.selectedDate = new Date(
      this.selectedDate.setMonth(this.selectedDate.getMonth() - 4),
    );
  };
}

export default timeCtrllor;
