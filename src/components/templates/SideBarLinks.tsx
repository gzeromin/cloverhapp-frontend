'use client';
import { Language } from '@/mobx';
import { observer } from 'mobx-react-lite';
import { memo } from 'react';
import Link from 'next/link';
import cls from 'classnames';
import { useParams, usePathname } from 'next/navigation';

enum Menu {
  Profile = 'profile',
  Goal = 'goal',
  Friend = 'friend',
  Statistics = 'statistics',
}

const SideBarLinks: React.FC = () => {
  const { userId } = useParams();
  const pathname = usePathname();

  const tabStyle = (menu: string) => {
    if (pathname.includes(menu)) {
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
        className={tabStyle(Menu.Profile)}
        href={`/main/${userId}/profile`}
        id="profileLink"
      >
        {Language.$t.SideBar.Profile}
      </Link>
      <Link
        className={tabStyle(Menu.Goal)}
        href={`/main/${userId}/goal`}
        id="goalLink"
      >
        {Language.$t.SideBar.Goal}
      </Link>
      <Link
        className={tabStyle(Menu.Friend)}
        href={`/main/${userId}/friend`}
        id="friendLink"
      >
        {Language.$t.SideBar.Friend}
      </Link>
      <Link
        className={tabStyle(Menu.Statistics)}
        href={`/main/${userId}/statistics`}
        id="statisticsLink"
      >
        {Language.$t.SideBar.Statistics}
      </Link>
    </div>
  );
};

export default memo(observer(SideBarLinks));
