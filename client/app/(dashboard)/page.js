import { cookies } from "next/headers";
import React from "react";

import InvoicesTable from "@/components/InvoicesTable";
import { Button } from "@/components/ui/button";
async function fetchData() {
  const cookie = cookies().get("accessToken");
  const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/analytics/`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${cookie.value}`,
    },
  });
  const data = await res.json();
  return data;
}
async function fetchInvoices() {
  const cookie = cookies().get("accessToken");
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/invoice/getAll`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${cookie.value}`,
      },
    }
  );
  const data = await res.json();
  return data.data;
}
export default async function page() {
  const data = await fetchData();
  const invoices = await fetchInvoices();
  return (
    <div className="p-5">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        <div className="bg-blue-400 shadow-md rounded-lg p-5 flex justify-between h-44 flex-col">
          <h2 className="text-2xl font-bold">Total Revenue</h2>
          <p className="text-3xl font-bold">₹{data?.data?.totalRevenue}</p>
        </div>
        <div className="bg-red-400 shadow-md rounded-lg p-5 flex justify-between h-44 flex-col">
          <h2 className="text-2xl font-bold">Total Invoices</h2>
          <p className="text-3xl font-bold">{data?.data?.totalInvoices}</p>
        </div>
        <div className="bg-amber-400 shadow-md rounded-lg p-5 flex justify-between h-44 flex-col">
          <h2 className="text-2xl font-bold">Total Items Sold</h2>
          <p className="text-3xl font-bold">{data?.data?.totalItemsSold}</p>
        </div>
      </div>
      <InvoicesTable data={invoices} />
    </div>
  );
}
