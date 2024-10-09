"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "./ui/separator";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "./ui/calendar";
import { cn } from "@/lib/utils";
import { Trash } from "lucide-react";
import { invoiceSchema } from "@/schemas/zodSchema";
import { toast } from "sonner";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";

export default function InvoiceForm() {
  const form = useForm({
    resolver: zodResolver(invoiceSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      street: "",
      city: "",
      state: "",
      zipCode: "",
      items: [{ description: "", quantity: 0, price: 0 }],
      dueDate: new Date(),
      status: "Pending",
    },
  });

  const { fields, append, remove } = useFieldArray({
    name: "items",
    control: form.control,
  });
const router = useRouter();
  const routing = ()=>{
    router.push("/")
  }
// const router = useRouter();
//   const routing = ()=>{
//     router.push("/")
//   }

  async function generateRandomData() {
    try {
      const fields = [
        "person.fullName",
        "phone.number",
        "location.street",
        "location.city",
        "location.state",
        "location.zipCode",
        "commerce.price",
        "commerce.product",
        "date.future",
        "internet.email",
      ];
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/data/random`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            fields,
          }),
        }
      );
      const data = await res.json();
      form.setValue("name", data?.data[0]["person.fullName"]);
      form.setValue("phone", data?.data[0]["phone.number"]);
      form.setValue("street", data?.data[0]["location.street"]);
      form.setValue("city", data?.data[0]["location.city"]);
      form.setValue("state", data?.data[0]["location.state"]);
      form.setValue("zipCode", data?.data[0]["location.zipCode"]);
      form.setValue("dueDate", new Date(data?.data[0]["date.future"]));
      form.setValue("email", data?.data[0]["internet.email"]);
      form.setValue("items", [
        {
          description: data?.data[0]["commerce.product"],
          quantity: Math.floor(Math.random() * 10),
          price: parseFloat(data?.data[0]["commerce.price"]),
        },
      ]);
    } catch (error) {
      console.log(error);
    }
  }

  async function onSubmit(values) {
    try {
      console.log(values);
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/invoice/create`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: values.name,
            email: values.email,
            phone: values.phone,
            street: values.street,
            city: values.city,
            state: values.state,
            zipCode: values.zipCode,
            items: values.items,
            dueDate: "2024-10-15T00:00:00.000Z",
            status: values.status,
          }),
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${Cookies.get("accessToken")}`,
          },
        }
      );
      const data = await res.blob();
      if (data) {
        form.reset();
        const url = URL.createObjectURL(data);
        window.open(url);
      }
      if (!data) {
        toast.error("Something went wrong");
      }
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Customer Name</FormLabel>
              <FormControl>
                <Input placeholder="John Doe" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Customer Phone</FormLabel>
              <FormControl>
                <Input placeholder="123-456-7890" {...field} />
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
              <FormLabel>Customer Email</FormLabel>
              <FormControl>
                <Input placeholder="john@example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Separator />
        <div className="flex gap-4">
          <FormField
            control={form.control}
            name="street"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Street</FormLabel>
                <FormControl>
                  <Input placeholder="123 Main St" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="city"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>City</FormLabel>
                <FormControl>
                  <Input placeholder="Anytown" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="flex gap-4">
          <FormField
            control={form.control}
            name="state"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>State</FormLabel>
                <FormControl>
                  <Input placeholder="CA" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="zipCode"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Zip Code</FormLabel>
                <FormControl>
                  <Input placeholder="12345" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <Separator />
        <div>
          <h3 className="text-lg font-medium">Items</h3>
          {fields.map((field, index) => (
            <div
              key={field.id}
              className="w-full flex justify-between items-center"
            >
              <div className="w-[calc(100%-2rem)] grid grid-cols-4 gap-2">
                <FormField
                  control={form.control}
                  name={`items.${index}.description`}
                  render={({ field }) => (
                    <FormItem className="col-span-2">
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`items.${index}.quantity`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Quantity</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          {...field}
                          onChange={(e) =>
                            field.onChange(
                              e.target.value ? parseInt(e.target.value) : ""
                            )
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`items.${index}.price`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Price</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          {...field}
                          onChange={(e) =>
                            field.onChange(
                              e.target.value ? parseFloat(e.target.value) : ""
                            )
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <Trash
                onClick={() => remove(index)}
                className="hover:cursor-pointer mt-6 hover:text-red-500"
              />
            </div>
          ))}
          <Button
            type="button"
            className="mt-2"
            variant="outline"
            onClick={() => append({ description: "", quantity: 0, price: 0 })}
          >
            Add Item
          </Button>
        </div>
        <FormField
          control={form.control}
          name="dueDate"
          render={({ field }) => (
            <FormItem className="flex flex-col w-full">
              <FormLabel>Due Date</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value ? (
                        format(field.value, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={(date) => date < new Date()}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Status</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a status" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="Pending">Pending</SelectItem>
                  <SelectItem value="Paid">Paid</SelectItem>
                  <SelectItem value="Overdue">Overdue</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* <div className="flex items-center justify-center">
          <Button className="text-xl rounded-md h-14 px-10" type="submit">
            Submit
          </Button>
        </div> */}
        <div className="flex justify-between items-center mt-5">
          <Button
            type="button"
            variant="outline"
            className="rounded-full text-xl bg-muted px-6"
            onClick={generateRandomData}
          >
            Generate Random Data
          </Button>
          <Button className="rounded-full px-10 text-xl" type="submit" onClick={routing}>
          {/* <Button className="rounded-full px-10 text-xl" type="submit" onClick={routing}> */}
            Submit
          </Button>
        </div>
      </form>
    </Form>
  );
}
