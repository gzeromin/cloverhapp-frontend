'use client';
import cls from 'classnames';
import Link from 'next/link';
import { memo } from 'react';
import { BsFillPersonPlusFill } from 'react-icons/bs';

interface Props {}

const Friend: React.FC<Props> = () => {
  return (
    <div 
      className="flex flex-col p-3"
      test-id="friendPage"
    >
      <Link href="/friend">
        <BsFillPersonPlusFill 
          className={cls(
            'text-gray-500 cursor-pointer text-2xl', 
            'mr-2 hover:text-primary',
            'absolute right-0 top-1'
          )}
        />
      </Link>
    </div>
  );
};

export default memo(Friend);