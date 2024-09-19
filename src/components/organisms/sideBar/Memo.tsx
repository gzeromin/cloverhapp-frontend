import { memo } from 'react';

interface Props {}

const Memo: React.FC<Props> = () => {
  return <div test-id="memoComponent">Memo</div>;
};

export default memo(Memo);
