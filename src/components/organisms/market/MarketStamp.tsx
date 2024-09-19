'use client';
import { Stamp } from '@/types/Stamp';
import { BUCKET_URL } from '@/utils/api.util';
import Image from 'next/image';
import cls from 'classnames';

interface MarketStampProps {
  stamp: Stamp;
  selectStamp: (stamp: Stamp) => void;
}

const MarketStamp: React.FC<MarketStampProps> = ({ stamp, selectStamp }) => {
  return (
    <div className="py-2 pl-4" id={stamp.id} onClick={() => selectStamp(stamp)}>
      
      <div className={cls(
        'relative pb-6 cursor-pointer rounded-md shadow-sm', 
        'border border-gray-400 border-dashed',
        'hover:shadow-lg hover:font-bold hover:border-2',
      )}>
        {/* Type */}
        <div className={cls(
          'object-cover absolute left-2 top-1',
          'flex items-center'
        )}>
          <p className='text-xs text-green-600'>
            {stamp.type}
          </p>
        </div>

        {/* Price */}
        <div className={cls(
          'object-cover absolute right-2 top-1',
          'flex items-center'
        )}>
          <p className='text-xs'>
            {stamp.droplet}
          </p>
          <Image
            src={`${BUCKET_URL}/public/icons/droplet.png`}
            alt="droplet"
            className={cls('object-cover')}
            width={20}
            height={20}
            priority
          />
        </div>
        
        <Image
          src={stamp.url}
          alt={`market stamp ${stamp.id}`}
          className="h-auto w-auto mx-auto pt-6 object-contain aspect-square"
          priority
          width={90}
          height={90}
        />
        <p className="text-center pt-2">{stamp.name}</p>
      </div>
    </div>
  );
};

export default MarketStamp;
