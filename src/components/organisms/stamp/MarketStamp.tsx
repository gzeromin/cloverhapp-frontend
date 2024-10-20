'use client';
import { Stamp } from '@/types/Stamp';
import { BUCKET_URL } from '@/utils/api.util';
import Image from 'next/image';
import cls from 'classnames';
import { Language } from '@/mobx';

interface MarketStampProps {
  stamp: Stamp;
  selectStamp: (stampId: string) => void;
}

const MarketStamp: React.FC<MarketStampProps> = ({ stamp, selectStamp }) => {
  return (
    <div className="py-2 pl-4" id={stamp.id} onClick={() => selectStamp(stamp.id)}>
      <div className={cls(
        'relative pb-6 cursor-pointer rounded-md shadow-sm', 
        'border border-gray-400 border-dashed',
        'hover:shadow-lg hover:font-bold hover:border-2',
      )}>
        {/* Type */}
        <div className={cls(
          'object-cover absolute left-2 top-1',
          'flex items-center gap-1'
        )}>
          {stamp.notForSale && (
            <p className={cls(
              'bg-blue-50 text-blue-700 border border-blue-700',
              'rounded-md text-xs px-1 cursor-default'
            )}>
              {Language.$t.Stamp.Default}
            </p>
          )}
          <p className='text-sm text-green-600'>
            {Language.$t.StampType[stamp.type]}
          </p>
        </div>

        {/* Price */}
        <div className={cls(
          'object-cover absolute right-2 top-1',
          'flex items-center'
        )}>
          <p className='text-sm'>
            {stamp.droplet}
          </p>
          <Image
            src={`${BUCKET_URL}/public/icons/droplet.png`}
            alt="droplet"
            className={cls('object-cover')}
            width={20}
            height={20}
          />
        </div>
        
        <Image
          src={stamp.url}
          alt={`stamp stamp ${stamp.id}`}
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
