import Image from 'next/image';
import { memo } from 'react';
import cls from 'classnames';

interface Props {
  className?: string;
  src: string;
  alt: string;
  size: number;
  onClickStamp: () => void;
}

const StampButton: React.FC<Props> = ({
  src,
  alt,
  size,
  onClickStamp,
}) => {
  return (
    <div
      className={cls(
        'rounded-full cursor-pointer',
        'border border-gray-400 border-dashed',
        'hover:bg-primary-hover',
        'flex-shrink-0',
      )}
      onClick={onClickStamp}
    >
      <Image
        src={src}
        alt={alt}
        className="rounded-full object-contain aspect-square"
        width={size}
        height={size}
        priority
      />
    </div>
  );
};

export default memo(StampButton);
