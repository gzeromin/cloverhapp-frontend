import Image from 'next/image';
import { memo, useRef } from 'react';
import cls from 'classnames';
import { UserStamp } from '@/types/UserStamp';
import { useDrag } from 'react-dnd';
import { Dnd } from '@/enums/Dnd';

interface Props {
  className?: string;
  userStamp: UserStamp | undefined;
  size: number;
  onClickStamp: () => void;
}

const StampButton: React.FC<Props> = ({
  userStamp,
  size,
  onClickStamp,
}) => {

  const [{ isDragging }, dragRef] = useDrag({
    type: Dnd.CREATED_HAPP,
    item: userStamp ? userStamp : null,
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });
  
  const ref = useRef<HTMLImageElement>(null);
  dragRef(ref);

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
      { userStamp && (
        <Image
          src={userStamp.Stamp.url}
          alt={userStamp.alias}
          className={cls(
            'rounded-full object-contain aspect-square',
            { 'opacity-50': isDragging }
          )}
          width={size}
          height={size}
          priority
          ref={ref}
        />
      )}
    </div>
  );
};

export default memo(StampButton);
