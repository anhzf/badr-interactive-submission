import { orderApi } from '@/api';
import OrderForm from '@/components/order-form';

export default async function OrderEditPage({ params }: { params: { orderId: string } }) {
  const order = await orderApi.get(params.orderId);

  const action = async (data: any) => {
    'use server';
    throw new Error('Not implemented');
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