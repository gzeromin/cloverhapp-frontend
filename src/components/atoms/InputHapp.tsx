'use client';
import cls from 'classnames';
import { observer } from 'mobx-react-lite';

interface InputHappProps {
  type?: string;
  labelName?: string;
  labelClassName?: string;
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
  grow?: boolean;
  step?: string;
}

const InputHapp: React.FC<InputHappProps> = ({
  type = 'text',
  labelName = '',
  labelClassName,
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
  grow = true,
  step,
}) => {
  return (
    <div
      className={cls(
        error ? 'mb-1' : marginBottom,
        className,
      )}
    >
      {labelName && (
        <label className={cls(
          'text-sm text-nowrap',
          labelClassName,
        )}>
          {labelName}
        </label>
      )}
      <div className={cls({'grow': grow})}>
        <input
          type={type}
          min={min}
          max={max}
          className={cls(
            'w-full p-2 focus:bg-white focus:outline-none rounded',
            { 'border-red-500': error },
            { 'text-gray-400': type === 'datetime-local' },
            {
              'transition duration-200 border border-gray-400 bg-gray-50 hover:bg-white focus:border-happ-focus focus:ring-happ-focus focus:ring-4':
                border,
            },
            { 
              'bg-gray-200 text-gray-400 cursor-not-allowed': disable,
            },
            inputClassName,
          )}
          placeholder={placeholder ? placeholder : labelName}
          value={value}
          disabled={disable}
          onChange={onChange}
          step={step}
          data-cy={testId}
        />
        {error && (
          <div className="mt-2 font-light text-red-500 text-xs">⚠ {error}</div>
        )}
      </div>
    </div>
  );
};

export default observer(InputHapp);
