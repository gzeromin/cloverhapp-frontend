'use client';
import InputHapp from '@/components/atoms/InputHapp';
import api from '@/utils/api.util';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AuthActionEnum, useAuthDispatch, useAuthState } from '@/context/auth';
import { Language, Loading } from '@/mobx';
import { observer } from 'mobx-react-lite';
import { handleError } from '@/utils/error.util';
import { FormEvent, useEffect, useState } from 'react';

const Register = () => {
  const [email, setEmail] = useState('');
  const [nickname, setNickname] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [errors, setErrors] = useState<{
    email?: string;
    nickname?: string;
    password?: string;
    passwordConfirm?: string;
  }>({});

  const { user } = useAuthState();
  const dispatch = useAuthDispatch();

  const router = useRouter();
  useEffect(() => {
    if (user) {
      router.push('/modalPage/keyValue');
    }
  }, [user, router]);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    Loading.setIsLoading(true);
    setErrors({}); // resetError
    try {
      const locale = Language.type;
      const res = await api.post('/auth/signup', {
        email,
        nickname,
        password,
        passwordConfirm,
        locale,
      });
      const user = res.data?.user;
      dispatch(AuthActionEnum.LOGIN, user);
      router.push('/');
    } catch (error: any) {
      handleError(error, setErrors);
    } finally {
      Loading.setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <p 
        className={`text-4xl mb-3 ${Language.logoFont}`}
        data-cy="registLogo"
      >
        {Language.$t.Logo}
      </p>
      <div className="mx-auto w-96">
        <form onSubmit={onSubmit}>
          <InputHapp
            labelName={Language.$t.Input.Email}
            placeholder={Language.$t.Placeholder.Email}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={errors.email}
            dataCy="emailInput"
          />
          <InputHapp
            labelName={Language.$t.Input.Nickname}
            placeholder={Language.$t.Placeholder.Nickname}
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            error={errors.nickname}
            dataCy="nicknameInput"
          />
          <InputHapp
            labelName={Language.$t.Input.Password}
            placeholder={Language.$t.Placeholder.Password}
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={errors.password}
            dataCy="passwordInput"
          />
          <InputHapp
            labelName={Language.$t.Input.PasswordConfirm}
            placeholder={Language.$t.Placeholder.PasswordConfirm}
            type="password"
            value={passwordConfirm}
            onChange={(e) => setPasswordConfirm(e.target.value)}
            error={errors.passwordConfirm}
            dataCy="passwordConfirmInput"
          />
          <button
            className="w-full py-3 mt-5 mb-2 text-s tracking-wider font-bold text-white uppercase
           bg-primary border hover:bg-primary-hover hover:text-primary rounded"
            data-cy="signupButton"
          >
            {Language.$t.Button.Signup}
          </button>
          <small className="text-gray">
            {Language.$t.HaveId}
            <Link
              className="ml-1 font-bold hover:text-blue-500 uppercase"
              href="/login"
              data-cy="loginLink"
            >
              {Language.$t.Button.Signin}
            </Link>
          </small>
        </form>
      </div>
    </div>
  );
};

export default observer(Register);
