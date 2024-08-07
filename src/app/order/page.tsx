'use client';

import { orderApi } from '@/api';
import { cn } from '@/utils/ui';
import { Icon } from '@iconify/react';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';

export default function OrderList() {
  const { data } = useQuery({
    queryKey: ['orders'],
    queryFn: () => orderApi.list(),
    placeholderData: { list: [], total: 0, page: 1, limit: 10 },
  });

  return (
    <main className="flex min-h-screen flex-col gap-2 p-4">
      {/* <pre className="whitespace-pre">{JSON.stringify(data, null, 2)}</pre> */}

      <div className="px-2 py-2">
        <h1 className="text-2xl text-center font-bold">
          Order Management
        </h1>
      </div>

      <div className="self-stretch flex flex-col p-2">
        <section className="flex w-full bg-white flex-col gap-4 p-4 rounded shadow">
          <div className="flex justify-between gap-4">
            <form className="flex gap-4">
              <div className="flex w-[28ch] flex-col">
                <label htmlFor="orderFilter/customerName">
                  Customer Name
                </label>
                <div className="group flex items-center gap-2 px-2 rounded border border-input has-[:focus]:ring ring-offset-2 transition-shadow">
                  <input
                    type="text"
                    name="customerName"
                    id="orderFilter/customerName"
                    placeholder="Input customer name"
                    className="shrink w-full px-2 py-2 border-none outline-none"
                  />
                  <Icon icon="material-symbols:search" className="shrink-0 size-6 text-primary" />
                </div>
              </div>

              <div className="flex w-[28ch] flex-col">
                <label htmlFor="orderFilter/createDate">
                  Create Date
                </label>
                <div className="group flex items-center gap-2 px-2 rounded border border-input has-[:focus]:ring ring-offset-2 transition-shadow">
                  <input
                    type="date"
                    name="createDate"
                    id="orderFilter/createDate"
                    className="shrink w-full px-2 py-2 border-none outline-none"
                  />
                  {/* <Icon icon="material-symbols:date-range-rounded" className="size-6 text-primary" /> */}
                </div>
              </div>
            </form>

            <div className="flex items-end gap-4">
              <Link href="/order/add" className="flex h-10 bg-secondary hover:bg-secondary/95 active:bg-secondary/90 text-on-secondary justify-center items-center px-4 py-2 rounded focus:ring ring-offset-2 transition-shadow">
                <span className="font-bold">
                  Add New Order
                </span>
              </Link>
            </div>
          </div>

          <table>
            <thead>
              <tr className="border">
                <th className="h-[3.75rem] text-primary text-left font-bold px-4 py-1">
                  Order Id
                </th>
                <th className="h-[3.75rem] text-primary text-left font-bold px-4 py-1">
                  Customer
                </th>
                <th className="h-[3.75rem] text-primary text-left font-bold px-4 py-1">
                  Total Products
                </th>
                <th className="h-[3.75rem] text-primary text-left font-bold px-4 py-1">
                  Total Price
                </th>
                <th className="h-[3.75rem] text-primary text-left font-bold px-4 py-1">
                  Order Date
                </th>
                <th className="h-[3.75rem] text-primary text-left font-bold px-4 py-1">
                  Action
                </th>
              </tr>
            </thead>

            <tbody>
              {data?.list.map((order) => (
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
                    >
                      <Icon icon="material-symbols:delete-outline-rounded" className="shrink-0 text-error" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="flex justify-between items-center gap-4">
            <form className="flex items-center gap-2">
              <span>Show</span>
              <select
                name="perPage"
                id="paginate/perPage"
                className="h-10 border border-primary rounded px-2 py-1"
              >
                {[10, 25, 50, 100].map((perPage) => (
                  <option key={perPage} value={perPage}>
                    {perPage}
                  </option>
                ))}
              </select>
              <span>per page of {data?.total} results</span>
            </form>

            <div className="flex border border-primary divide-x divide-primary rounded">
              <button
                type="button"
                className="w-16 h-10 flex justify-center items-center hover:bg-primary/5 active:bg-primary/10 text-primary focus:rounded focus:ring ring-offset-2 transition"
              >
                <Icon icon="material-symbols:chevron-left" className="shrink-0" />
              </button>
              {[1, 2, 3, 4, 5, '...', 50].map((page) => (
                <button
                  key={page}
                  type="button"
                  className={cn(
                    'size-10 flex justify-center items-center hover:bg-primary/5 active:bg-primary/10 text-primary focus:rounded focus:ring ring-offset-2 transition',
                    { 'bg-primary hover:bg-primary/95 active:bg-primary/90 text-white': page === data?.page },
                  )}
                >
                  {page}
                </button>
              ))}
              <button
                type="button"
                className="w-16 h-10 flex justify-center items-center hover:bg-primary/5 active:bg-primary/10 text-primary focus:rounded focus:ring ring-offset-2 transition"
              >
                <Icon icon="material-symbols:chevron-right" className="shrink-0" />
              </button>
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
