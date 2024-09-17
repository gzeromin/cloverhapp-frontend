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

type OptionType = {
  id?: string | number;
  value: string | number;
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
  testId?: string;
}

const SelectHapp: React.FC<SelectHappProps> = ({
  className,
  options,
  selected,
  onSelected,
  dark = false,
  border = false,
  labelName,
  testId,
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
  }, [selected]);

  return (
    <div
      className={cls('relative cursor-pointer', className)}
      onClick={() => setShow((prev) => !prev)}
      test-id={testId}
    >
      {labelName && (
        <label className="text-nowrap font-extralight text-sm mr-2 mb-1">
          {labelName}
        </label>
      )}
      <div
        className={cls(
          'flex items-center justify-between gap-1 px-2 rounded',
          {
            'transition duration-200 border border-gray-400 bg-gray-50 focus:bg-white hover:bg-white':
              border,
          },
          {
            'outline-none border-happ-focus ring-happ-focus ring-4':
              show && border,
          },
        )}
      >
        {selectedOption.image && (
          <Image
            src={selectedOption.image.src}
            alt={
              selectedOption.image.alt
                ? selectedOption.image.alt
                : selectedOption.image.src
            }
            width={selectedOption.image.width ?? defaultImageSize}
            height={selectedOption.image.height ?? defaultImageSize}
          ></Image>
        )}
        {selectedOption.icon}
        {selectedOption.labelLevel1 &&
          selectedOption.labelLevel2 &&
          Language.$t[selectedOption.labelLevel1][selectedOption.labelLevel2]}

        <div className="ml-1">
          <div
            className={cls(
              'h-0 border-white-transparent border-x-transparent border-[5px] border-b-0',
              { 'border-gray-500': dark },
            )}
          ></div>
        </div>
      </div>
      {show && (
        <ul className="absolute w-full right-0 shadow-sm p-1 bg-white border border-1 border-gray-transparent rounded-md delay-0 duration-150 transition-colors ease-in-out">
          {options.map((option) => (
            <li
              className="flex justify-between gap-1 hover:bg-gray-100 rounded px-2"
              key={option.id ?? option.value}
              onClick={() => onSelected(option.value)}
            >
              {option.image && (
                <Image
                  src={option.image.src}
                  alt={option.image.alt ? option.image.alt : option.image.src}
                  width={option.image.width ?? defaultImageSize}
                  height={option.image.height ?? defaultImageSize}
                ></Image>
              )}
              {option.icon}
              {option.labelLevel1 &&
                option.labelLevel2 &&
                Language.$t[option.labelLevel1][option.labelLevel2]}
              <div></div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default observer(SelectHapp);
