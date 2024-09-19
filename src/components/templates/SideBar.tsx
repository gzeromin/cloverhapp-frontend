'use client';
import { Language } from '@/mobx';
import { observer } from 'mobx-react-lite';
import { memo, useState } from 'react';
import Profile from '../organisms/sideBar/Profile';
import Home from '../organisms/sideBar/Home';
import Stamp from '../organisms/sideBar/Stamp';
import Memo from '../organisms/sideBar/Memo';
import Visitor from '../organisms/sideBar/Visitor';
import { useAuthState } from '@/context/auth';
import { RiLock2Line } from 'react-icons/ri';
import cls from 'classnames';
import Link from 'next/link';

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
  const [selectedMenu, setSelectedMenu] = useState(Menu.Memo);

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
      return <Memo />;
    }
  };

  const tabStyle = (menu: string) => {
    if (selectedMenu === menu) {
      return '-rotate-45 inline-block rounded-t-lg bg-gray-100 text-primary';
    }
    return '-rotate-45 inline-block rounded-t-lg hover:bg-gray-100 bg-gray-50 hover:text-gray-600 text-xs';
  };

  return (
    <div className={className} test-id='sideBarComponent'>
      {/*  로그인 안했을 때 */}
      { !user &&
        <div 
          className={cls('flex flex-col h-full items-center justify-center relative',
            'bg-gray-200'
          )}
          test-id="SideBarloginRequest"
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
            test-id="loginLink"
          >
            {Language.$t.SideBar.RequestLogin}
          </Link>
        </div>
      }
      {/* 로그인 했을 때 */}
      { user &&
      <div test-id="SideBarMenu">
        <div className="h-[40px] flex items-end justify-around text-sm font-medium text-gray-500">
          <button
            className={tabStyle(Menu.Memo)}
            onClick={() => setSelectedMenu(Menu.Memo)}
            test-id="memoButton"
          >
            {Language.$t.SideBar.Memo}
          </button>
          <button
            className={tabStyle(Menu.Home)}
            onClick={() => setSelectedMenu(Menu.Home)}
            test-id="homeButton"
          >
            {Language.$t.SideBar.Home}
          </button>
          <button
            className={tabStyle(Menu.Stamp)}
            onClick={() => setSelectedMenu(Menu.Stamp)}
            test-id="stampButton"
          >
            {Language.$t.SideBar.Stamp}
          </button>
          <button
            className={tabStyle(Menu.Visitor)}
            onClick={() => setSelectedMenu(Menu.Visitor)}
            test-id="visitorButton"
          >
            {Language.$t.SideBar.Visitor}
          </button>
          <button
            className={tabStyle(Menu.Profile)}
            onClick={() => setSelectedMenu(Menu.Profile)}
            test-id="profileButton"
          >
            {Language.$t.SideBar.Profile}
          </button>
        </div>
        {/* 스탬프 팔레트 */}
        <div className="relative w-full h-[540px]">
          <div className="absolute inset-0 pattern-boxes pattern-gray-300 pattern-size-4" />
          <div className="relative z-10 mt-4 h-[540px]">
            {showMenu()}
          </div>
        </div>
      </div>
      }
    </div>
  );
};

export default memo(observer(SideBar));
