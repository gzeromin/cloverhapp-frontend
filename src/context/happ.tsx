'use client';
import api from '@/utils/api.util';
import { createContext, useContext, useEffect, useReducer } from 'react';
import { Happ } from '@/types/Happ';
import { handleError } from '@/utils/error.util';

interface State {
  happList: Happ[];
}

const StateContext = createContext<State>({
  happList: [] as Happ[],
});

const DispatchContext = createContext<any>(null);

interface Action {
  type: HappActionEnum;
  payload: any;
}

export enum HappActionEnum {
  SET_HAPPLIST = 'SET_HAPPLIST',
  SET_HAPP = 'SET_HAPP',
  UPDATE_HAPP = 'UPDATE_HAPP',
  DELETE_HAPP = 'DELETE_HAPP',
  UPDATE_HAPPLIST = 'UPDATE_HAPPLIST',
}

const reducer = (state: State, { type, payload }: Action) => {
  switch (type) {
  case HappActionEnum.SET_HAPPLIST:
    return {
      ...state,
      happList: payload || [],
    };
  case HappActionEnum.SET_HAPP:
    return {
      ...state,
      happList: state.happList ? state.happList.concat(payload) : [],
    };
  case HappActionEnum.UPDATE_HAPP:
    const {updated, created} = payload;
    return {
      ...state,
      happList: state.happList
        ? state.happList.map((v) => {
          if (v.id == updated.id) {
            v.startTime = updated.startTime;
            v.endTime = updated.endTime;
            v.positionX = updated.positionX;
            v.positionY = updated.positionY;
            v.memo = updated.memo;
            v.todo = updated.todo;
          }
          return v;
        }).concat(created)
        : [],
    };
  case HappActionEnum.DELETE_HAPP:
    return {
      ...state,
      happList: state.happList ? state.happList.filter((e) => e.id != payload) : [],
    };
  case HappActionEnum.UPDATE_HAPPLIST:
    return {
      ...state,
      happList: state.happList ? state.happList.concat(...payload) : payload,
    };
  default:
    throw new Error(`Unknown action type: ${type}`);
  }
};

export const HappProvider = ({ 
  children, userId, selectedDate,
}: { children: React.ReactNode, userId: string | string[], selectedDate: string }) => {
  const [state, defaultDispatch] = useReducer(reducer, {
    happList: [],
  });

  const dispatch = (type: HappActionEnum, payload?: any) => {
    defaultDispatch({ type, payload });
  };

  useEffect(() => {
    async function loadHappList() {
      try {
        const happ = await api.get(`/happ/list/${selectedDate}/${userId}`);
        dispatch(HappActionEnum.SET_HAPPLIST, happ.data);
      } catch (error) {
        handleError(error);
      }
    }
    loadHappList();
  }, [selectedDate, userId]);

  return (
    <DispatchContext.Provider value={dispatch}>
      <StateContext.Provider value={state}>{children}</StateContext.Provider>
    </DispatchContext.Provider>
  );
};

export const useHappState = () => useContext(StateContext);
export const useHappDispatch = () => useContext(DispatchContext);
