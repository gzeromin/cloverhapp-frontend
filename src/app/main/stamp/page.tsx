'use client';
import { memo } from 'react';
import cls from 'classnames';
import { observer } from 'mobx-react-lite';
import { Language } from '@/mobx';
import { TbSettingsShare } from 'react-icons/tb';
import Link from 'next/link';

interface Props {
}

const StampPage: React.FC<Props> = ({}) => {
  return (
    <div className={cls(
      'flex flex-col p-1',
      Language.logoFont
    )}>
      <Link href="/stamp">
        <TbSettingsShare 
          className={cls(
            'text-gray-500 cursor-pointer text-2xl', 
            'mr-2 hover:text-primary',
            'absolute right-0 top-1'
          )}
        />
      </Link>
      {'<경제 공동체>'}
      {'<목표>'}
    </div>
  );
};

export default memo(observer(StampPage));
