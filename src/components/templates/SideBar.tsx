'use client';
import { Language } from '@/mobx';
import { observer } from 'mobx-react-lite';
import { memo, useState } from 'react';
import Profile from '../molecules/Profile';
import Home from '../molecules/Home';
import Stamp from '../molecules/Stamp';
import Memo from '../molecules/Memo';
import Visitor from '../molecules/Visitor';

interface Props {
  className: string;
}

enum Menu {
  Profile = 'Profile',
  Home = 'Home',
  Stamp = 'Stamp',
  Memo = 'Memo',
  Visitor = 'Visitor',
}

const SideBar: React.FC<Props> = ({ className }) => {
  const [selectedMenu, setSelectedMenu] = useState('Profile');

  const showMenu = () => {
    switch (selectedMenu) {
    case Menu.Profile:
      return <Profile />;
    case Menu.Home:
      return <Home />;
    case Menu.Stamp:
      return <Stamp />;
    case Menu.Memo:
      return <Memo />;
    case Menu.Visitor:
      return <Visitor />;
    default:
      return <Profile />;
    }
  };

  const tabStyle = (menu: string) => {
    if (selectedMenu === menu) {
      return '-rotate-45 inline-block text-primary bg-gray-100 rounded-t-lg';
    }
    return '-rotate-45 inline-block rounded-t-lg hover:bg-gray-100 bg-gray-50 hover:text-gray-600 text-xs';
  };

  return (
    <div className={className}>
      <div className="h-[40px] flex items-end justify-around text-sm font-medium text-gray-500">
        <button
          className={tabStyle(Menu.Profile)}
          onClick={() => setSelectedMenu(Menu.Profile)}
        >
          {Language.$t.SideBar.Profile}
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
          className={tabStyle(Menu.Memo)}
          onClick={() => setSelectedMenu(Menu.Memo)}
        >
          {Language.$t.SideBar.Memo}
        </button>
        <button
          className={tabStyle(Menu.Visitor)}
          onClick={() => setSelectedMenu(Menu.Visitor)}
        >
          {Language.$t.SideBar.Visitor}
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
  );
};

export default memo(observer(SideBar));
