import { cn } from '@/utils/ui';
import { Icon } from '@iconify/react';
import { forwardRef, InputHTMLAttributes } from 'react';

interface TextFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  name?: string;
  id?: string;
  icon?: string;
}

export default forwardRef<HTMLInputElement, TextFieldProps>(function TextField({
  label,
  name,
  id,
  icon,
  className,
  required,
  ...inputProps
}, ref) {
  return (
    <fieldset className={cn('flex flex-col', className)}>
      <label htmlFor={id}>
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="flex has-[:disabled]:bg-muted items-center gap-2 px-2 rounded border border-input has-[:focus]:ring ring-offset-2 transition-shadow">
        <input
          {...inputProps}
          ref={ref}
          name={name}
          id={id}
          className="shrink w-full px-2 py-2 border-none outline-none bg-transparent placeholder:text-muted-text"
        />
        {icon && (
          <Icon icon={icon} className="shrink-0 size-6 text-primary" />
        )}
      </div>
    </fieldset>
  );
});
