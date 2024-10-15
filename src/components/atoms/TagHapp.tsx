'use client';
import { observer } from 'mobx-react-lite';
import { memo, useEffect, useState } from 'react';
import cls from 'classnames';
import { colorPalette } from './KeyValueHapp';
import { GoTag } from 'react-icons/go';

interface Props {
  className?: string,
  name: string,
}

const TagHapp: React.FC<Props> = ({
  className,
  name,
}) => {
  const [color, setColor] = useState<{ bg: string; text: string }>({ bg: '#bfdbfe', text: '#1e3a8a' });
  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * 11);
    setColor(colorPalette[randomIndex]);
  }, [name]);

  return (
    <div 
      className={cls(
        'flex items-center text-sm',
        className
      )}
      style={{
        color: color.text,
      }}
    >
      <GoTag />
      {name}
    </div>
  );
};

export default memo(observer(TagHapp));
