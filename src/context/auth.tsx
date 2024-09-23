'use client';
import { User } from '@/types/User';
import api from '@/utils/api.util';
import { createContext, useContext, useEffect, useReducer } from 'react';
import { Language } from '@/mobx';
import { Happ } from '@/types/Happ';

interface State {
  authenticated: boolean;
  user: User | undefined;
  happList: Happ[];
}

const StateContext = createContext<State>({
  authenticated: false,
  user: undefined,
  happList: [] as Happ[],
});

const DispatchContext = createContext<any>(null);

interface Action {
  type: AuthActionEnum;
  payload: any;
}

export enum AuthActionEnum {
  LOGIN = 'LOGIN',
  LOGOUT = 'LOGOUT',
  SET_PROFILE_PHOTO = 'SET_PROFILE_PHOTO',
  SET_LOCALE = 'SET_LOCALE',
  SET_NICKNAME = 'SET_NICKNAME',
  SET_DROPLET = 'SET_DROPLET',
  SET_HAPPLIST = 'SET_HAPPLIST',
  SET_HAPP = 'SET_HAPP',
  UPDATE_HAPP = 'UPDATE_HAPP',
}

const reducer = (state: State, { type, payload }: Action) => {
  switch (type) {
  case AuthActionEnum.LOGIN:
    return {
      ...state,
      authenticated: true,
      user: payload,
    };
  case AuthActionEnum.LOGOUT:
    return {
      ...state,
      authenticated: false,
      user: null,
    };
  case AuthActionEnum.SET_PROFILE_PHOTO:
    return {
      ...state,
      user: { ...state.user, photoUrl: payload },
    };
  case AuthActionEnum.SET_LOCALE:
    return {
      ...state,
      user: { ...state.user, locale: payload.locale },
    };
  case AuthActionEnum.SET_NICKNAME:
    return {
      ...state,
      user: { ...state.user, nickname: payload },
    };
  case AuthActionEnum.SET_DROPLET:
    return {
      ...state,
      user: { ...state.user, droplet: payload },
    };
  case AuthActionEnum.SET_HAPPLIST:
    return {
      ...state,
      happList: payload,
    };
  case AuthActionEnum.SET_HAPP:
    return {
      ...state,
      happList: state.happList ? state.happList.concat(payload) : [],
    };
  case AuthActionEnum.UPDATE_HAPP:
    return {
      ...state,
      happList: state.happList
        ? state.happList.map((v) => {
          if (v.id == payload.id) {
            v.startTime = payload.startTime;
            v.endTime = payload.endTime;
            v.positionX = payload.positionX;
            v.positionY = payload.positionY;
            v.memo = payload.memo;
            v.money = payload.money;
            v.moneyUnit = payload.moneyUnit;
            v.water = payload.water;
            v.imageUrls = payload.imageUrls;
            v.Tags = payload.Tags;
          }
          return v;
        })
        : [],
    };
  default:
    throw new Error(`Unknown action type: ${type}`);
  }
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, defaultDispatch] = useReducer(reducer, {
    user: null,
    authenticated: false,
    happList: [],
  });

  const dispatch = (type: AuthActionEnum, payload?: any) => {
    // set Locale
    if (type === AuthActionEnum.LOGIN || type === AuthActionEnum.SET_LOCALE) {
      Language.setLanguage(payload.locale);
    }
    defaultDispatch({ type, payload });
  };

  useEffect(() => {
    async function loadUser() {
      try {
        const res = await api.get('/auth/me');
        dispatch(AuthActionEnum.LOGIN, res.data);
      } catch (error) {
        console.log(error);
      } finally {
      }
    }
    loadUser();
  }, []);

  return (
    <DispatchContext.Provider value={dispatch}>
      <StateContext.Provider value={state}>{children}</StateContext.Provider>
    </DispatchContext.Provider>
  );
};

export const useAuthState = () => useContext(StateContext);
export const useAuthDispatch = () => useContext(DispatchContext);
