import { cn } from '@/utils/ui';
import { cva, type VariantProps } from 'class-variance-authority';
import type { ComponentProps, JSXElementConstructor } from 'react';

const variants = cva('inline-flex h-10 justify-center items-center px-4 py-2 font-bold rounded focus:ring ring-offset-2 transition-shadow', {
  variants: {
    variant: {
      default: 'bg-primary hover:bg-primary/95 active:bg-primary/90 disabled:bg-primary/50 text-on-primary disabled:text-on-primary/50',
      secondary: 'bg-secondary hover:bg-secondary/95 active:bg-secondary/90 disabled:bg-secondary/50 text-on-secondary disabled:text-on-secondary/50',
      outline: 'bg-transparent hover:bg-primary/5 active:bg-primary/10 disabled:bg-muted border border-input text-primary disabled:text-primary/50',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

type ButtonProps<T extends keyof JSX.IntrinsicElements | JSXElementConstructor<any>> = VariantProps<typeof variants>
  & {
    as?: T;
  } & {
  [k in keyof ComponentProps<T>]: ComponentProps<T>[k]
};

export default function Button<T extends keyof JSX.IntrinsicElements | JSXElementConstructor<any>>(
  { as: Component = 'button' as T, variant, className, ...attrs }: ButtonProps<T>
) {
  return (
    <Component
      {...attrs as any}
      className={cn(variants({ variant, className }))}
    />
  );
}