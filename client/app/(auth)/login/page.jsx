"use client";
import React from "react";
import { useForm } from "react-hook-form";
import { loginSchema } from "@/schemas/zodSchema";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { PasswordInput } from "@/components/ui/password-input";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import Link from "next/link";
import { Users } from "lucide-react";
import Cookies from "js-cookie";
export default function Login() {
  const router = useRouter();
  const form = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  async function onSubmit(values) {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(values),
        }
      );
      const data = await res.json();
      if (!data.success) {
        toast.error(data.message);
        return;
      }
      console.log(data)
      Cookies.set("accessToken", data.data.accessToken);
      toast.success(data.message);
      router.push("/");
    } catch (error) {
      console.log(error)
      toast.error("Something went wrong");
    }
  }
  return (
    <div className="border rounded-lg w-full max-w-3xl mx-5 p-10 bg-card grid md:grid-cols-2 grid-cols-1 md:gap-5 gap-10">
      <div className="w-full h-full">
        <Users size={40} />
        <h1 className="text-4xl font-bold mt-5">Login</h1>
        <p className="text-2xl font-medium text-muted-foreground mt-2">
          Login to your account
        </p>
      </div>
      <div className="w-full">
        <Form {...form}>
          <form
            noValidate
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-8"
          >
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="ml-2">Email</FormLabel>
                  <FormControl>
                    <Input
                      className="h-12"
                      required
                      placeholder="Email"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="ml-2">Password</FormLabel>
                  <FormControl>
                    <PasswordInput
                      className="h-12"
                      required
                      placeholder="Password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button className="w-full h-14 text-xl rounded-full" type="submit">
              Login
            </Button>
          </form>
        </Form>
        <p className="text-center mt-4">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="text-blue-500">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}
