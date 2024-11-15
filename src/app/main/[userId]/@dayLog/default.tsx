'use client';
import { memo, useState } from 'react';
import { observer } from 'mobx-react-lite';
import cls from 'classnames';
import { Happ } from '@/types/Happ';
import makeSection from '@/utils/makeSection.util';
import UserStampLinks from '@/components/templates/UserStampLinks';
import DateUtils from '@/utils/date.util';
import Image from 'next/image';
import Constants from '@/common/constants';
import { notoSans } from '@/styles/fonts';
import DailyHapp from '@/components/organisms/dayLog/DailyHapp';
import { HappActionEnum, useHappDispatch, useHappState } from '@/context/happ';
import api from '@/utils/api.util';
import { useParams } from 'next/navigation';
import { Loading } from '@/mobx';

interface DayLogProps {
  className: string;
}

const DayLog: React.FC<DayLogProps> = ({
  className,
}) => {
  const { userId } = useParams();
  const { happList } = useHappState();
  const [page, setPage] = useState(1);
  const dispatch = useHappDispatch();
  const pageSize = 20;

  const happData = happList.slice(0, page * pageSize);
  const happs: { [key: string]: Happ[] } = makeSection(
    happData ? ([] as Happ[]).concat(...happData) : [],
  );
  
  // 추가 데이터를 가져오는 함수
  const fetchMoreHappData = async () => {
    if (Loading.isLoading) return; // 이미 요청 중이면 추가 요청 금지
    Loading.setIsLoading(true);
    try {
      const res = await api.get(`/happ/page/${userId}?skip=${happList.length}`);
      dispatch(HappActionEnum.UPDATE_HAPPLIST, res.data);
      setPage(page + 1);
    } catch (error) {
      console.error('Error fetching more happ data:', error);
    } finally {
      Loading.setIsLoading(false);
    }
  };

  return (
    <div className={cls(notoSans.className, className)} id="dayLogPage">
      <div className="flex h-[90vh] pb-14 flex-col overflow-y-auto">
        {Object.entries(happs).map(
          ([monthDate, happSection]: [string, Happ[]]) => {
            const icons: { [iconUrl: string]: number } = {};
            happSection.forEach((happ) => {
              const iconUrl = happ.UserStamp.Stamp.url;
              if (icons[iconUrl]) {
                icons[iconUrl] += 1;
              } else {
                icons[iconUrl] = 1;
              }
            });
            return (
              <div
                className="mt-5"
                key={`happSection-${monthDate}`}
              >
                <div className={cls(
                  'sticky top-[14px] -translate-y-3',
                  'bg-blue-50 p-3',
                  'flex items-center justify-between'
                )}>
                  {DateUtils.getFullDateString(new Date(monthDate))}
                  <div className={cls('flex')}>
                    {Object.keys(icons).map((e) => (
                      <div
                        key={`icons-${monthDate}-${e}`}
                        className={cls('flex items-center')}
                      >
                        <Image
                          src={e}
                          alt={`icons ${e} ${monthDate}`}
                          className="object-cover"
                          width={30}
                          height={30}
                          style={{ width: 'auto' }}
                          priority
                        />
                        {icons[e] > 1 && (
                          <div className={cls('text-xs')}>
                            {Constants.SYMBOLS.X} {icons[e]}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex flex-col justify-center items-center">
                  {happSection.map((happ, index) => (
                    <DailyHapp
                      happ={happ}
                      key={`${happ.id} ${index}`}
                    />
                  ))}
                </div>
              </div>
            );
          },
        )}
        {/* 더보기 버튼 추가 */}
        {happList.length >= page * pageSize && (
          <div className="flex justify-center my-5">
            <button
              className="px-4 py-2 bg-blue-500 text-white rounded-lg"
              onClick={fetchMoreHappData}
              disabled={Loading.isLoading} // 데이터 로딩 중에는 버튼 비활성화
            >
              {Loading.isLoading ? '로딩 중...' : '더보기'}
            </button>
          </div>
        )}
      </div>
      <UserStampLinks 
        className='fixed bottom-0 inset-x-0 w-full p-3 bg-green-50'
      />
    </div>
  );
};

export default memo(observer(DayLog));
