'use client';
import { memo } from 'react';

interface Props {}

const Memo: React.FC<Props> = () => {
  return (
    <div 
      className="flex flex-col p-3"
      test-id="memoPage"
    >
      Memo
    </div>
  );
};

export default memo(Memo);