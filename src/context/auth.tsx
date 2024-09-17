'use client';
import { User } from '@/types/User';
import api from '@/utils/api.util';
import { createContext, useContext, useEffect, useReducer } from 'react';
import { Language } from '@/mobx';
import { Stamp } from '@/types/Stamp';

interface State {
  authenticated: boolean;
  user: User | undefined;
  stampList: Stamp[];
}

const StateContext = createContext<State>({
  authenticated: false,
  user: undefined,
  stampList: [] as Stamp[],
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
  SET_STAMPLIST = 'SET_STAMPLIST',
  SET_STAMP = 'SET_STAMP',
  UPDATE_STAMP = 'UPDATE_STAMP',
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
  case AuthActionEnum.SET_STAMPLIST:
    return {
      ...state,
      stampList: payload,
    };
  case AuthActionEnum.SET_STAMP:
    return {
      ...state,
      stampList: state.stampList ? state.stampList.concat(payload) : [],
    };
  case AuthActionEnum.UPDATE_STAMP:
    return {
      ...state,
      stampList: state.stampList
        ? state.stampList.map((v) => {
          if (v.id == payload.id) {
            v.stampedAt = payload.stampedAt;
            v.memo = payload.memo;
            v.status = payload.status;
            v.imageUrls = payload.imageUrls;
            v.Friends = payload.Friends;
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
    stampList: [],
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
