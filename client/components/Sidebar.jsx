import Link from "next/link";
import React from "react";

export default function Sidebar() {
  return (
    <div className="fixed top-0 z-10 left-0 h-screen w-96 border-r">
      <div className="h-20 px-5 flex items-center border-b w-full">
        <h1 className="text-2xl font-bold">Invoice Maker</h1>
      </div>
      <ul className="flex flex-grow p-5 flex-col gap-4 mt-4">
        <li>
          <Link href={"/"}>
            <p className="p-4 rounded-md bg-accent border text-xl">Dashboard</p>
          </Link>
        </li>

        <li>
          <Link href={"/create-invoice"}>
            <p className="p-4 rounded-md bg-accent border text-xl">
              Create Invoice
            </p>
          </Link>
        </li>
      </ul>
    </div>
  );
}
