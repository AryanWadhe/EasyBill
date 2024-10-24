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
  const [step, setStep] = useState(1);

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
    shouldUnregister: false,
  });

  const {
    handleSubmit,
    formState: { errors },
    trigger,
  } = form;

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

  const handleNext = async () => {
    let currentStepFields = [];
    if (step === 1) {
      currentStepFields = ["name", "email", "phoneNumber", "taxId"];
    } else if (step === 2) {
      currentStepFields = ["street", "city", "state", "zipCode"];
    }

    const isStepValid = await trigger(currentStepFields);

    if (isStepValid) {
      setStep((prev) => prev + 1);
    } else {

      const errorFields = Object.keys(errors);
      if (
        ["name", "email", "phoneNumber", "taxId"].some((field) =>
          errorFields.includes(field)
        )
      ) {
        setStep(1);
      } else if (
        ["street", "city", "state", "zipCode"].some((field) =>
          errorFields.includes(field)
        )
      ) {
        setStep(2);
      }
    }
  };

  return (
    <div className="border rounded-lg bg-card w-full max-w-xl mx-5 overflow-hidden">
      <Progress value={(step / 3) * 100} className="h-1" />
      <div className="py-4 md:px-10 px-5">
        <h1 className="text-3xl font-bold text-center mt-5">Register</h1>
        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            {step === 1 && (
              <>
                {/* Step 1 Fields */}
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
                {/* Step 2 Fields */}
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
                {/* Step 3 Fields */}
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

            {/* Error Summary (Displayed only on the final step) */}
            {step === 3 && Object.keys(errors).length > 0 && (
              <div className="error-summary p-4 border rounded-md bg-red-100">
                <h2 className="text-lg font-semibold text-red-700 mb-2">
                  Please fix the following errors:
                </h2>
                <ul className="list-disc list-inside text-red-600">
                  {Object.entries(errors).map(([field, error]) => (
                    <li key={field}>{error.message}</li>
                  ))}
                </ul>
              </div>
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
                  onClick={handleNext}
                  className="rounded-full text-black px-10 ml-auto bg-primary"
                  variant="outline"
                >
                  Next
                </Button>
              )}
              {step === 3 && (
                <Button
                  className="rounded-full text-black px-10 ml-auto bg-primary"
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
