import Image from 'next/image';
import { memo, useEffect, useRef } from 'react';
import cls from 'classnames';
import { UserStamp } from '@/types/UserStamp';
import { useDrag } from 'react-dnd';
import { Dnd } from '@/types/Happ';

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

  const [{ isDragging }, dragRef, preview] = useDrag({
    type: Dnd.CREATED,
    item: userStamp ? userStamp : null,
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });
  
  const ref = useRef<HTMLImageElement>(null);
  dragRef(ref);

  useEffect(() => {
    if (ref.current) {
      // 이미지 태그만 드래그 미리보기로 사용
      preview(ref.current, { captureDraggingState: true });
    }
  }, [preview]);

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
          ref={ref}
          src={userStamp.Stamp.url}
          alt={userStamp.alias}
          className={cls(
            'rounded-full object-contain aspect-square',
            { 'opacity-50': isDragging }
          )}
          width={size}
          height={size}
          priority
        />
      )}
    </div>
  );
};

export default memo(StampButton);
