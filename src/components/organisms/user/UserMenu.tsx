import { memo, useEffect, useState } from 'react';
import { Language } from '@/mobx';
import { observer } from 'mobx-react-lite';
import { usePathname, useRouter } from 'next/navigation';
import cls from 'classnames';

export enum UserMenuEnum {
  ProfilePhoto = 'ProfilePhoto',
  Info = 'Info',
  KeyValue = 'KeyValue',
  ChangePassword = 'ChangePassword',
  Withdrawal = 'Withdrawal',
}

interface Props {
  menuName: string;
  index: number;
}

const UserMenu: React.FC<Props> = ({ menuName, index }) => {
  const [selectedMenu, setSelectedMenu] = useState<boolean>(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (pathname == getPathname(menuName)) {
      setSelectedMenu(true);
    } else {
      setSelectedMenu(false);
    }
  }, [pathname]);

  const goMenu = (menuName: string) => {
    router.push(getPathname(menuName));
  };

  const getPathname = (menuName: string) => {
    switch (menuName) {
    case UserMenuEnum.ProfilePhoto:
      return '/user/photo';
    case UserMenuEnum.Info:
      return '/user/info';
    case UserMenuEnum.ChangePassword:
      return '/user/password';
    case UserMenuEnum.KeyValue:
      return '/user/keyValue';
    case UserMenuEnum.Withdrawal:
      return '/user/withdrawal';
    default:
      return '/user/photo';
    }
  };

  return (
    <div
      key={`usermenu-${menuName}-${index}`}
      onClick={() => goMenu(menuName)}
      className={cls(
        'flex items-center justify-center w-[100px] h-[100px]',
        'rounded-full absolute cursor-pointer',
        'border border-gray-200',
        'hover:bg-primary-100 hover:text-gray-600',
        Language.logoFont,
        {
          'text-gray-100 bg-primary': selectedMenu,
        },
        {
          'bg-gray-50 hover:text-gray-600': !selectedMenu,
        },
      )}
      style={{
        transform: `rotate(${index * 30}deg) translatey(-300px)`,
      }}
    >
      <p
        className="text-2xl tracking-normal ml-1 text-center break-keep"
      >
        {Language.$t.UserMenu[menuName]}
      </p>
    </div>
  );
};

export default memo(observer(UserMenu));
