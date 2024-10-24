"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { registerSchema } from "@/schemas/zodSchema";
import { Progress } from "@/components/ui/progress";
import { PasswordInput } from "@/components/ui/password-input";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Link from "next/link";
export default function Register() {
  const router = useRouter();
  const form = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      phoneNumber: "",
      street: "",
      city: "",
      state: "",
      zipCode: "",
      taxId: "",
      password: "",
      confirmPassword: "",
    },
  });
  const [step, setStep] = useState(1);
  async function onSubmit(values) {
    try {
      delete values.confirmPassword;
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/register`,
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
      toast.success(data.message);
      router.push("/login");
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    }
  }
  return (
    <div className="border rounded-lg bg-card w-full max-w-xl mx-5 overflow-hidden">
      <Progress value={(step / 3) * 100} className="h-1" />
      <div className="py-4 md:px-10 px-5">
        <h1 className="text-3xl font-bold text-center mt-5">Register</h1>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {step === 1 && (
              <>
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="ml-2">Name</FormLabel>
                      <FormControl>
                        <Input
                          className="h-14"
                          required
                          placeholder="Business Name"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="ml-2">Email</FormLabel>
                      <FormControl>
                        <Input
                          className="h-14"
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
                  control={form.control}
                  name="phoneNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="ml-2">Phone</FormLabel>
                      <FormControl>
                        <Input
                          className="h-14"
                          required
                          placeholder="Phone"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="taxId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="ml-2">TaxID</FormLabel>
                      <FormControl>
                        <Input
                          className="h-14"
                          required
                          placeholder="TaxID"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}
            {step === 2 && (
              <>
                <FormField
                  control={form.control}
                  name="street"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="ml-2">Street</FormLabel>
                      <FormControl>
                        <Input
                          className="h-14"
                          required
                          placeholder="Street"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="ml-2">City</FormLabel>
                      <FormControl>
                        <Input
                          className="h-14"
                          required
                          placeholder="City"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="state"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="ml-2">State</FormLabel>
                      <FormControl>
                        <Input
                          className="h-14"
                          required
                          placeholder="State"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="zipCode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="ml-2">Pincode</FormLabel>
                      <FormControl>
                        <Input
                          className="h-14"
                          required
                          placeholder="Pincode"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}
            {step == 3 && (
              <>
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="ml-2">Password</FormLabel>
                      <FormControl>
                        <PasswordInput
                          className="h-14"
                          placeholder="Password"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="ml-2">Confirm Password</FormLabel>
                      <FormControl>
                        <PasswordInput
                          className="h-14"
                          placeholder="Confirm Password"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}
            <div className="flex items-center mt-5">
              {step !== 1 && (
                <Button
                  type="button"
                  onClick={() => setStep((prev) => prev - 1)}
                  className="rounded-full px-10 bg-muted"
                  variant="outline"
                >
                  Prev
                </Button>
              )}
              {step !== 3 && (
                <Button
                  type="button"
                  onClick={() => setStep((prev) => prev + 1)}
                  className="rounded-full text-black px-10  ml-auto bg-primary"
                  disabled={step === 3}
                  variant="outline"
                >
                  Next
                </Button>
              )}
              {step === 3 && (
                <Button
                  className="rounded-full text-black px-10  ml-auto bg-primary"
                  type="submit"
                >
                  Register
                </Button>
              )}
            </div>
          </form>
        </Form>
        <p className="text-center mt-4">
          Already have an account?{" "}
          <Link href="/login" className="text-blue-500">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
