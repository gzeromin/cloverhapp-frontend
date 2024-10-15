'use client';
import { Language } from '@/mobx';
import { observer } from 'mobx-react-lite';
import { memo } from 'react';
import Link from 'next/link';
import cls from 'classnames';
import { useParams, usePathname } from 'next/navigation';

enum Menu {
  Profile = 'profile',
  Stamp = 'stamp',
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
        data-cy="profileLink"
      >
        {Language.$t.SideBar.Profile}
      </Link>
      <Link
        className={tabStyle(Menu.Stamp)}
        href={`/main/${userId}/stamp`}
        data-cy="stampLink"
      >
        {Language.$t.SideBar.Stamp}
      </Link>
      <Link
        className={tabStyle(Menu.Statistics)}
        href={`/main/${userId}/statistics`}
        data-cy="statisticsLink"
      >
        {Language.$t.SideBar.Statistics}
      </Link>
    </div>
  );
};

export default memo(observer(SideBarLinks));
