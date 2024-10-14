'use client';
import { Happ, TodoStatus } from '@/types/Happ';
import { observer } from 'mobx-react-lite';
import { memo } from 'react';
import cls from 'classnames';
import DateUtils from '@/utils/date.util';
import Constants from '@/common/constants';
import Image from 'next/image';
import { StampType } from '@/types/Stamp';
import { OPEN_MONEY, OPEN_TIME } from '@/components/molecules/happSaveModal/InputNav';
import { thousandComma } from '@/utils/number.util';
import { AiOutlineRight } from 'react-icons/ai';
import { useRouter } from 'next/navigation';
import { Language } from '@/mobx';
import { TbPhoto } from 'react-icons/tb';
import { GoTag } from 'react-icons/go';
import { RiLinksLine } from 'react-icons/ri';
import { BsCheckCircle, BsCheckCircleFill } from 'react-icons/bs';

interface Props {
  happ: Happ;
}

const DailyHapp: React.FC<Props> = ({
  happ,
}) => {
  const {
    startTime, 
    endTime,
    memo,
    money,
    moneyUnit,
    water,
    imageUrls,
    Book,
    bookPercent,
    UserStamp,
    todo,
    Tags,
    Friends,
  } = happ;
  const router = useRouter();

  const type = happ.UserStamp.Stamp.type;

  const getHappInfo = () => {
    const infos: string[] = [];
    if(OPEN_MONEY.includes(type)) {
      const info = thousandComma(Number(money)) + Language.$t.MoneyUnit[moneyUnit];
      infos.push(info);
    }
    if(type === StampType.BOOK && Book) {
      const info = Book.title + ', ' + bookPercent + Constants.UNIT.PERCENT;
      infos.push(info);
    }
    if(type === StampType.WATER && water) {
      const info = water + Constants.UNIT.ML;
      infos.push(info);
    }
    if(OPEN_TIME.includes(type) && endTime && (startTime != endTime)) {
      const info = DateUtils.getFormatDuration(new Date(startTime), new Date(endTime));
      infos.push(info);
    }
    return infos.join(',');
  };

  return (
    <div 
      id={happ.id} 
      className={cls(
        'w-full p-2 flex items-center cursor-pointer',
        'hover:bg-gray-200 hover:bg-opacity-50 group'
      )}
      onClick={() => router.push('/modalPage/update/' + happ.id)}
    >
      {/* 시간 */}
      <div className="flex-1 px-1">
        <div> 
          {DateUtils.getFormatHourMin(new Date(startTime))}
        </div>
        {endTime && (startTime != endTime) && (
          <div className='px-1 text-sm text-gray-500'>
            {Constants.SYMBOLS.TILDE}
            {DateUtils.getFormatHourMin(new Date(endTime))}
          </div>
        )}
      </div>

      {/* Happ */}
      <Image
        src={UserStamp.Stamp.url}
        alt={`daily happ ${happ.id}`}
        className={cls('h-auto object-contain aspect-square flex-1')}
        width={55}
        height={55}
        priority
      />
      <div className={cls('w-2/3')}>
        {/* Memo */}
        <div className='truncate'>
          {memo}
        </div>
        {/* Tags & Friends */}
        {/* <div className='flex gap-2'>
          { Tags && Tags.map((e, index) => <TagHapp 
            key={`Tag ${e.id} ${index}`} 
            name={e.name}
          />)}
        </div> */}
        {/* Happ Info */}
        <div className='text-sm text-gray-500 flex items-center gap-1'>
          {getHappInfo()}
          {imageUrls && (
            <TbPhoto className='text-blue-700'/>
          )}
          {Tags && Tags.length > 0 && (
            <GoTag className='text-primary'/>
          )}
          {Friends && (
            <RiLinksLine/>
          )}
          {TodoStatus.TODO == todo && (
            <BsCheckCircle className='text-green-700' />
          )}
          {TodoStatus.COMPLETE == todo && (
            <BsCheckCircleFill className='text-green-700' />
          )}
        </div>
      </div>
      <div className='flex-1'>
        <AiOutlineRight
          className={cls(
            'rounded-full text-2xl p-1', 
            'group-hover:bg-gray-200'
          )}
        />
      </div>
    </div>
  );
};

export default memo(observer(DailyHapp));
