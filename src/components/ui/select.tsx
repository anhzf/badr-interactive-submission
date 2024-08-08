import { cn } from '@/utils/ui';
import { Icon } from '@iconify/react';
import { forwardRef, type InputHTMLAttributes } from 'react';

interface SelectProps extends InputHTMLAttributes<HTMLSelectElement> {
  label?: string;
  name: string;
  options: Record<string, string>;
  placeholder?: string;
  icon?: string;
  required?: boolean;
}

export default forwardRef<HTMLSelectElement, SelectProps>(function Select({
  label,
  name,
  id,
  options,
  placeholder,
  icon,
  required,
  className,
  ...inputProps
}, ref) {
  return (
    <fieldset className={cn('flex flex-col', className)}>
      {label && (
        <label htmlFor={id}>
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <div className="flex has-[select:disabled]:bg-muted items-center gap-2 px-2 rounded border border-input has-[:focus]:ring ring-offset-2 transition-shadow">
        <select
          {...inputProps}
          ref={ref}
          name={name}
          id={id}
          className="shrink w-full px-2 py-2 border-none outline-none bg-transparent placeholder:text-muted-text"
        >
          {placeholder && (
            <option value="" disabled hidden>
              {placeholder}
            </option>
          )}
          {Object.entries(options).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
        {icon && (
          <Icon icon={icon} className="shrink-0 size-6 text-primary" />
        )}
      </div>
    </fieldset>
  )
});