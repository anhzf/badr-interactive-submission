'use client';

import { getQueryClient } from '@/query-client';
import { cn } from '@/utils/ui';
import { Icon } from '@iconify/react';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { ReactNode } from 'react';

const MENUS = [
  {
    title: 'Order Management',
    href: '/',
    icon: 'material-symbols:assignment',
  },
];

export default function AppLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const queryClient = getQueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen flex flex-col">
        <header className="sticky z-10 top-0 flex h-16 bg-white justify-between items-center gap-4 px-4 py-2 shadow-[0px_4px_4px_0px_#052A4914]">
          <Link href="/" className="inline-flex hover:bg-black/5 focus:bg-black/10 items-center gap-1 px-2.5 py-1 rounded focus:ring ring-offset-2 transition-shadow">
            <div className="size-2 bg-[#FF7B00] rounded-full" />
            <div className="text-base text-primary font-bold">
              My Brand
            </div>
          </Link>

          <button type="button" className="inline-flex hover:bg-black/5 focus:bg-black/10 items-center gap-2 px-2.5 py-1 rounded focus:ring ring-offset-2 transition-shadow">
            <div className="size-8 inline-flex bg-[linear-gradient(135deg,#72CBEE_0%,#1BA8DF_100%)] justify-center items-center rounded-full">
              <span className="text-white">CR</span>
            </div>

            <span>Cooper Rosser</span>

            <Icon icon="material-symbols:keyboard-arrow-down-rounded" className="size-[1.5em] text-muted" />
          </button>
        </header>

        <div className="flex max-h-full">
          <nav className="sticky top-16 bottom-0 w-60 h-[calc(100vh-theme(size.16))] flex bg-primary text-on-primary flex-col">
            <ul className="flex flex-col py-6">
              {MENUS.map((menu) => (
                <li key={menu.href}>
                  <Link href={menu.href} className={cn(
                    'flex h-10 items-center gap-2 px-4 py-2 hover:bg-white/5 focus:bg-black/10',
                    { 'bg-primary-variant border-l-2 border-white': pathname.startsWith(menu.href) },
                  )}>
                    <Icon icon={menu.icon} className="size-6" />
                    <span className="font-medium">
                      {menu.title}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="grow max-h-full bg-background">
            {children}
          </div>
        </div>
      </div>
      <ReactQueryDevtools />
    </QueryClientProvider>
  );
}