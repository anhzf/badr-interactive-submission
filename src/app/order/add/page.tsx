import OrderForm from '@/components/order-form';

export default function OrderAddPage() {
  const action = async () => {
    'use server';
    throw new Error("Not implemented");
  };

  return (
    <section className="self-stretch flex flex-col p-2">
      <OrderForm action={action} />
    </section>
  );
}