'use client';

import InputHapp from '@/components/atoms/InputHapp';
import { Dialog, Language, Loading } from '@/mobx';
import api from '@/utils/api.util';
import { handleError } from '@/utils/error.util';
import { observer } from 'mobx-react-lite';
import Image from 'next/image';
import { notFound, useRouter } from 'next/navigation';
import { memo, useEffect, useState } from 'react';
import cls from 'classnames';
import TextareaHapp from '@/components/atoms/TextareaHapp';
import { CounterUnit, IntervalUnit, UserStamp } from '@/types/UserStamp';
import AddFriendsHapp from '@/components/atoms/AddFriendsHapp';
import AddTagsHapp from '@/components/atoms/AddTagsHapp';
import { Friend } from '@/types/Friend';
import { Tag } from '@/types/Tag';
import { IoArrowUndoCircleOutline } from 'react-icons/io5';
import FieldWrapperHapp from '@/components/atoms/FieldWrapperHapp';
import { MdOutlineDriveFileRenameOutline } from 'react-icons/md';
import CycleCounter from '@/components/molecules/\bCycleCounter';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';
import { StampStatus, StampType } from '@/types/Stamp';
import { RxLockClosed, RxLockOpen2 } from 'react-icons/rx';
import SelectHapp from '@/components/atoms/SelectHapp';
import { GoPeople } from 'react-icons/go';

const statusOptions = [
  {
    value: StampStatus.PRIVATE,
    labelLevel1: 'StampStatus',
    labelLevel2: StampStatus.PRIVATE,
    icon: <RxLockClosed />,
  },
  {
    value: StampStatus.FRIEND,
    labelLevel1: 'StampStatus',
    labelLevel2: StampStatus.FRIEND,
    icon: <GoPeople />,
  },
  {
    value: StampStatus.PUBLIC,
    labelLevel1: 'StampStatus',
    labelLevel2: StampStatus.PUBLIC,
    icon: <RxLockOpen2 />,
  },
];
interface UserStampUpdatePageProps {
  params: { userStampId: string };
}

const UserStampUpdatePage = ({ params }: UserStampUpdatePageProps) => {
  const { userStampId } = params;
  const [userStamp, setUserStamp] = useState<UserStamp>();
  const [displayOrder, setDisplayOrder] = useState('');
  const [isDisplay, setIsDisplay] = useState<boolean>(false);
  const [alias, setAlias] = useState<string | undefined>('');
  const [memo, setMemo] = useState('');
  const [friends, setFriends] = useState<Friend[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [existGoal, setExistGoal] = useState<boolean>(false);
  const [goalUnit, setGoalUnit] = useState<CounterUnit>(CounterUnit.Number);
  const [goalInterval, setGoalInterval] = useState<IntervalUnit>(IntervalUnit.Week);
  const [goalNumber, setGoalNumber] = useState<string>('0');
  const [stampStatus, setStampStatus] = useState(StampStatus.PRIVATE);

  const router = useRouter();

  useEffect(() => {
    api.get('/user-stamp/' + userStampId).then((res) => {
      const data: UserStamp = res.data;
      setUserStamp(data);
      setDisplayOrder(String(data.displayOrder));
      setIsDisplay(data.isDisplay);
      setStampStatus(data.status);
      setAlias(data.alias);
      setMemo(data.memo);
      setTags(data.Tags);
      setFriends(data.Friends);
      setExistGoal(data.existGoal);
      setGoalUnit(data.goalUnit);
      setGoalInterval(data.goalInterval);
      setGoalNumber(data.goalNumber);
    }).catch(() => {
      notFound();
    });
  }, [userStampId]);

  const updateUserStamp = async () => {
    Loading.setIsLoading(true);
    try {
      const updateStampDto = {
        alias,
        memo,
        isDisplay,
        displayOrder,
        status: stampStatus,
        Tags: tags,
        Friends: friends,
        existGoal,
        goalUnit,
        goalInterval,
        goalNumber,
      };
      await api.post('/user-stamp/' + userStamp!.id, updateStampDto);
      // 업데이트 성공 후 페이지 새로 고침
      const dialogResult = await Dialog.openDialog(
        Dialog.SUCCESS,
        Language.$t.Success.StampEdit,
      );
      if (dialogResult) {
        window.location.reload();
      }
    } catch (error: any) {
      console.log(error);
      handleError(error);
    } finally {
      Loading.setIsLoading(false);
    }
  };

  const deleteUserStamp = async () => {
    Loading.setIsLoading(true);
    try {
      await api.delete('/user-stamp/' + userStamp!.id);
    } catch (error: any) {
      handleError(error);
    } finally {
      Loading.setIsLoading(false);
    }
  };

  return (
    <div className={cls(
      'relative h-[80vh] overflow-y-auto',
      'flex flex-col items-center justify-center'
    )}>
      {/* header */}
      <div className={cls(
        'absolute top-[30px] left-[30px] w-11/12', 
        'flex items-center justify-between gap-10'
      )}>
        <IoArrowUndoCircleOutline
          className="text-6xl text-primary hover:text-primary-hover cursor-pointer"
          onClick={() => router.push('/stamp')}
        />
        <div className={cls('flex items-center gap-2 grow')}>
          <MdOutlineDriveFileRenameOutline className={cls(
            'text-3xl text-gray-500'
          )} />
          <InputHapp
            className={cls(
              'text-base flex gap-3 items-center grow font-bold tracking-wider'
            )}
            placeholder={Language.$t.Input.Alias}
            value={alias}
            onChange={(e) => setAlias(e.target.value)}
            marginBottom="mb-1"
            border={true}
          />
        </div>
        {userStamp &&
          <Image
            src={userStamp.Stamp.url}
            alt={`happ modify modal ${userStamp.alias}`}
            className={cls(
              'h-auto object-contain aspect-square',
              ''
            )}
            width={100}
            height={100}
          />
        }
      </div>

      {/* body */}
      <div className="w-full p-4">
        <div className={cls('flex items-center justify-between')}>
          <div className={cls(
            'mb-3 w-1/3 flex justify-between gap-3',
            'text-base'
          )}>
            <label className={cls(
              'text-sm text-nowrap font-bold',
            )}>
              {Language.$t.Input.Display}
            </label>
            <div className={cls('flex items-center gap-2')}>
              {isDisplay &&          
                <AiOutlineEye className='text-2xl'/>
              }
              {!isDisplay &&
                <AiOutlineEyeInvisible className='text-2xl'/>
              }
              <input
                type="checkbox"
                className={cls(
                  'p-2 focus:bg-white focus:outline-none rounded',
                  'scale-150',
                )}
                checked={isDisplay}
                onChange={(e) => setIsDisplay(e.target.checked)}
              />
            </div>
          </div>
          <InputHapp
            labelName={Language.$t.Input.Order}
            labelClassName='font-bold'
            className={cls(
              'text-base flex gap-3 items-center w-1/4'
            )}
            type="number"
            placeholder='1'
            value={displayOrder}
            onChange={(e) => setDisplayOrder(e.target.value)}
            inputClassName='text-center'
            min="1"
          />
          <SelectHapp
            className={cls(
              'flex items-center gap-3 mb-3',
              'rounded-md w-1/4'
            )}
            labelName={Language.$t.Input.StampStatus}
            labelClassName={cls('font-bold')}
            options={statusOptions}
            selected={stampStatus}
            onSelected={setStampStatus}
            border={true}
            dark={true}
            wide={true}
          ></SelectHapp>
        </div>
        <FieldWrapperHapp
          labelName={Language.$t.Input.Goal}
          labelClassName='w-1/5 font-bold'
          className={cls(
            'text-base flex items-center'
          )}
          border={false}
        >
          <CycleCounter
            existGoal={existGoal}
            setExistGoal={setExistGoal}
            goalUnit={goalUnit}
            setGoalUnit={setGoalUnit}
            goalInterval={goalInterval}
            setGoalInterval={setGoalInterval}
            goalNumber={goalNumber}
            setGoalNumber={setGoalNumber}
          />
        </FieldWrapperHapp>
        {((userStamp && userStamp.Stamp.type === StampType.EXPENSE) 
        || (userStamp && userStamp.Stamp.type === StampType.INCOME)) && (
          <FieldWrapperHapp
            labelName={Language.$t.Input.CommunityOfFate}
            labelClassName='w-1/5 font-bold'
            className={cls(
              'text-base flex gap-3 items-center'
            )}
          >
            <AddFriendsHapp 
              friends={friends}
              setFriends={setFriends}
            />
          </FieldWrapperHapp>
        )}
        <TextareaHapp
          labelName={Language.$t.Input.Memo}
          labelClassName='w-1/5 font-bold'
          className={cls(
            'text-base flex gap-3'
          )}
          placeholder={Language.$t.Placeholder.Memo}
          value={memo}
          onChange={(e) => setMemo(e.target.value)}
          border={true}
        />
        <FieldWrapperHapp
          labelName={Language.$t.Input.Tag}
          labelClassName='w-1/5 font-bold'
          className={cls(
            'text-base flex gap-3 items-center'
          )}
        >
          <AddTagsHapp 
            tags={tags}
            setTags={setTags}
          />
        </FieldWrapperHapp>
      </div>
      {/* footer */}
      <div className={cls(
        'absolute w-full bottom-0 p-5',
        'grid grid-flow-col items-center justify-stretch gap-5', 
      )}>
        <button
          className="m-1 border rounded-lg bg-danger py-1.5 px-3 text-white text-lg"
          onClick={deleteUserStamp}
        >
          {Language.$t.Button.Delete}
        </button>
        <button
          className="m-1 border rounded-lg bg-cancel py-1.5 px-3 text-white text-lg"
        >
          {Language.$t.Button.Cancel}
        </button>
        <button 
          className="m-1 border rounded-lg bg-primary py-1.5 px-3 text-white text-lg"
          onClick={updateUserStamp}  
        >
          {Language.$t.Button.Save}
        </button>
      </div>
    </div>
  );
};

export default memo(observer(UserStampUpdatePage));