import { memo } from 'react';
import cls from 'classnames';

const Footer: React.FC = () => {
  return (
    <div
      className={cls(
        'absolute text-primary-100 z-10',
        '-right-40 top-1/2',
        '-rotate-90',
        // md 이상에서는 아래쪽에 가로로 표시
        'lg:inset-x-0 lg:bottom-0 lg:flex lg:items-center lg:justify-center',
        'lg:rotate-0 lg:top-auto',
      )}
    >
      Copyright 2024. Jiyoung Min all rights reserved.
    </div>
  );
};

export default memo(Footer);
