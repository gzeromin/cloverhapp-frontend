'use client';
import { memo } from 'react';
import { observer } from 'mobx-react-lite';
import { usePathname } from 'next/navigation';
import cls from 'classnames';
import Link from 'next/link';
import { Language } from '@/mobx';

interface Props {}

enum Pathname {
  search = '/friend/search',
  list = '/friend',
  requested = '/friend/requested',
  requesting = '/friend/requesting',
}

const Friend: React.FC<Props> = () => {
  const pathname = usePathname();

  return (
    <div className="flex flex-col mt-16">
      <Link
        className={cls(
          'p-2 m-2 rounded-md shadow-md transform -rotate-6 flex justify-between items-center group hover:bg-gray-200',
          { 'bg-primary-100': pathname === Pathname.search },
        )}
        href={Pathname.search}
      >
        <div
          key={'spring note left search'}
          className={cls(
            'z-30 w-4 h-4 bg-gray-200 rounded-full shadow-lg group-hover:bg-white',
            { 'bg-white': pathname === Pathname.search },
          )}
        />
        {Language.$t.Friend.search}
        <div
          key={'spring note right search'}
          className={cls(
            'z-30 w-4 h-4 bg-gray-200 rounded-full shadow-lg group-hover:bg-white',
            { 'bg-white': pathname === Pathname.search },
          )}
        />
      </Link>
      <Link
        className={cls(
          'p-2 m-2 mt-2 rounded-md shadow-md transform rotate-5 flex justify-between items-center group hover:bg-gray-200',
          { 'bg-primary-100': pathname === Pathname.list },
        )}
        href={Pathname.list}
      >
        <div
          key={'spring note left list'}
          className={cls(
            'z-30 w-4 h-4 bg-gray-200 rounded-full shadow-lg group-hover:bg-white',
            { 'bg-white': pathname === Pathname.list },
          )}
        />
        {Language.$t.Friend.list}
        <div
          key={'spring note right list'}
          className={cls(
            'z-30 w-4 h-4 bg-gray-200 rounded-full shadow-lg group-hover:bg-white',
            { 'bg-white': pathname === Pathname.list },
          )}
        />
      </Link>
      <Link
        className={cls(
          'p-2 m-2 rounded-md shadow-md transform -rotate-3 flex justify-between items-center group hover:bg-gray-200',
          { 'bg-primary-100': pathname === Pathname.requested },
        )}
        href={Pathname.requested}
      >
        <div
          key={'spring note left requested'}
          className={cls(
            'z-30 w-4 h-4 bg-gray-200 rounded-full shadow-lg group-hover:bg-white',
            { 'bg-white': pathname === Pathname.requested },
          )}
        />
        {Language.$t.Friend.requested}
        <div
          key={'spring note right requested'}
          className={cls(
            'z-30 w-4 h-4 bg-gray-200 rounded-full shadow-lg group-hover:bg-white',
            { 'bg-white': pathname === Pathname.requested },
          )}
        />
      </Link>
      <Link
        className={cls(
          'p-2 m-2 rounded-md shadow-md transform rotate-6 flex justify-between items-center group hover:bg-gray-200',
          { 'bg-primary-100': pathname === Pathname.requesting },
        )}
        href={Pathname.requesting}
      >
        <div
          key={'spring note left requesting'}
          className={cls(
            'z-30 w-4 h-4 bg-gray-200 rounded-full shadow-lg group-hover:bg-white',
            { 'bg-white': pathname === Pathname.requesting },
          )}
        />
        {Language.$t.Friend.requesting}
        <div
          key={'spring note right requesting'}
          className={cls(
            'z-30 w-4 h-4 bg-gray-200 rounded-full shadow-lg group-hover:bg-white',
            { 'bg-white': pathname === Pathname.requesting },
          )}
        />
      </Link>
    </div>
  );
};

export default memo(observer(Friend));
