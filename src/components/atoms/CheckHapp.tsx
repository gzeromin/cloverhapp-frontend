'use client';
import cls from 'classnames';
import { observer } from 'mobx-react-lite';

interface CheckHappProps {
  labelName?: string;
  labelClassName?: string;
  error?: string;
  marginBottom?: string;
  className?: string;
  inputClassName?: string;
  disable?: boolean;
  checked?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  testId?: string;
}

const CheckHapp: React.FC<CheckHappProps> = ({
  labelName = '',
  labelClassName,
  error,
  marginBottom = 'mb-3',
  className,
  inputClassName,
  disable = false,
  checked,
  onChange,
  testId,
}) => {
  return (
    <div
      className={cls(
        error ? 'mb-1' : marginBottom,
        'items-center',
        className,
      )}
    >
      {labelName && (
        <label className={cls(
          'text-sm text-gray text-nowrap',
          labelClassName
        )}>
          {labelName}
        </label>
      )}
      <div className={cls('grow')}>
        <input
          type="checkbox"
          className={cls(
            'w-full p-2 focus:bg-white focus:outline-none rounded',
            { 'border-red-500': error },
            'scale-150',
            inputClassName,
          )}
          checked={checked}
          disabled={disable}
          onChange={onChange}
          test-id={testId}
        />
        {error && (
          <div className="mt-2 font-light text-red-500 text-xs">⚠ {error}</div>
        )}
      </div>
    </div>
  );
};

export default observer(CheckHapp);
