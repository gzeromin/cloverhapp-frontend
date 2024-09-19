import { memo } from 'react';

interface Props {}

const Visitor: React.FC<Props> = () => {
  return <div test-id="visitorComponent">Visitor</div>;
};

export default memo(Visitor);
