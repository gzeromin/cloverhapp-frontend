'use client';
import { Language } from '@/mobx';
import { observer } from 'mobx-react-lite';
import { memo } from 'react';
import { RiLock2Line } from 'react-icons/ri';
import cls from 'classnames';
import Link from 'next/link';

interface Props {
  id: string;
}

const LoginRequest: React.FC<Props> = ({ id }) => {
  return (
    <div 
      className={cls('flex flex-col h-full items-center justify-center relative',
        'bg-gray-200'
      )}
      id={id}
    >
      <RiLock2Line className={cls('text-5xl text-green-500')}/>
      <Link 
        className={
          cls( 
            'text-3xl text-gray-500', 
            Language.logoFont,
            'hover:underline cursor-pointer', 
            'decoration-green-500 underline-offset-2 decoration-2 decoration-dashed',
          )}
        href="/login"
      >
        {Language.$t.SideBarMessage.RequestLogin}
      </Link>
    </div>
  );
};

export default memo(observer(LoginRequest));