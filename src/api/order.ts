import { request } from '@/api/request';
import * as v from 'valibot';

const ENDPOINT = '/orders';

const OrderInListSchema = v.object({
  id: v.string(),
  customer_name: v.string(),
  total_products: v.number(),
  total_price: v.number(),
  created_at: v.pipe(v.string(), v.transform((v) => new Date(v))),
});

const OrderDetailsSchema = v.object({
  id: v.string(),
  customer_name: v.string(),
  products: v.array(
    v.object({
      product_id: v.number(),
      product_name: v.string(),
      product_price: v.number(),
      quantity: v.number(),
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

export const list = async () => {
  const { data } = await request.get<{
    page: number;
    limit: number;
    total: number;
    list: any[];
  }>(ENDPOINT);

  return {
    ...data,
    list: data.list.map((order) => v.parse(OrderInListSchema, order)),
  };
};

export const get = async (id: string) => {
  const { data } = await request.get(`${ENDPOINT}/${id}`);
  return v.parse(OrderDetailsSchema, data);
};

export const create = async (data: v.InferInput<typeof OrderCreateSchema>) => {
  const payload = v.parse(OrderCreateSchema, data);
  const { data: { status } } = await request.post<{ status: boolean }>(ENDPOINT, payload);

  if (!status) {
    throw new Error('Failed to create order');
  }
};

export const edit = async (id: string, data: v.InferInput<typeof OrderCreateSchema>) => {
  const payload = v.parse(OrderCreateSchema, data);
  const { data: { status } } = await request.put<{ status: boolean }>(`${ENDPOINT}/${id}`, payload);

  if (!status) {
    throw new Error('Failed to edit order');
  }
};

export const destroy = async (id: string) => {
  const { data: { status } } = await request.delete<{ status: boolean }>(`${ENDPOINT}/${id}`);

  if (!status) {
    throw new Error('Failed to delete order');
  }
};