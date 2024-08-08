import { request } from '@/api/request';
import { notFound } from 'next/navigation';
import * as v from 'valibot';

const ENDPOINT = '/order/{orderId}';
const ENDPOINT_PLURAL = '/orders';

const OrderInListSchema = v.object({
  id: v.string(),
  customer_name: v.string(),
  total_products: v.number(),
  total_price: v.number(),
  created_at: v.pipe(v.string(), v.transform((v) => new Date(v))),
});

const OrderDetailsSchema = v.object({
  order_id: v.string(),
  customer_name: v.string(),
  products: v.array(
    v.object({
      quantity: v.number(),
      product: v.object({
        id: v.number(),
        name: v.string(),
        price: v.number(),
      }),
    }),
  ),
});

const OrderCreateSchema = v.object({
  customer_name: v.string(),
  products: v.array(
    v.object({
      product_id: v.number(),
      quantity: v.number(),
    }),
  ),
});

interface OrderListOptions {
  page?: number;
  limit?: number;
  customer_name?: string;
  order_date?: string;
}

export const list = async (options?: OrderListOptions) => {
  const { data } = await request.get<{
    page: number;
    limit: number;
    total: number;
    list: any[];
  }>(ENDPOINT_PLURAL, { params: options });

  return {
    ...data,
    list: data.list.map((order) => v.parse(OrderInListSchema, order)),
  };
};

export const get = async (id: string) => {
  const { data } = await request.get(ENDPOINT.replace('{orderId}', id));
  if (!data) return notFound();
  return v.parse(OrderDetailsSchema, data);
};

export const create = async (data: v.InferInput<typeof OrderCreateSchema>) => {
  const payload = v.parse(OrderCreateSchema, data);
  const { data: { success: status } } = await request.post<{ success: boolean }>(ENDPOINT.replace('{orderId}', ''), payload);

  if (!status) {
    throw new Error('Failed to create order');
  }
};

export const update = async (id: string, data: v.InferInput<typeof OrderCreateSchema>) => {
  const payload = v.parse(OrderCreateSchema, data);
  const { data: { success: status } } = await request.put<{ success: boolean }>(ENDPOINT.replace('{orderId}', id), payload);

  if (!status) {
    throw new Error('Failed to edit order');
  }
};

export const destroy = async (id: string) => {
  const { data: { success: status } } = await request.delete<{ success: boolean }>(ENDPOINT.replace('{orderId}', id));

  if (!status) {
    throw new Error('Failed to delete order');
  }
};