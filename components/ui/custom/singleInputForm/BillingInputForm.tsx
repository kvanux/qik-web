import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useForm, SubmitHandler } from "react-hook-form";
import { revalidateExpenses } from "@/app/actions";
import { PlusCircle } from "lucide-react";
import { toast } from "sonner";

interface Props {
  currentMonth: Date;
}

interface BillingForm {
  amount: number;
  title: string;
  month: string;
}

const BillingInputForm = ({ currentMonth }: Props) => {
  const { register, handleSubmit } = useForm<BillingForm>({
    defaultValues: {
      month: currentMonth.toISOString(),
    },
  });

  const onSubmit: SubmitHandler<BillingForm> = async (data) => {
    try {
      const response = await fetch("http://localhost:3000/api/billing", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      await revalidateExpenses();
      toast.success(`Billing added successfully`);

      return response.json();
    } catch (error) {
      toast.error("Failed to add billing", { description: `${error}` });
    }
  };

  return (
    <form
      className="flex gap-2 w-full items-center"
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="relative w-full">
        <div className="absolute left-4 top-1/2 -translate-y-1/2">
          <img
            src="/svg/dongIconM.svg"
            alt="Dong Icon"
            className="w-[14px] h-auto opacity-80"
          />
        </div>
        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-base font-medium text-slate-400">
          ,000
        </div>
        <Input
          className="w-full pl-10 pr-12 text-base focus:outline-none focus-visible:ring-0 focus-visible:border-2 focus-visible:ring-offset-0 focus-visible:border-qik-pri-400"
          {...register("amount")}
          placeholder="Nhập số tiền"
          autoComplete="off"
        />
      </div>
      <Input
        className="w-full text-base focus:outline-none focus-visible:ring-0 focus-visible:border-2 focus-visible:ring-offset-0 focus-visible:border-qik-pri-400"
        {...register("title")}
        placeholder="Nhập mô tả"
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
  );
};

export default BillingInputForm;
