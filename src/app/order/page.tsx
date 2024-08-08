'use client';

import { orderApi } from '@/api';
import { useLoadingOverlay } from '@/components/loading-overlay';
import { useToaster } from '@/components/toaster';
import Button from '@/components/ui/button';
import Select from '@/components/ui/select';
import TextField from '@/components/ui/text-field';
import { cn } from '@/utils/ui';
import { Icon } from '@iconify/react';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';

const PAGINATION_MAX_BUTTONS = 3;

interface PageProps {
  searchParams: Record<string, string>;
}

export default function OrderListPage({ searchParams }: PageProps) {
  const { data, isFetching: isLoading, refetch } = useQuery({
    queryKey: ['orders', searchParams],
    queryFn: () => orderApi.list(searchParams),
    placeholderData: { list: [], total: 0, page: 1, limit: 10 },
  });

  const toast = useToaster();
  const loading = useLoadingOverlay();

  const currentPage = data?.page ?? 1;
  const maxPage = Math.ceil((data?.total ?? 1) / (data?.limit ?? 10));
  const previousPage = Math.max(0, currentPage - 1);
  const nextPage = Math.min(maxPage, currentPage + 1);

  const onRemoveClick = async (orderId: string) => {
    const order = data?.list.find((el) => el.id === orderId);
    if (confirm(`Are you sure you want to delete the ${order?.customer_name} order?`)) {
      try {
        await loading(orderApi.destroy(orderId));
        refetch();
        toast({ message: `${order?.customer_name} order deleted`, type: 'success' });
      } catch (err) {
        toast({ message: String(err), type: 'error' });
      }
    }
  }

  return (
    <main className="flex min-h-screen flex-col gap-2 p-4">
      <div className="px-2 py-2">
        <h1 className="text-2xl text-center font-bold">
          Order Management
        </h1>
      </div>

      <div className="self-stretch flex flex-col p-2">
        <section className="flex container mx-auto bg-white flex-col gap-4 p-4 rounded shadow">
          <div className="flex justify-between gap-4">
            <form id="orderQuery" className="flex gap-4">
              <TextField
                label="Customer Name"
                name="customer_name"
                id="orderQuery/customer_name"
                defaultValue={searchParams.customer_name}
                placeholder="Input customer name"
                icon="material-symbols:search"
                className="w-[28ch]"
                onKeyDown={(e) => e.key === 'Enter' && (e.target as HTMLInputElement).form?.submit()}
              />

              <TextField
                label="Create Date"
                name="order_date"
                id="orderQuery/order_date"
                placeholder="Select date"
                icon="material-symbols:date-range-outline-rounded"
                defaultValue={searchParams.order_date}
                className="w-[28ch]"
                onKeyDown={(e) => e.key === 'Enter' && (e.target as HTMLInputElement).form?.submit()}
              />
            </form>

            <div className="flex items-end gap-4">
              <Button as={Link} href="/order/add" variant="secondary">
                Add New Order
              </Button>
            </div>
          </div>

          <table>
            <thead>
              <tr className="border">
                {[
                  'Order Id',
                  'Customer',
                  'Total Products',
                  'Total Price',
                  'Order Date',
                  'Action',
                ].map((col) => (
                  <th
                    key={col}
                    className="h-14 text-primary text-left font-bold px-4 py-1"
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {isLoading
                ? Array.from({ length: 5 }, (_, i) => (
                  <tr key={i} className="border">
                    <td colSpan={6} className="h-14 text-primary px-4 py-1 text-center">
                      Loading...
                    </td>
                  </tr>
                )) : data?.list.map((order) => (
                  <tr
                    key={order.id}
                    className="border"
                  >
                    <td className="h-14 text-primary px-4 py-1">
                      {order.id}
                    </td>
                    <td className="h-14 text-primary px-4 py-1">
                      {order.customer_name}
                    </td>
                    <td className="h-14 text-primary px-4 py-1">
                      {order.total_products}
                    </td>
                    <td className="h-14 text-primary px-4 py-1">
                      {order.total_price}
                    </td>
                    <td className="h-14 text-primary px-4 py-1">
                      {order.created_at.toLocaleString('id')}
                    </td>
                    <td className="h-14 flex items-center gap-2">
                      <Link
                        href={`/order/${order.id}/edit`}
                        className="size-14 flex hover:bg-secondary/5 active:bg-secondary/10 justify-center items-center focus:rounded focus:ring ring-offset-2 transition"
                      >
                        <Icon icon="material-symbols:edit" className="shrink-0 text-secondary" />
                      </Link>
                      <Link
                        href={`/order/${order.id}`}
                        className="size-14 flex hover:bg-secondary/5 active:bg-secondary/10 justify-center items-center focus:rounded focus:ring ring-offset-2 transition"
                      >
                        <Icon icon="material-symbols:list-alt-outline-rounded" className="shrink-0 text-secondary" />
                      </Link>
                      <button
                        type="button"
                        className="size-14 flex hover:bg-error/5 active:bg-error/10 justify-center items-center focus:rounded focus:ring ring-offset-2 transition"
                        onClick={() => onRemoveClick(order.id)}
                      >
                        <Icon icon="material-symbols:delete-outline-rounded" className="shrink-0 text-error" />
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>

          <div className="flex justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <span>Show</span>
              <Select
                name="limit"
                form="orderQuery"
                id="paginate/limit"
                options={{ 10: '10', 25: '25', 50: '50', 100: '100' }}
                defaultValue={searchParams.limit}
                onChange={(e) => e.target.form?.submit()}
              />
              <span>per page of {data?.total} results</span>
            </div>

            <div className="flex border border-primary divide-x divide-primary rounded overflow-hidden">
              <Link
                href={previousPage === 0 ? '' : { query: { ...searchParams, page: String(previousPage) } }}
                aria-disabled={previousPage === 0}
                className="w-16 h-10 flex justify-center items-center hover:bg-primary/5 active:bg-primary/10 aria-disabled:bg-gray-100 text-primary aria-disabled:text-gray-300 focus:rounded focus:ring ring-offset-2 transition aria-disabled:cursor-not-allowed"
              >
                <Icon icon="material-symbols:chevron-left" className="shrink-0" />
              </Link>

              <Link
                href={{ query: { ...searchParams, page: String(1) } }}
                className={cn(
                  'size-10 flex justify-center items-center hover:bg-primary/5 active:bg-primary/10 text-primary focus:rounded focus:ring ring-offset-2 transition aria-disabled:pointer-events-none',
                  { 'bg-primary hover:bg-primary/95 active:bg-primary/90 text-white': 1 === data?.page },
                )}
              >
                1
              </Link>

              {/* Show other paginations except the first and last, when the page is not available then skip */}
              {Array.from({ length: Math.min(PAGINATION_MAX_BUTTONS, maxPage) }, (_, i) => {
                const page = currentPage + i;
                return (page >= maxPage || page === 1)
                  ? null
                  : (
                    <Link
                      key={i}
                      href={{ query: { ...searchParams, page: String(page) } }}
                      className={cn(
                        'size-10 flex justify-center items-center hover:bg-primary/5 active:bg-primary/10 text-primary focus:rounded focus:ring ring-offset-2 transition aria-disabled:pointer-events-none',
                        { 'bg-primary hover:bg-primary/95 active:bg-primary/90 text-white': page === data?.page },
                      )}
                    >
                      {page}
                    </Link>
                  );
              })}

              <Link
                href={''}
                className={cn(
                  'size-10 flex justify-center items-center hover:bg-primary/5 active:bg-primary/10 text-primary focus:rounded focus:ring ring-offset-2 transition aria-disabled:pointer-events-none',
                  { 'bg-primary hover:bg-primary/95 active:bg-primary/90 text-white': maxPage === data?.page },
                )}
              >
                ...
              </Link>

              <Link
                href={{ query: { ...searchParams, page: String(maxPage) } }}
                className={cn(
                  'size-10 flex justify-center items-center hover:bg-primary/5 active:bg-primary/10 text-primary focus:rounded focus:ring ring-offset-2 transition aria-disabled:pointer-events-none',
                  { 'bg-primary hover:bg-primary/95 active:bg-primary/90 text-white': maxPage === data?.page },
                )}
              >
                {maxPage}
              </Link>

              <Link
                href={nextPage === maxPage ? '' : { query: { ...searchParams, page: String(nextPage) } }}
                aria-disabled={nextPage === maxPage}
                className="w-16 h-10 flex justify-center items-center hover:bg-primary/5 active:bg-primary/10 aria-disabled:bg-gray-100 text-primary aria-disabled:text-gray-300 focus:rounded focus:ring ring-offset-2 transition aria-disabled:cursor-not-allowed"
              >
                <Icon icon="material-symbols:chevron-right" className="shrink-0" />
              </Link>
            </div>
          </div>
        </section>
      </div>

      <div className="p-4 text-center text-outline">
        ©2021 Managed by PT. Bosnet Distribution Indonesia
      </div>
    </main>
  );
}
