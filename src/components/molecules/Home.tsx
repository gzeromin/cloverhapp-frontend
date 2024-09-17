import { memo } from 'react';

interface Props {}

const Home: React.FC<Props> = () => {
  return (
    <div className="flex flex-col p-3">
      오늘 목표로 하는 스탬프
      <div>1</div>
      <div>2</div>
      <div>3</div>
      <div>4</div>
    </div>
  );
};

export default memo(Home);
