'use client';
import { observer } from 'mobx-react-lite';
import { memo } from 'react';

interface Props {}

const Sample: React.FC<Props> = () => {

  return (
    <div className="">
    </div>
  );
};

export default memo(observer(Sample));
