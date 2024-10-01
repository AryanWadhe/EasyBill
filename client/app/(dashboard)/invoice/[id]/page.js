import React from "react";
async function fetchData(id) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/invoice/${id}`,
    {
      method: "GET",
    }
  );
  const data = await res.json();
  return data;
}
export default async function Invioce({ params }) {
  const data = await fetchData(params.id);
  const invoice = data?.data;
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "INR",
    }).format(amount);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };
  if (!data?.success) {
    return (
      <div className="w-full h-screen flex justify-center items-center">
        <p>No invoice found</p>
      </div>
    );
  }
  return (
    <div className="max-w-3xl md:mx-auto p-8 shadow-lg rounded-lg border mt-5 mx-4 ">
      <h1 className="text-3xl font-bold mb-8 text-center">Invoice</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <div>
          <h2 className="text-xl font-semibold mb-2">From:</h2>
          <p>{invoice.business.name}</p>
          <p>{invoice.business.address.street}</p>
          <p>
            {invoice.business.address.city}, {invoice.business.address.state}{" "}
            {invoice.business.address.zipCode}
          </p>
          <p>Phone: {invoice.business.phoneNumber}</p>
          <p>Email: {invoice.business.email}</p>
          <p>Tax ID: {invoice.business.taxId}</p>
        </div>
        <div>
          <h2 className="text-xl font-semibold mb-2">To:</h2>
          <p>{invoice.customer.name}</p>
          <p>{invoice.customer.address.street}</p>
          <p>
            {invoice.customer.address.city}, {invoice.customer.address.state}{" "}
            {invoice.customer.address.zipCode}
          </p>
          <p>Phone: {invoice.customer.phone}</p>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <div>
          <p>
            <strong>Invoice Date:</strong> {formatDate(invoice.dateIssued)}
          </p>
          <p>
            <strong>Due Date:</strong> {formatDate(invoice.dueDate)}
          </p>
        </div>
        <div>
          <p>
            <strong>Status:</strong>{" "}
            <span
              className={`font-semibold ${
                invoice.status === "Paid"
                  ? "text-green-600"
                  : invoice.status === "Overdue"
                  ? "text-red-600"
                  : "text-yellow-600"
              }`}
            >
              {invoice.status}
            </span>
          </p>
        </div>
      </div>
      <table className="w-full mb-8">
        <thead>
          <tr className="border-b-2 border-gray-300">
            <th className="text-left py-2">Description</th>
            <th className="text-right py-2">Quantity</th>
            <th className="text-right py-2">Price</th>
            <th className="text-right py-2">Total</th>
          </tr>
        </thead>
        <tbody>
          {invoice.items.map((item, index) => (
            <tr key={index} className="border-b border-gray-200">
              <td className="py-2">{item.description}</td>
              <td className="text-right py-2">{item.quantity}</td>
              <td className="text-right py-2">{formatCurrency(item.price)}</td>
              <td className="text-right py-2">{formatCurrency(item.total)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="text-right">
        <p>
          <strong>Subtotal:</strong> {formatCurrency(invoice.subtotal)}
        </p>
        <p>
          <strong>Tax:</strong> {formatCurrency(invoice.tax)}
        </p>
        <p className="text-xl font-semibold mt-2">
          <strong>Total:</strong> {formatCurrency(invoice.totalAmount)}
        </p>
      </div>
    </div>
  );
}
