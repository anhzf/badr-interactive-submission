import type { ReactNode } from 'react';

export default function OrderAddLayout({ children }: { children: ReactNode }) {
  return (
    <main className="flex min-h-screen flex-col gap-2 p-4">
      <div className="px-2 py-2">
        <h1 className="text-2xl text-center font-bold">
          Add New Order
        </h1>
      </div>

      <div className="self-stretch flex flex-col p-2">
        {children}
      </div>
    </main>
  );
}