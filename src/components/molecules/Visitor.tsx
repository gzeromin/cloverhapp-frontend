import { memo } from 'react';

interface Props {}

const Visitor: React.FC<Props> = () => {
  return <div>Visitor</div>;
};

export default memo(Visitor);
