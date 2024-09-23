'use client';
import cls from 'classnames';
import { observer } from 'mobx-react-lite';

interface InputHappProps {
  type?: string;
  labelName?: string;
  placeholder?: string;
  error?: string;
  border?: boolean;
  marginBottom?: string;
  className?: string;
  inputClassName?: string;
  disable?: boolean;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  testId?: string;
  min?: string;
  max?: string;
}

const InputHapp: React.FC<InputHappProps> = ({
  type = 'text',
  labelName = '',
  placeholder = '',
  error,
  border = true,
  marginBottom = 'mb-3',
  className,
  inputClassName,
  disable = false,
  value = '',
  onChange,
  testId,
  min,
  max,
}) => {
  return (
    <div
      className={`${error ? 'mb-1' : marginBottom} ${className}`}
    >
      {labelName && (
        <label className="text-nowrap font-extralight text-sm mr-2 mb-1">
          {labelName}
        </label>
      )}
      <input
        type={type}
        min={min}
        max={max}
        style={{ minWidth: 200 }}
        className={cls(
          'w-full p-2 focus:bg-white focus:outline-none rounded',
          { 'border-red-500': error },
          { 'text-gray-400': type === 'datetime-local' },
          {
            'transition duration-200 border border-gray-400 bg-gray-50 hover:bg-white focus:border-happ-focus focus:ring-happ-focus focus:ring-4':
              border,
          },
          inputClassName,
        )}
        placeholder={placeholder ? placeholder : labelName}
        value={value}
        disabled={disable}
        onChange={onChange}
        test-id={testId}
      />
      {error && (
        <div className="mt-2 font-light text-red-500 text-xs">⚠ {error}</div>
      )}
    </div>
  );
};

export default observer(InputHapp);
