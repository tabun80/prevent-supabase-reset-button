import clsx from 'clsx';
import { type HTMLAttributes, forwardRef, useId } from 'react';

type ToggleProps = Omit<HTMLAttributes<HTMLInputElement>, 'id' | 'type'>;

export const Toggle: React.FC<ToggleProps> = forwardRef<
  HTMLInputElement,
  Omit<ToggleProps, 'ref'>
>(({ ...props }: ToggleProps, ref) => {
  const id = useId();
  return (
    <div className="px-1">
      <input
        id={id}
        className="peer absolute -z-50 opacity-0 invisible"
        type="checkbox"
        {...props}
        ref={ref}
      />
      <label
        className={clsx(
          'flex items-center cursor-pointer select-none',
          '[--x:-0.1rem] [--bg-opacity:0.5] peer-checked:[--x:calc(100%+0.1rem)] peer-checked:[--bg-opacity:1]',
        )}
        htmlFor={id}
      >
        <div className="relative">
          <div className="w-10 h-5 bg-gray-300 rounded-full shadow-inner opacity-[--bg-opacity]" />
          <div
            className={clsx(
              'dot absolute w-6 h-6 bg-white rounded-full shadow-md top-[50%] transition',
              'translate-x-[--x] translate-y-[-50%]',
            )}
          />
        </div>
      </label>
    </div>
  );
});
