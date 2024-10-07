'use client';
import cls from 'classnames';

import Image from 'next/image';
import { memo, useState } from 'react';
import {
  AiFillCloseSquare,
  AiOutlineLeft,
  AiOutlineRight,
} from 'react-icons/ai';

interface CarouselProps {
  className?: string;
  imageUrls: string[];
  deleteImageUrls?: () => void;
}

const CarouselHapp: React.FC<CarouselProps> = ({
  className,
  imageUrls,
  deleteImageUrls,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const goToPreviousSlide = () => {
    const index = (currentIndex - 1 + imageUrls.length) % imageUrls.length;
    setCurrentIndex(index);
  };

  const goToNextSlide = () => {
    const index = (currentIndex + 1) % imageUrls.length;
    setCurrentIndex(index);
  };
  const size = 150;
  return (
    <div className={cls('relative', className)}>
      <div className="overflow-hidden relative flex justify-center">
        {imageUrls.map(
          (imageUrl, index) =>
            index === currentIndex && (
              <div
                key={`Uploaded-imageUrl ${index}`}
                className="w-[200px] h-[200px] flex justify-center"
              >
                <div className="p-3">
                  <Image
                    src={imageUrl}
                    alt={`Uploaded Happ image ${index}`}
                    className="w-auto h-auto max-w-full object-contain aspect-square"
                    width={size}
                    height={size}
                  />
                </div>
                {imageUrls.length > 1 && (
                  <div className="absolute bottom-3 flex justify-center gap-2">
                    {[...Array(imageUrls.length)].map((v, i) => (
                      <div
                        key={`Carousel Btn ${i}`}
                        className={cls(
                          'w-2 h-2 rounded-full bg-gray-100 hover:bg-gray-300',
                          {
                            'w-3 bg-gray-200': i === currentIndex,
                          },
                        )}
                        onClick={() => setCurrentIndex(i)}
                      />
                    ))}
                  </div>
                )}
              </div>
            ),
        )}
      </div>
      {deleteImageUrls && (
        <button
          onClick={deleteImageUrls}
          className="absolute top-0 right-2 p-2 rounded font-extrabold text-green-600"
        >
          <AiFillCloseSquare size={24} />
        </button>
      )}
      {imageUrls.length > 1 && (
        <button
          onClick={goToPreviousSlide}
          className="absolute bottom-1/3 left-2 p-2 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-300"
        >
          <AiOutlineLeft size={24} />
        </button>
      )}

      {imageUrls.length > 1 && (
        <button
          onClick={goToNextSlide}
          className="absolute bottom-1/3 right-2 p-2 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-300"
        >
          <AiOutlineRight size={24} />
        </button>
      )}
    </div>
  );
};

export default memo(CarouselHapp);
