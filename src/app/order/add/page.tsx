import { orderApi } from '@/api';
import OrderForm, { type OrderFormInputs } from '@/components/order-form';
import { redirect } from 'next/navigation';

export default function OrderAddPage() {
  const action = async (data: OrderFormInputs) => {
    'use server';

    await orderApi.create({
      customer_name: data.customerName,
      products: data.products.map((item) => ({
        product_id: item.id,
        quantity: item.quantity,
      })),
    });

    return redirect('/order');
  };

  return (
    <section className="self-stretch flex flex-col p-2">
      <OrderForm action={action} />
    </section>
  );
}