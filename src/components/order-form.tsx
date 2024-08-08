'use client';

import { productApi } from '@/api';
import { useToaster } from '@/components/toaster';
import Button from '@/components/ui/button';
import Select from '@/components/ui/select';
import TextField from '@/components/ui/text-field';
import { currencyFormatter } from '@/utils/format';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { useMemo, useTransition } from 'react';
import { useFieldArray, useForm, type SubmitHandler } from 'react-hook-form';

export interface OrderFormInputs {
  customerName: string;
  products: {
    id: number;
    quantity: number;
  }[];
}

interface OrderFormProps {
  value?: OrderFormInputs;
  action?: (data: OrderFormInputs) => void | Promise<void>;
}

const PRODUCT_PLACEHOLDER = { id: '' as any, quantity: 1 };

export default function OrderForm({ value, action }: OrderFormProps) {
  const [isPending, startTransition] = useTransition();

  const { data: productOpts, isFetching: isProductOptsLoading } = useQuery({
    queryKey: ['products'],
    queryFn: () => productApi.list(),
    placeholderData: [],
  });

  const toast = useToaster();

  const { control, register, handleSubmit, watch } = useForm<OrderFormInputs>({
    values: value ?? {
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

  const onFormSubmit: SubmitHandler<OrderFormInputs> = (data) => {
    startTransition(async () => {
      try {
        await Promise.resolve(action?.(data))
        toast({ message: 'Your data has been successfully saved.', type: 'success' });
      } catch (err) {
        console.error(err);
        toast({ message: String(err), type: 'error' });
      }
    });
  };

  return (
    <form className="flex container mx-auto bg-white flex-col gap-6 p-4 rounded shadow" onSubmit={handleSubmit(onFormSubmit)}>
      <TextField
        label="Customer Name"
        id="newOrder/customerName"
        placeholder="Input customer name"
        required
        {...register('customerName', { required: true, disabled: value?.customerName !== undefined })}
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
              disabled={isProductOptsLoading}
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
              {...register(`products.${i}.quantity`, { required: true, min: 1, valueAsNumber: true })}
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
        <Button type="submit" variant="secondary" disabled={isPending} className="min-w-32">
          Save
        </Button>
        <Button as={Link} href="/order" variant="outline" className="min-w-32">
          Back
        </Button>
      </div>
    </form>
  )
}