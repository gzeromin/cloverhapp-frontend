'use client';
import { Happ, MoneyUnit } from '@/types/Happ';
import api from '@/utils/api.util';
import { memo, useEffect, useState } from 'react';
import { AiFillCloseSquare } from 'react-icons/ai';
import { observer } from 'mobx-react-lite';
import cls from 'classnames';
import { useAuthState } from '@/context/auth';
import UserProrile from '@/components/molecules/UserProrile';
import CommentHapp from '@/components/atoms/CommentHapp';
import { handleError } from '@/utils/error.util';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import DateUtils from '@/utils/date.util';
import TagHapp from '../atoms/TagHapp';
import DisplayNav, { SHOW_TYPE } from '../molecules/happDisplayModal/DisplayNav';
import DisplayArea from '../molecules/happDisplayModal/DisplayArea';
import { StampType } from '@/types/Stamp';
import { LuGlassWater } from 'react-icons/lu';
import { FaDollarSign, FaWonSign, FaYenSign } from 'react-icons/fa';
import { thousandComma } from '@/utils/number.util';
import { Language } from '@/mobx';

interface Props {
  happId: string | null;
  closeModal: () => void;
}

const HappDisplayModal: React.FC<Props> = ({
  happId,
  closeModal,
}) => {
  const [showType, setShowType] = useState<SHOW_TYPE | undefined>();
  const [memo, setMemo] = useState<string | null>(null);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [collapsed, setCollapsed] = useState(true);
  
  const toggleCollapsed = () => {
    setCollapsed((prev) => !prev);
  };
  const { user } = useAuthState();
  const [happ, setHapp] = useState<Happ>();
  const router = useRouter();

  useEffect(() => {
    api.get('/happ/' + happId).then((res) => {
      const happ: Happ = res.data;
      setHapp(happ);
      setImageUrls(happ.imageUrls);
      if(happ.memo && happ.memo.trim() !== '') {
        setMemo(happ.memo);
        setShowType(SHOW_TYPE.Memo);
      } else if(happ.imageUrls && happ.imageUrls.length > 0) {
        setShowType(SHOW_TYPE.Photo);
      }
    }).catch((error) => { handleError(error); });
  }, [happId]);

  const getTimeInfo = (happ: Happ) => {
    const { startTime, endTime } = happ;
    let timeStr = DateUtils.getFormatDateHourMin(new Date(startTime));
    if (endTime && (startTime != endTime)) {
      const et = DateUtils.getFormatHourMin(new Date(endTime));
      const dr = DateUtils.getFormatDuration(new Date(startTime), new Date(endTime));
      timeStr += ` ~ ${et}(${dr})`;
    }
    return timeStr;
  };

  const getTextInfo = (happ: Happ) => {
    const type: StampType = happ.UserStamp.Stamp.type;
    switch(type) {
    case StampType.WATER:
      const water = Number(happ.water);
      return (
        <div className='flex items-center gap-1'>
          <LuGlassWater className={cls('text-cyan-400 text-3xl')}/>
          <div className={cls('text-xl')}>
            {water/10}{Language.$t.Input.Sip}, {water} ml
          </div>
        </div>
      );
    case StampType.BOOK:
      const book = happ.Book;
      const bookPercent = happ.bookPercent;
      return (
        <div className={cls(
          'relative items-start m-1 '
        )}>
          <div className={cls('flex items-start p-4')}>
            {book.thumbnail && (
              <div className={cls('w-24 h-24 mr-4')}>
                <Image
                  src={book.thumbnail}
                  alt={book.isbn}
                  className={cls('w-full h-full object-cover rounded-lg')}
                  width={96}
                  height={96}
                  priority
                />
              </div>
            )}
            <div className={cls('flex-1')}>
              <div className={cls('text-lg font-semibold text-gray-800 break-words')}>
                {book.title}
              </div>
              <p className={cls('text-sm text-gray-600')}>
                {book.publisher}
              </p>
              <p className={cls('text-sm text-gray-500')}>
                {book.authors && book.authors.join(', ')}
              </p>
            </div>
          </div>
          <div
            className={cls(
              'flex items-center justify-between gap-1',
            )}
          >
            <input
              type="range"
              min="0"
              max="100"
              step="1"
              value={bookPercent}
              className={cls(
                'grow focus:outline-none',
              )}
              disabled
            />
            <div className={cls(
              'text-sm',{
                'bg-emerald-400 rounded-full' : bookPercent == '100',
              },
            )}>
              {bookPercent} %
            </div>
          </div>
        </div>
      );
    case StampType.EXPENSE:
    case StampType.INCOME:
      const getMoneyUnitIcon = (moneyUnit: MoneyUnit) => {
        const className = cls(
          'text-blue-700 cursor-pointer text-xl', 
          'ml-3 hover:text-primary-hover',
        );
        switch(moneyUnit) {
        case MoneyUnit.Dollar:
          return (
            <FaDollarSign className={className} />
          );
        case MoneyUnit.Won:
          return (
            <FaWonSign className={className} />
          );
        case MoneyUnit.Yen:
          return (
            <FaYenSign className={className} />
          );
        }
        return null;
      };
      return (
        <div className={cls('flex items-center gap-1')}>
          { getMoneyUnitIcon(happ.moneyUnit) }
          { thousandComma(Number(happ.money)) } 
        </div>
      );
    }
    return null;
  };

  return (
    <div className="z-50 fixed inset-0 w-full h-full flex flex-col items-center justify-center">
      <div
        className="fixed inset-0 w-full h-full bg-black opacity-50"
        onClick={closeModal}
      >
        {/* Background opacity */}
      </div>
      <div className={cls(
        'z-50 box-border shadow-lg lg:min-w-[500px] max-w-[600px]',
        'bg-white border border-light-black rounded-lg text-2xl'
      )}>

        {/* header */}
        <div className="relative flex p-3 pb-0">
          {happ && happ.User && (
            <div className="flex items-center justify-center gap-2">
              <UserProrile
                user={happ.User}
                alt={`happ feed profile image ${happ.id}`}
                size={60}
                className="h-auto w-auto rounded-full object-cover cursor-pointer aspect-square hover:bg-primary-hover"
                onClickProfile={() => router.push('/main/' + happ.User.id + '/profile')}
              />
              <div>
                <div className="font-normal">{happ.User.nickname}</div>
                {/* 시간 */}
                <div className="flex items-end px-1 text-sm text-gray-500">
                  { getTimeInfo(happ) }
                </div>
              </div>
            </div>
          )}
          <AiFillCloseSquare
            className={cls(
              'text-primary cursor-pointer text-3xl', 
              'mr-2 hover:text-primary-hover',
              'absolute right-0'
            )}
            onClick={closeModal}
          />
          {/* Friends */}
          <div 
            className={cls(
              'absolute right-3 bottom-0 translate-y-2',
              'flex gap-1 max-w-[300px] flex-wrap'
            )}
            id='happDisplayModal-friendsArea'
          >
            {happ && happ.Friends.map((friend, index) => (
              <div
                key={`displayArea ${friend.id}`}
                className="flex px-1 rounded-full justify-between gap-1"
              >
                <div className='w-[30px] h-[30px]'>
                  <UserProrile
                    user={friend.Friend}
                    alt={`displayArea userProfile ${friend.id} ${index}`}
                    size={30}
                    className="rounded-full aspect-square object-cover"
                  />
                </div>
                <div className="text-base mr-1">{friend.alias}</div>
              </div>
            ))}
          </div>
        </div>
        {/* body */}
        <div className="p-4 max-h-4/5 overflow-y-auto">
          {happ && (
            <div className={cls('flex justify-center', 'border-dashed border-2 border-gray-100')}>
              <div className={cls('flex items-center justify-between gap-2')}>
                {/* left */}
                { getTextInfo(happ) }
                {/* right */}
                <div>
                  <Image
                    src={happ.UserStamp.Stamp.url}
                    alt={`happ display modal ${happ.id}`}
                    className="h-auto object-contain aspect-square"
                    width={90}
                    height={90}
                  />
                </div>
              </div>
            </div>
          )}
          {/* Tags */}
          <div 
            className={cls('flex items-center gap-2 px-3 py-1')}
            id='happDisplayModal-tagsArea'
          >
            {happ && happ.Tags.map((e) => <TagHapp key={`displayHapp-${happ.id} tag-${e.id}`} name={e.name} />)}
          </div>
          <DisplayNav
            happStatus={happ?.status}
            showType={showType}
            setShowType={setShowType}
            memo={memo}
            imageUrls={imageUrls}
            collapsed={collapsed}
            toggleCollapse={toggleCollapsed}
          />
          <DisplayArea
            showType={showType}
            memo={memo}
            imageUrls={imageUrls}
            collapsed={collapsed}
          />
          
          <CommentHapp
            user={user}
            happId={happId}
            Comments={happ && happ.Comments}
          />
        </div>
      </div>
    </div>
  );
};

export default memo(observer(HappDisplayModal));
