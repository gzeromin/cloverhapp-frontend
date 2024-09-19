'use client';
import MarketStamp from '@/components/organisms/market/MarketStamp';
import { Stamp } from '@/types/Stamp';
import { fetcher } from '@/utils/api.util';
import { memo, useEffect, useState } from 'react';
import useSWRInfinite from 'swr/infinite';
import DownloadModal from '@/components/organisms/market/DownloadModal';

interface Props {}

const Sale: React.FC<Props> = () => {

  const [observedStamp, setObservedStamp] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedStamp, setSelectedStamp] = useState<Stamp>();

  const getKey = (pageIndex: number, previousPageData: Stamp[]) => {
    if (previousPageData && !previousPageData.length) return null;
    return `/stamp?page=${pageIndex}`;
  };

  const {
    data,
    size: page,
    setSize: setPage,
  } = useSWRInfinite<Stamp[]>(getKey, fetcher);

  const stamps: Stamp[] = data ? ([] as Stamp[]).concat(...data) : [];

  useEffect(() => {
    if (!stamps || stamps.length === 0) return;
    const id = stamps[stamps.length - 1].id;
    if (id !== observedStamp) {
      setObservedStamp(id);
      observeElement(document.getElementById(id));
    }
  }, [stamps]);

  const observeElement = (element: HTMLElement | null) => {
    if (!element) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting === true) {
          console.log('[sale]마지막 포스트에 왔습니다.');
          setPage(page + 1);
          observer.unobserve(element);
        }
      },
      { threshold: 1 },
    );
    observer.observe(element);
  };

  const onSelectStamp = (stamp: Stamp) => {
    setShowModal(true);
    setSelectedStamp(stamp);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  return (
    <div className="h-[85vh] overflow-y-auto">
      {/* TODO
        가격별, 타입별로 검색할 수 있는 filter도 있으면 좋을 것 같아
      */}
      <div className="grid grid-cols-4 m-4">
        {stamps?.map((stamp, index) => (
          <MarketStamp
            key={`${stamp.id} ${index}`}
            stamp={stamp}
            selectStamp={onSelectStamp}
          />
        ))}
      </div>
      {showModal && (
        <DownloadModal stamp={selectedStamp} closeModal={closeModal} />
      )}
    </div>
  );
};

export default memo(Sale);
