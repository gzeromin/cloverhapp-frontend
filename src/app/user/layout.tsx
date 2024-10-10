'use client';
import { observer } from 'mobx-react-lite';
import UserMenu, { UserMenuEnum } from '../../components/organisms/user/UserMenu';
import cls from 'classnames';
import { notoSans } from '@/styles/fonts';

function DashboardLayout({ children }: { children: React.ReactNode }) {
  
  return (
    <section>
      <div className={cls(
        'flex items-center justify-center h-screen', notoSans.className
      )}>
        <div className="relative w-[600px] h-[600px] flex items-center justify-center">
          <div className="-z-10 absolute inset-0 rounded-full pattern-boxes pattern-gray-300 pattern-size-4 border border-gray-300" />
          <UserMenu menuName={UserMenuEnum.ProfilePhoto} index={-1} />
          <UserMenu menuName={UserMenuEnum.Info} index={0} />
          <UserMenu menuName={UserMenuEnum.KeyValue} index={1} />
          <UserMenu menuName={UserMenuEnum.ChangePassword} index={2} />
          <UserMenu menuName={UserMenuEnum.Withdrawal} index={3} />
          <div>{children}</div>
        </div>
      </div>
    </section>
  );
}

export default observer(DashboardLayout);
