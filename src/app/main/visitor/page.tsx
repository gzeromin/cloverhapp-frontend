'use client';
import { memo } from 'react';

interface Props {}

const Visitor: React.FC<Props> = () => {
  return (
    <div 
      className="flex flex-col p-3"
      test-id="visitorPage"
    >
      Visitor
    </div>
  );
};

export default memo(Visitor);