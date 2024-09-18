'use client';
import { Language } from '@/mobx';
import { observer } from 'mobx-react-lite';
import { memo, useState } from 'react';
import Profile from '../molecules/Profile';
import Home from '../molecules/Home';
import Stamp from '../molecules/Stamp';
import Memo from '../molecules/Memo';
import Visitor from '../molecules/Visitor';
import { useAuthState } from '@/context/auth';
import { RiLock2Line } from 'react-icons/ri';
import { useRouter } from 'next/navigation';
import cls from 'classnames';

interface Props {
  className: string;
}

enum Menu {
  Memo = 'Memo',
  Home = 'Home',
  Stamp = 'Stamp',
  Visitor = 'Visitor',
  Profile = 'Profile',
}

const SideBar: React.FC<Props> = ({ className }) => {
  const { user } = useAuthState();
  const [selectedMenu, setSelectedMenu] = useState('Profile');
  const router = useRouter();

  const showMenu = () => {
    switch (selectedMenu) {
    case Menu.Memo:
      return <Memo />;
    case Menu.Home:
      return <Home />;
    case Menu.Stamp:
      return <Stamp />;
    case Menu.Visitor:
      return <Visitor />;
    case Menu.Profile:
      return <Profile />;
    default:
      return <Profile />;
    }
  };

  const loginHandler = () => {
    router.push('/login');
  };

  const tabStyle = (menu: string) => {
    if (selectedMenu === menu) {
      return '-rotate-45 inline-block text-primary bg-gray-100 rounded-t-lg';
    }
    return '-rotate-45 inline-block rounded-t-lg hover:bg-gray-100 bg-gray-50 hover:text-gray-600 text-xs';
  };

  return (
    <div className={className}>
      {/*  로그인 안했을 때 */}
      { !user &&
        <div 
          className={cls('flex flex-col h-full items-center justify-center relative',
            'bg-gray-200'
          )}  
        >
          <RiLock2Line className={cls('text-5xl text-green-500')}/>
          <div 
            className={
              cls( 
                'text-3xl text-gray-500', 
                Language.logoFont,
                'hover:underline cursor-pointer', 
                'decoration-primary underline-offset-2 decoration-2 decoration-dashed',
              )}
            onClick={() => loginHandler()}
          >
            {Language.$t.SideBar.RequestLogin}
          </div>
        </div>
      }
      {/* 로그인 했을 때 */}
      { user &&
      <div>
        <div className="h-[40px] flex items-end justify-around text-sm font-medium text-gray-500">
          <button
            className={tabStyle(Menu.Memo)}
            onClick={() => setSelectedMenu(Menu.Memo)}
          >
            {Language.$t.SideBar.Memo}
          </button>
          <button
            className={tabStyle(Menu.Home)}
            onClick={() => setSelectedMenu(Menu.Home)}
          >
            {Language.$t.SideBar.Home}
          </button>
          <button
            className={tabStyle(Menu.Stamp)}
            onClick={() => setSelectedMenu(Menu.Stamp)}
          >
            {Language.$t.SideBar.Stamp}
          </button>
          <button
            className={tabStyle(Menu.Visitor)}
            onClick={() => setSelectedMenu(Menu.Visitor)}
          >
            {Language.$t.SideBar.Visitor}
          </button>
          <button
            className={tabStyle(Menu.Profile)}
            onClick={() => setSelectedMenu(Menu.Profile)}
          >
            {Language.$t.SideBar.Profile}
          </button>
        </div>
        {/* 스탬프 팔레트 */}
        <div className="relative w-full h-[540px]">
          <div className="absolute top-0 left-0 right-0 bottom-0 pattern-boxes pattern-gray-300 pattern-size-4" />
          <div className="relative z-10 mt-4">
            {showMenu()}
          </div>
        </div>
      </div>
      }
    </div>
  );
};

export default memo(observer(SideBar));
