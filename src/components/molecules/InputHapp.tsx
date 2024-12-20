'use client';
import cls from 'classnames';
import { observer } from 'mobx-react-lite';
import LabelHapp from '../atoms/LabelHapp';
import ErrorMessageHapp from '../atoms/ErrorMessageHapp';

interface InputHappProps {
  id: string;
  type?: string;
  labelName?: string;
  labelClassName?: string;
  placeholder?: string;
  error?: string;
  border?: boolean;
  className?: string;
  inputClassName?: string;
  disable?: boolean;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  min?: string;
  max?: string;
  grow?: boolean;
  step?: string;
  marginBottom?: string;
}

const InputHapp: React.FC<InputHappProps> = ({
  id,
  type = 'text',
  labelName = '',
  labelClassName,
  placeholder = '',
  error,
  border = true,
  className,
  inputClassName,
  disable = false,
  value = '',
  onChange,
  min,
  max,
  grow = true,
  step,
  marginBottom = 'mb-6',
}) => {
  return (
    <div
      className={cls(
        'relative',
        marginBottom,
        className,
      )}
    >
      <LabelHapp
        htmlFor={id}
        className={labelClassName}
      >
        {labelName}
      </LabelHapp>
      <div className={cls({'grow': grow})}>
        <input
          id={id}
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
        />
        {error && (
          <div className="absolute">
            <ErrorMessageHapp>
              {error}
            </ErrorMessageHapp>
          </div>
        )}
      </div>
    </div>
  );
};

export default observer(InputHapp);
