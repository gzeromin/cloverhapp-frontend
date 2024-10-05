'use client';
import { Language } from '@/mobx';
import { observer } from 'mobx-react-lite';
import { memo, useEffect, useState } from 'react';
import Link from 'next/link';
import cls from 'classnames';
import { usePathname } from 'next/navigation';

enum Menu {
  Memo = '/main/memo',
  Home = '/main',
  Stamp = '/main/stamp',
  Friend = '/main/friend',
  Profile = '/main/profile',
}

const SideBarLinks: React.FC = () => {
  const pathname = usePathname();
  const [selectedMenu, setSelectedMenu] = useState<string>(Menu.Memo);
  useEffect(() => {
    setSelectedMenu(pathname);
  }, [pathname]);

  const tabStyle = (menu: string) => {
    if (selectedMenu === menu) {
      return '-rotate-45 inline-block rounded-t-lg bg-gray-100 text-primary';
    }
    return '-rotate-45 inline-block rounded-t-lg hover:bg-gray-100 bg-gray-50 hover:text-gray-600 text-xs';
  };

  return (
    <div 
      className={cls(
        'h-[40px] flex items-end justify-around',
        'text-sm font-medium text-gray-500'
      )}
    >
      <Link
        className={tabStyle(Menu.Memo)}
        onClick={() => setSelectedMenu(Menu.Memo)}
        href="/main/memo"
        test-id="memoLink"
      >
        {Language.$t.SideBar.Memo}
      </Link>
      <Link
        className={tabStyle(Menu.Home)}
        onClick={() => setSelectedMenu(Menu.Home)}
        href="/main"
        test-id="homeLink"
      >
        {Language.$t.SideBar.Home}
      </Link>
      <Link
        className={tabStyle(Menu.Stamp)}
        onClick={() => setSelectedMenu(Menu.Stamp)}
        href="/main/stamp"
        test-id="stampLink"
      >
        {Language.$t.SideBar.Stamp}
      </Link>
      <Link
        className={tabStyle(Menu.Friend)}
        onClick={() => setSelectedMenu(Menu.Friend)}
        href="/main/friend"
        test-id="friendLink"
      >
        {Language.$t.SideBar.Friend}
      </Link>
      <Link
        className={tabStyle(Menu.Profile)}
        onClick={() => setSelectedMenu(Menu.Profile)}
        href="/main/profile"
        test-id="profileLink"
      >
        {Language.$t.SideBar.Profile}
      </Link>
    </div>
  );
};

export default memo(observer(SideBarLinks));
