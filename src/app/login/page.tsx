'use client';
import cls from 'classnames';
import InputHapp from '@/components/atoms/InputHapp';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import api, { BUCKET_URL } from '@/utils/api.util';
import { AuthActionEnum, useAuthDispatch, useAuthState } from '@/context/auth';
import { Language, Loading } from '@/mobx';
import { observer } from 'mobx-react-lite';
import { handleError } from '@/utils/error.util';
import { FormEvent, memo, useEffect, useState } from 'react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ email?: string; password?: string }>(
    {},
  );

  const { user } = useAuthState();
  const dispatch = useAuthDispatch();

  const router = useRouter();
  useEffect(() => {
    if (user) {
      router.push('/');
    }
  }, [user, router]);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    Loading.setIsLoading(true);
    setErrors({}); // resetError
    try {
      const locale = Language.type;
      const res = await api.post('/auth/signin', { email, password, locale });
      const loginUser = res.data?.user;
      dispatch(AuthActionEnum.LOGIN, loginUser);
    } catch (error: any) {
      handleError(error, setErrors);
    } finally {
      Loading.setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <div
        className={cls('absolute right-14 top-24 tracking-widest text-xl',
          'leading-loose -z-50 text-primary-100 text-end',
          Language.logoFont
        )}
      >
        <div>{Language.$t.HappyStamp.Message1}</div>
        <div>{Language.$t.HappyStamp.Message2}</div>
        <div>{Language.$t.HappyStamp.Message3}</div>
        <div>{Language.$t.HappyStamp.Message4}</div>
        <div>{Language.$t.HappyStamp.Message5}</div>
        <div>{Language.$t.HappyStamp.Message6}</div>
      </div>
      <Image
        className="mb-3"
        src={`${BUCKET_URL}/public/icons/happystamp.png`}
        alt="Happtamp Logo"
        width={70}
        height={70}
        priority
      />
      <div className="w-10/12 mx-auto lg:w-96">
        <form onSubmit={onSubmit}>
          <InputHapp
            labelName={Language.$t.Input.Email}
            placeholder={Language.$t.Placeholder.Email}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={errors.email}
            testId='emailInput'
          />
          <InputHapp
            labelName={Language.$t.Input.Password}
            placeholder={Language.$t.Placeholder.Password}
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={errors.password}
            testId='passwordInput'
          />
          <button
            className="w-full py-3 mt-5 mb-2 text-s tracking-wider font-bold text-white uppercase
           bg-primary border hover:bg-primary-hover hover:text-primary rounded"
            test-id="loginButton"
          >
            {Language.$t.Button.Signin}
          </button>
          <small className="text-gray">
            {Language.$t.NotHaveId}
            <Link
              className="ml-1 font-bold hover:text-blue-500 uppercase"
              href="/register"
              test-id="signupLink"
            >
              {Language.$t.Button.Signup}
            </Link>
          </small>
        </form>
      </div>
    </div>
  );
};

export default memo(observer(Login));
