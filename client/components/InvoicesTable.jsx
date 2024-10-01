"use client";
import React, { useMemo } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Cookies from "js-cookie";

export default function InvoicesTable({ data }) {
  const router = useRouter();
  const [currentPage, setCurrentPage] = React.useState(1);
  const invoices = useMemo(() => {
    return data.slice((currentPage - 1) * 10, currentPage * 10);
  }, [data, currentPage]);
  const totalPages = Math.ceil(data.length / 10);
  const handleCSV = async () => {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/invoice/csv`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${Cookies.get("accessToken")}`,
        },
      }
    );
    const data = await res.blob();
    const url = window.URL.createObjectURL(data);
    router.push(url);
  };
  return (
    <div className="mt-5">
      <div className="flex justify-between items-center mb-5">
        <h2 className="text-xl font-bold">Invoices</h2>
        <Button onClick={handleCSV}>Export to CSV</Button>
      </div>
      <Table>
        <TableCaption>A list of your recent invoices.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[50px]">Index</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>City</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Amount</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {invoices.map((invoice, index) => (
            <TableRow key={index}>
              <TableCell className="font-medium">{index + 1}</TableCell>
              <TableCell>
                <Link href={"/invoice/" + invoice._id}>
                  {invoice.customer.name}
                </Link>
              </TableCell>
              <TableCell className="whitespace-nowrap">
                {invoice.customer.phone}
              </TableCell>
              <TableCell>{invoice.customer.address.city}</TableCell>
              <TableCell>
                {invoice.status === "Paid" && (
                  <span className=" bg-green-500 text-black px-2 py-1 rounded-md">
                    Paid
                  </span>
                )}
                {invoice.status === "Overdue" && (
                  <span className=" bg-red-500 text-black px-2 py-1 rounded-md">
                    Unpaid
                  </span>
                )}
                {invoice.status === "Pending" && (
                  <span className=" bg-yellow-500 text-black px-2 py-1 rounded-md">
                    Pending
                  </span>
                )}
              </TableCell>
              {/* {invoice.status}</TableCell> */}
              <TableCell className="text-right">
                {parseFloat(invoice.totalAmount).toFixed(2)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className="flex items-center justify-end space-x-2 py-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setCurrentPage((page) => Math.max(page - 1, 1))}
          disabled={currentPage === 1}
        >
          Previous
        </Button>
        <div className="text-sm">
          Page {currentPage} of {totalPages}
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() =>
            setCurrentPage((page) => Math.min(page + 1, totalPages))
          }
          disabled={currentPage === totalPages}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
