import { memo } from 'react';

interface Props {}

const Memo: React.FC<Props> = () => {
  return <div>Memo</div>;
};

export default memo(Memo);
