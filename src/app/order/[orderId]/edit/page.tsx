import { orderApi } from '@/api';
import OrderForm, { type OrderFormInputs } from '@/components/order-form';
import { redirect } from 'next/navigation';

export default async function OrderEditPage({ params }: { params: { orderId: string } }) {
  const order = await orderApi.get(params.orderId);

  const action = async (data: OrderFormInputs) => {
    'use server';
    console.log(data);

    await orderApi.update(params.orderId, {
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
      <OrderForm
        value={{
          customerName: order.customer_name,
          products: order.products.map((item) => ({
            id: item.product.id,
            quantity: item.quantity,
          })),
        }}
        action={action}
      />
    </section>
  );
}