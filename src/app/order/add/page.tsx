'use client';

import { productApi } from '@/api';
import Button from '@/components/ui/button';
import Select from '@/components/ui/select';
import TextField from '@/components/ui/text-field';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { useMemo } from 'react';
import { useFieldArray, useForm, type SubmitHandler } from 'react-hook-form';

interface Inputs {
  customerName: string;
  products: {
    id: number;
    quantity: number;
  }[];
}

const currencyFormatter = new Intl.NumberFormat('id', { style: 'currency', currency: 'IDR' });

const PRODUCT_PLACEHOLDER = { id: '' as any, quantity: 1 };

export default function OrderAdd() {
  const { data: productOpts } = useQuery({
    queryKey: ['products'],
    queryFn: () => productApi.list(),
    placeholderData: [],
  });
  const { control, register, handleSubmit, watch } = useForm<Inputs>({
    values: {
      customerName: '',
      products: [PRODUCT_PLACEHOLDER],
    },
  });
  const { fields, append } = useFieldArray({
    control,
    name: 'products',
  });
  const products = watch('products');
  const productsPrices = products.map((product) => productOpts?.find((p) => p.id === product.id)?.price);
  const total = useMemo(
    () => productsPrices.reduce((acc, price, i) => acc! + ((price ?? 0) * (products[i]?.quantity)) ?? 0, 0),
    [products, productsPrices],
  );

  const onSubmit: SubmitHandler<Inputs> = (data) => {
    console.log(data);

  };

  return (
    <main className="flex min-h-screen flex-col gap-2 p-4">
      <div className="px-2 py-2">
        <h1 className="text-2xl text-center font-bold">
          Add New Order
        </h1>
      </div>

      <form className="self-stretch flex flex-col p-2" onSubmit={handleSubmit(onSubmit)}>
        <section className="flex container mx-auto bg-white flex-col gap-6 p-4 rounded shadow">
          <TextField
            label="Customer Name"
            id="newOrder/customerName"
            placeholder="Input customer name"
            required
            {...register('customerName', { required: true })}
            className="w-1/2"
          />

          <hr className="bg-input" />

          {fields.map((field, i) => (
            <div key={field.id} className="flex flex-col gap-4">
              <span className="text-muted-text">
                Product detail
              </span>

              <div className="flex gap-4">
                <Select
                  label="Product Name"
                  id="newOrder/productName"
                  placeholder="Select product name"
                  options={Object.fromEntries(productOpts?.map((product) => [product.id, product.name]) ?? [])}
                  required
                  {...register(`products.${i}.id`, { required: true, valueAsNumber: true })}
                  className="w-1/2"
                />
                <TextField
                  label="Price"
                  placeholder="You need to select product name"
                  value={productsPrices[i] && currencyFormatter.format(productsPrices[i])}
                  disabled
                  className="w-1/2"
                />
              </div>

              <div className="flex gap-4">
                <TextField
                  label="Quantity"
                  type="number"
                  id="newOrder/productQuantity"
                  placeholder="Input quantity"
                  required
                  {...register(`products.${i}.quantity`, { required: true, min: 1 })}
                  className="w-1/2"
                />
                <TextField
                  label="Total Product Price"
                  placeholder="You need to input quantity"
                  value={productsPrices[i] && products[i]?.quantity && currencyFormatter.format(productsPrices[i] * products[i]?.quantity)}
                  disabled
                  className="w-1/2"
                />
              </div>
            </div>
          ))}

          <div className="flex">
            <Button
              type="button"
              disabled={!products.at(-1)?.id}
              onClick={() => append(PRODUCT_PLACEHOLDER)}
            >
              Add More Product
            </Button>
          </div>

          <hr className="bg-input" />

          <div className="flex p-2">
            <TextField
              label="Total Order Price"
              placeholder="Total price"
              value={total ? currencyFormatter.format(total) : undefined}
              disabled
              className="w-1/2"
            />
          </div>

          <div className="flex gap-2">
            <Button type="submit" variant="secondary" className="min-w-32">
              Save
            </Button>
            <Button as={Link} href="/order" variant="outline" className="min-w-32">
              Back
            </Button>
          </div>
        </section>
      </form>
    </main>
  );
}