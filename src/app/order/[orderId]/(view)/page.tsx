import { orderApi } from '@/api';
import { currencyFormatter } from '@/utils/format';

export default async function OrderViewPage({ params }: { params: { orderId: string } }) {
  const data = await orderApi.get(params.orderId);
  const totalPrice = data.products.reduce((acc, item) => acc + item.product.price * item.quantity, 0);

  return (
    <section className="flex container mx-auto bg-white flex-col gap-4 p-4 rounded shadow">
      {Object.entries({
        'Order ID': data.order_id,
        'Customer Name': data.customer_name,
        'Total Order Price': currencyFormatter.format(totalPrice),
      }).map(([label, value]) => (
        <div key={label} className="flex flex-col">
          <div>
            {label}
          </div>
          <div className="text-lg text-primary font-bold">
            {value}
          </div>
        </div>
      ))}

      <hr className="bg-outline my-2" />

      <h2 className="text-muted-text">
        Product Detail
      </h2>

      <table>
        <thead>
          <tr>
            {['Product Name', 'Quantity', 'Price', 'Total Product Price'].map((col) => (
              <th key={col} className="text-primary text-left font-bold px-3 py-4">
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.products.map((item) => (
            <tr key={item.product.id}>
              <td className="px-3 py-4">
                {item.product.name}
              </td>
              <td className="px-3 py-4">
                {item.quantity}
              </td>
              <td className="px-3 py-4">
                {currencyFormatter.format(item.product.price)}
              </td>
              <td className="px-3 py-4">
                {currencyFormatter.format(item.product.price * item.quantity)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <hr className="bg-outline" />

      <div className="h-[10vh]" />
    </section>
  );
}