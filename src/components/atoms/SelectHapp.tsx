'use client';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { Language } from '@/mobx/index';
import { observer } from 'mobx-react-lite';
import cls from 'classnames';

type ImageType = {
  src: string;
  alt?: string;
  width?: number;
  height?: number;
};

export type OptionType = {
  id?: string | number;
  value: string | number;
  labelLevel0?: string;
  labelLevel1?: string;
  labelLevel2?: string;
  image?: ImageType;
  icon?: JSX.Element;
};

interface SelectHappProps {
  className?: string;
  options: OptionType[];
  selected: string | number;
  onSelected: (value: any) => void;
  dark?: boolean;
  border?: boolean;
  labelName?: string;
  labelClassName?: string;
  testId?: string;
  wide?: boolean;
  disable?: boolean;
  grow?: boolean;
}

const SelectHapp: React.FC<SelectHappProps> = ({
  className,
  options,
  selected,
  onSelected,
  dark = false,
  border = false,
  labelName,
  labelClassName,
  testId,
  wide = false,
  disable,
  grow = true,
}) => {
  const [selectedOption, setSelectedOption] = useState({
    value: '',
  } as OptionType);
  const [show, setShow] = useState(false);
  const defaultImageSize = '40';

  useEffect(() => {
    const option =
      options.find((option) => option.value == selected) ?? options[0];
    setSelectedOption(option);
  }, [selected, options]);

  const selectValue = (value: string | number) => {
    if (!disable) {
      onSelected(value);
      setShow(false);
    }
  };

  const handleShow = () => {
    if (!disable) {
      setShow(true);
    }
  };

  return (
    <div
      className={cls({
        'cursor-pointer': !disable,
        'bg-gray-200 text-gray-400 cursor-not-allowed': disable,
      }, 
      className
      )}
      data-cy={testId}
    >
      {labelName && (
        <label className={cls(
          'text-sm text-nowrap',
          labelClassName,
        )}>
          {labelName}
        </label>
      )}
      <div className={cls(
        'relative',
        {'grow': grow}
      )}>
        <div
          className={cls(
            'flex items-center justify-between gap-1 px-2 rounded',
            {
              'transition duration-200 border border-gray-400 bg-gray-50 focus:bg-white hover:bg-white':
                border,
            },
            {
              'outline-none border-happ-focus ring-happ-focus ring-4':
                show && border && !disable,
            },
            {
              'py-2': wide,
            }
          )}
          onClick={handleShow}
        >
          {selectedOption && selectedOption.image && (
            <Image
              src={selectedOption.image.src}
              alt={
                selectedOption.image.alt
                  ? selectedOption.image.alt
                  : selectedOption.image.src
              }
              priority
              width={selectedOption.image.width ?? defaultImageSize}
              height={selectedOption.image.height ?? defaultImageSize}
            />
          )}
          {selectedOption && selectedOption.icon}
          {selectedOption && selectedOption.labelLevel0 && selectedOption.labelLevel0}
          {selectedOption && selectedOption.labelLevel1 &&
            selectedOption.labelLevel2 &&
            Language.$t[selectedOption.labelLevel1][selectedOption.labelLevel2]}

          {/* Open Simbol */}
          <div className="ml-1">
            <div
              className={cls(
                'h-0 border-white-transparent border-x-transparent border-[5px] border-b-0',
                { 'border-gray-700': dark },
              )}
            ></div>
          </div>
        </div>
        {show && !disable && (
          <div className=''>
            {/* Background opacity */}
            <div
              className="fixed inset-0 w-full h-full z-40 cursor-default"
              onClick={() => setShow(false)}
            />
            <ul className={cls(
              'absolute w-full right-0 shadow-md p-1 z-50 max-h-[180px] overflow-y-auto',
              'bg-white border border-1 border-gray-transparent rounded-md',
              'delay-0 duration-150 transition-colors ease-in-out',
            )}>
              {options.map((option) => (
                <li
                  className={cls(
                    'relative px-1 flex gap-1 items-center justify-between',
                    'hover:bg-gray-100 rounded',
                    {'py-2': wide}
                  )}
                  key={option.id ?? option.value}
                  onClick={() => selectValue(option.value)}
                >
                  {option.image && (
                    <Image
                      src={option.image.src}
                      alt={option.image.alt ? option.image.alt : option.image.src}
                      width={option.image.width ?? defaultImageSize}
                      height={option.image.height ?? defaultImageSize}
                    />
                  )}
                  {option.icon}
                  {option.labelLevel0}
                  {option.labelLevel1 &&
                  option.labelLevel2 &&
                  Language.$t[option.labelLevel1][option.labelLevel2]}
                  {/* Empty Div For Layout */}
                  <div className="ml-1">
                    <div
                      className={cls(
                        'h-0 border-white border-x-transparent border-[5px] border-b-0',
                      )}
                    ></div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default observer(SelectHapp);
