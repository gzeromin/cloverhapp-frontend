import { TimeCtrllor } from '@/mobx';
import { RefObject } from 'react';
import { XYCoord } from 'react-dnd';

export const getModifiedDate = (clientOffset: XYCoord | null, startTime: Date) => {
  if (clientOffset) {
    const dropElement = document.elementFromPoint(clientOffset.x, clientOffset.y);
    const parent = dropElement?.parentElement;
    const grandparent = parent?.parentElement?.parentElement?.parentElement;
    // date-value 속성 읽기(날짜)
    const dateElement = grandparent?.querySelector('[date-value]');
    let modifiedDate = Number(dateElement?.getAttribute('date-value'));

    // hour-value 속성 읽기(시간)
    const hourElement = parent?.querySelector('[hour-value]');
    const modifiedHour = Number(hourElement?.getAttribute('hour-value'));

    // 분 계산 하기
    // 드롭된 요소의 위치 및 크기 정보 가져오기
    const boundingRect = dropElement?.getBoundingClientRect();
    // 요소의 왼쪽 경계선과 드롭된 지점의 x 좌표의 차이 구하기
    const offsetX = clientOffset.x - (boundingRect?.left || 0);
    // 드롭된 요소의 너비
    const elementWidth = boundingRect?.width || 1;
    // 퍼센트 계산
    const modifiedMinute = Math.round((offsetX / elementWidth) * 60);

    if (modifiedDate && modifiedHour && modifiedMinute) {
      const newDate = new Date(startTime);
      let modifiedMonth = newDate.getMonth();
      const currentDate = newDate.getDate();
      const diffDate = currentDate - modifiedDate;
      if (diffDate < -7) {
        modifiedMonth -= 1;
      } else if (diffDate > 7) {
        modifiedMonth += 1;
      }
      if(modifiedHour < 5) {
        modifiedDate += 1;
      }
      newDate.setMonth(modifiedMonth);
      newDate.setDate(modifiedDate);
      newDate.setHours(modifiedHour);
      newDate.setMinutes(modifiedMinute);
      return newDate;
    }
    return null;
  }
  return null;
};

export const getCreatedDate = (clientOffset: XYCoord | null) => {
  if (clientOffset) {
    const dropElement = document.elementFromPoint(clientOffset.x, clientOffset.y);
    const parent = dropElement?.parentElement;
    const grandparent = parent?.parentElement?.parentElement?.parentElement;

    // date-value 속성 읽기(날짜)
    const dateElement = grandparent?.querySelector('[date-value]');
    let createdDate = Number(dateElement?.getAttribute('date-value'));

    // hour-value 속성 읽기(시간)
    const hourElement = parent?.querySelector('[hour-value]');
    const createdHour = Number(hourElement?.getAttribute('hour-value'));

    // 분 계산 하기
    // 드롭된 요소의 위치 및 크기 정보 가져오기
    const boundingRect = dropElement?.getBoundingClientRect();
    // 요소의 왼쪽 경계선과 드롭된 지점의 x 좌표의 차이 구하기
    const offsetX = clientOffset.x - (boundingRect?.left || 0);
    // 드롭된 요소의 너비
    const elementWidth = boundingRect?.width || 1;
    // 퍼센트 계산
    const createdMinute = Math.round((offsetX / elementWidth) * 60);

    if (createdDate && createdHour && createdMinute) {
      // 사용자가 현재 보고있는 캘린더 날짜
      const selectedDate = TimeCtrllor.selectedDate;
      
      const newDate = new Date(selectedDate);
      let createdMonth = newDate.getMonth();
      const currentDate = selectedDate.getDate();
      const diffDate = currentDate - createdDate;
      if (diffDate < -7) {
        createdMonth -= 1;
      } else if (diffDate > 7) {
        createdMonth += 1;
      }
      if(createdHour < 5) {
        createdDate += 1;
      }
      newDate.setMonth(createdMonth);
      newDate.setDate(createdDate);
      newDate.setHours(createdHour);
      newDate.setMinutes(createdMinute);
      return newDate;
    }
    return null;
  }
  return null;
};

export const getModifiedXY = (
  clientOffset: XYCoord | null, 
  weekRef: RefObject<HTMLDivElement> | null
) => {
  if (clientOffset && weekRef && weekRef.current) {
    // 기준 div에 대한 정보를 가져옵니다.
    const weekRect = weekRef.current.getBoundingClientRect();
    const { x: clientX, y: clientY } = clientOffset;
    const { left, top, width, height } = weekRect;

    // 상대적인 X, Y 좌표를 구함
    const relativeX = clientX - left - 30;
    const relativeY = clientY - top - 15;

    // 백분율로 변환
    const positionX = (relativeX / width) * 100;
    const positionY = (relativeY / height) * 100;

    return { x: positionX, y: positionY };
  }
  return null;
};