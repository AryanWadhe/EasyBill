"use client";
import React from "react";
import ThemeToggle from "./ThemeToggle";
import Link from "next/link";
import { Button } from "./ui/button";
import Cookies from "js-cookie";

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 items-center w-full justify-between flex h-20 bg-background px-5 border-b">
      <Link href={"/"}>
        <p className="sm:text-2xl text-lg font-bold">QuickBill </p>{" "}
      </Link>
      <div className="flex items-center gap-5">
        <Link href={"/"}>
          <p className="hover:underline">Dashboard</p>
        </Link>
        <Link href={"/create-invoice"}>
          <p className="hover:underline">Create Invoice</p>
        </Link>
        <Button
          onClick={() => {
            Cookies.remove("accessToken");
            window.location.reload();
          }}
          variant="outline"
          className="text-sm"
        >
          Logout
        </Button>
        <ThemeToggle />
      </div>
    </nav>
  );
}
