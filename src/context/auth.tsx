'use client';
import { User } from '@/types/User';
import api from '@/utils/api.util';
import { createContext, useContext, useEffect, useReducer } from 'react';
import { Language } from '@/mobx';
import { UserStamp } from '@/types/UserStamp';
import { handleError } from '@/utils/error.util';

interface State {
  authenticated: boolean;
  user: User | undefined;
  userStamps: UserStamp[];
}

const StateContext = createContext<State>({
  authenticated: false,
  user: undefined,
  userStamps: [] as UserStamp[],
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
  SET_KEY_VALUE = 'SET_KEY_VALUE',
  SET_SENTENCE = 'SET_SENTENCE',
  SET_DROPLET = 'SET_DROPLET',
  
  SET_USER_STAMPS = 'SET_USER_STAMPS'
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
  case AuthActionEnum.SET_KEY_VALUE:
    return {
      ...state,
      user: { ...state.user, keyValues: payload },
    };
  case AuthActionEnum.SET_SENTENCE:
    return {
      ...state,
      user: { ...state.user, sentence: payload },
    };
  case AuthActionEnum.SET_DROPLET:
    return {
      ...state,
      user: { ...state.user, droplet: payload },
    };

  // * User Stamp Section *
  case AuthActionEnum.SET_USER_STAMPS:
    return {
      ...state,
      userStamps: payload,
    };
  default:
    throw new Error(`Unknown action type: ${type}`);
  }
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, defaultDispatch] = useReducer(reducer, {
    user: null,
    authenticated: false,
    userStamps: [],
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
        dispatch(AuthActionEnum.LOGIN, res.data?.user);
        const userStamps = await api.get('/user-stamp');
        dispatch(AuthActionEnum.SET_USER_STAMPS, userStamps.data);
      } catch (error) {
        // handleError(error);
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
