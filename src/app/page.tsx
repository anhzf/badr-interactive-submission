'use client';

import { useQuery } from '@tanstack/react-query';
import * as api from '@/api';

export default function Home() {
  const { data } = useQuery({ queryKey: ['products'], queryFn: api.product.list });

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <pre className="whitespace-pre">{JSON.stringify(data, null, 2)}</pre>
    </main>
  );
}
