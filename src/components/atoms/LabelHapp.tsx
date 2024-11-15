'use client';
import cls from 'classnames';
import { observer } from 'mobx-react-lite';

interface Props {
  htmlFor: string;
  children?: string;
  className?: string;
}

const LabelHapp: React.FC<Props> = ({
  htmlFor, children, className,
}) => {
  return (
    <label
      htmlFor={htmlFor} 
      className={cls(
        'text-sm text-nowrap',
        className,
      )}
    >
      {children}
    </label>
  );
};

export default observer(LabelHapp);
