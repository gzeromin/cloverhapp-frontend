'use client';
import { observer } from 'mobx-react-lite';
import { memo, useEffect, useState } from 'react';
import cls from 'classnames';
import { Language } from '@/mobx';

// 밝은 배경색과 진한 글자색으로 사용할 색상 배열
const colorPalette = [
  { bg: 'rgb(255, 240, 246)', text: 'rgb(196, 29, 127)' }, // magenta
  { bg: 'rgb(255, 241, 240)', text: 'rgb(207, 19, 34)' }, // red
  { bg: 'rgb(255, 242, 232)', text: 'rgb(212, 56, 13)' }, // volcano
  { bg: 'rgb(255, 247, 230)', text: '#a16207' }, // orange
  { bg: 'rgb(255, 251, 230)', text: 'rgb(212, 107, 8)' }, // gold
  { bg: 'rgb(252, 255, 230)', text: 'rgb(124, 179, 5)' }, // lime
  { bg: 'rgb(246, 255, 237)', text: 'rgb(56, 158, 13)' }, // green
  { bg: 'rgb(230, 255, 251)', text: 'rgb(8, 151, 156)' }, // cyan
  { bg: 'rgb(230, 244, 255)', text: 'rgb(9, 88, 217)' }, // blue
  { bg: 'rgb(240, 245, 255)', text: 'rgb(29, 57, 196)' }, // geekblue
  { bg: 'rgb(249, 240, 255)', text: 'rgb(83, 29, 171)' }, // purple
];

interface Props {
  value: string,
  colorNum: number;
}

const KeyValueHapp: React.FC<Props> = ({ 
  value,
  colorNum,
}) => {
  const [color, setColor] = useState<{ bg: string; text: string }>({ bg: '#bfdbfe', text: '#1e3a8a' });

  useEffect(() => {
    setColor(colorPalette[colorNum]);
  }, [colorNum]);

  return (
    <div 
      className={cls(
        'px-[7px] border rounded-[4px]',
        'text-sm',
      )}
      style={{
        color: color.text,
        backgroundColor: color.bg,
        borderColor: color.text,
      }}
    >
      {Language.$t.KeyValue[value]}
    </div>
  );
};

export default memo(observer(KeyValueHapp));
