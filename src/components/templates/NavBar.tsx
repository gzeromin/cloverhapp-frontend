'use client';
import Image from 'next/image';
import Link from 'next/link';
import SelectHapp from '@/components/atoms/SelectHapp';
import { Locale } from '@/types/User';
import { Language, Loading } from '@/mobx';
import { observer } from 'mobx-react-lite';
import { AuthActionEnum, useAuthDispatch, useAuthState } from '@/context/auth';
import api, { BUCKET_URL } from '@/utils/api.util';
import UserProrile from '@/components/molecules/UserProrile';
import cls from 'classnames';
import { handleError } from '@/utils/error.util';
import { BsCalendarHeart } from 'react-icons/bs';

const options = [
  { value: Locale.Kr, image: { src: Language.flagKr } },
  { value: Locale.En, image: { src: Language.flagEn } },
  { value: Locale.Jp, image: { src: Language.flagJp } },
];

const NavBar: React.FC = () => {
  const { authenticated, user } = useAuthState();
  const dispatch = useAuthDispatch();

  const handleLocale = async (locale: Locale) => {
    if (user) {
      dispatch(AuthActionEnum.SET_LOCALE, { locale });
    } else {
      Language.setLanguage(locale);
    }
  };

  const handleLogout = () => {
    Loading.setIsLoading(true);
    api
      .get('/auth/logout')
      .then(() => {
        dispatch(AuthActionEnum.LOGOUT);
      })
      .catch((error) => {
        handleError(error);
      })
      .finally(() => {
        Loading.setIsLoading(false);
        window.location.reload();
      });
  };

  return (
    <div className="absolute inset-x-0 top-0 z-10 flex items-center justify-between px-5 py-1 bg-primary h-13 shadow-md">
      <div className="flex items-center gap-4">
        <Link className="flex items-center" href="/">
          <Image
            src={`${BUCKET_URL}/public/icons/happystamp.png`}
            alt="Happtamp Logo Outline"
            width={45}
            height={45}
            priority
          />
          <p
            className={cls(
              'hidden sm:block ml-1',
              'text-2xl font-thin text-white tracking-normal',
              Language.logoFont
            )}
            data-cy='navBarLogo'
          >
            {Language.$t.Logo}
          </p>
        </Link>
        {user && (
          <Link href={'/main/' + user.id + '/profile'}>
            <BsCalendarHeart
              style={{ width: 30, height: 30, color: 'white' }}
            />
          </Link>
        )}
      </div>

      <div className="flex items-center gap-3">
        <SelectHapp
          options={options}
          selected={Language.type}
          onSelected={handleLocale}
          testId="localeSelect"
        />
        <div className="text-center">
          {authenticated ? (
            <button
              className="flex justify-center items-center w-25 px-2 py-1 text-sm border border-white text-white bg-gray-600 rounded h-7"
              onClick={handleLogout}
            >
              {user && (
                <UserProrile
                  user={user}
                  alt={`user logout button${user?.id}`}
                  size={25}
                  className="mr-1 rounded-full"
                />
              )}
              {Language.$t.Button.Logout}
            </button>
          ) : (
            <Link
              className="w-20 px-2 py-1 text-sm text-blue-500 border border-blue-500 rounded h-7"
              href="/login"
            >
              {Language.$t.Button.Signin}
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default observer(NavBar);
