import { request } from '@/api/request';
import * as v from 'valibot';

const ENDPOINT = '/products';

const ProductInListSchema = v.object({
  id: v.number(),
  name: v.string(),
  price: v.number(),
});

export const list = async () => {
  const { data } = await request.get(ENDPOINT);
  return data.data.map((el: unknown) => v.parse(ProductInListSchema, el));
};