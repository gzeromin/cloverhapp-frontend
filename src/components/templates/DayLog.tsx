import { memo, useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import cls from 'classnames';
import StampPalette from '../organisms/StampPalette';
import { Stamp } from '@/types/Stamp';
import useSWRInfinite from 'swr/infinite';
import { fetcher } from '@/utils/api.util';
import makeSection from '@/utils/makeSection.util';
import StampFeed from '../molecules/StampFeed';
interface DayLogProps {
  className: string;
}

const DayLog: React.FC<DayLogProps> = ({
  className,
}) => {
  const [observedIcon, setObservedIcon] = useState('');
  const [selectedCtrlStampId, setSelectedCtrlStampId] = useState('');
  const getKey = (pageIndex: number, previousPageData: Stamp[]) => {
    if (previousPageData && !previousPageData.length) return null;
    return `/stamp/list?page=${pageIndex}`;
  };

  const {
    data,
    size: page,
    setSize: setPage,
    mutate,
  } = useSWRInfinite<Stamp[]>(getKey, fetcher);

  const stamps: { [key: string]: Stamp[] } = makeSection(
    data ? ([] as Stamp[]).concat(...data) : [],
  );

  useEffect(() => {
    if (!stamps || Object.keys(stamps).length === 0) {
      return;
    }
    const lastKey = Object.keys(stamps)[Object.keys(stamps).length - 1];
    const id = stamps[lastKey][stamps[lastKey].length - 1].id;
    if (id !== observedIcon) {
      setObservedIcon(id);
      observeElement(document.getElementById(id));
    }
  }, [stamps]);

  const observeElement = (element: HTMLElement | null) => {
    if (!element) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting === true) {
          console.log('[home]마지막 포스트에 왔습니다.');
          setPage(page + 1);
          observer.unobserve(element);
        }
      },
      { threshold: 0.1 },
    );
    observer.observe(element);
  };

  return (
    <div className={cls(className)} test-id='dayLogComponent'>
      <div className="flex h-[90vh] pb-14 flex-col overflow-y-auto">
        {Object.entries(stamps).map(
          ([monthDate, stampSection]: [string, Stamp[]]) => {
            return (
              <div
                className="mt-5 border-t border-primary-hover"
                key={`stampSection-${monthDate}`}
              >
                <div className="flex justify-center sticky top-[14px] -translate-y-3">
                  <span className="font-base cursor-default px-4 py-0 z-50 shadow-md border bg-primary-100 top-[13px] rounded-full">
                    {monthDate}
                  </span>
                </div>
                <div className="flex flex-col justify-center items-center">
                  {stampSection.map((stamp, index) => (
                    <StampFeed
                      stamp={stamp}
                      key={`${stamp.id} ${index}`}
                      setSelectedCtrlStampId={setSelectedCtrlStampId}
                      selectedCtrlStampId={selectedCtrlStampId}
                      mutateStamp={mutate}
                    />
                  ))}
                </div>
              </div>
            );
          },
        )}
      </div>
      <StampPalette 
        className='fixed bottom-0 inset-x-0 w-full p-1 pt-2 pb-3 bg-green-50' size={50}
        mutateStamp={mutate}
      />
    </div>
  );
};

export default memo(observer(DayLog));
