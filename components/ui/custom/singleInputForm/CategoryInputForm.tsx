import React from "react";

import { useForm, SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { revalidateExpenses } from "@/app/actions";
import { PlusCircle } from "lucide-react";
import { toast } from "sonner";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface CategoryForm {
  title: string;
}

const CategorySchema = z.object({
  title: z
    .string()
    .min(1, {
      message: "Không được để trống.",
    })
    .max(50, {
      message: "Chỉ nhập được tối đa 50 ký tự.",
    }),
});

const CategoryInputForm = () => {
  const form = useForm<z.infer<typeof CategorySchema>>({
    resolver: zodResolver(CategorySchema),
    defaultValues: {
      title: "",
    },
  });

  const onSubmit: SubmitHandler<CategoryForm> = async (
    data: z.infer<typeof CategorySchema>
  ) => {
    try {
      const response = await fetch("http://localhost:3000/api/category", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      toast.success(`Tạo phân loại thành công`);
      form.reset();
      revalidateExpenses();

      return response.json();
    } catch (error) {
      toast.error("Có lỗi xảy ra", { description: `${error}` });
    }
  };

  return (
    <Form {...form}>
      <form
        className="flex gap-2 w-full items-center px-2"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <FormField
          name="title"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormControl>
                <Input
                  className="w-full text-base focus:outline-none focus-visible:ring-0 focus-visible:border-2 focus-visible:ring-offset-0 focus-visible:border-qik-pri-400"
                  {...field}
                  placeholder="Nhập tên phân loại"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          variant="default"
          size="icon"
          className="shrink-0 bg-qik-pri-700 hover:bg-qik-pri-500"
        >
          <PlusCircle className="w-6 h-6 text-white shrink-0" />
        </Button>
      </form>
    </Form>
  );
};

export default CategoryInputForm;