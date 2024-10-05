'use client';
import { memo } from 'react';

interface Props {}

const Friend: React.FC<Props> = () => {
  return (
    <div 
      className="flex flex-col p-3"
      test-id="friendPage"
    >
      Visitor
    </div>
  );
};

export default memo(Friend);