import React from "react";
import { Button } from "../../button";
import { Input } from "../../input";
import { useForm, SubmitHandler } from "react-hook-form";
import { revalidateExpenses } from "@/app/actions";
import { PlusCircle } from "lucide-react";

interface Props {
  currentMonth: Date;
}

interface BillingForm {
  amount: number;
  title: string;
  month: string;
}

const BillingInputForm = ({ currentMonth }: Props) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<BillingForm>({
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

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Validation errors:", errorData);
      } else {
        const newExpense = await response.json();
        console.log("Billing added:", newExpense);
        await revalidateExpenses();
      }
    } catch (error) {
      console.error("Failed to add billing", error);
    }
  };

  return (
    <form
      className="flex gap-2 w-full items-center"
      onSubmit={handleSubmit(onSubmit)}
    >
      <Input
        className="w-full"
        {...register("title")}
        placeholder="Enter title"
      />
      <Input
        className="w-full"
        {...register("amount")}
        placeholder="Enter amount"
      />
      <Button
        type="submit"
        variant="default"
        size="icon"
        className="shrink-0 bg-qik-pri-900"
      >
        <PlusCircle className="w-6 h-6 text-white shrink-0" />
      </Button>
    </form>
  );
};

export default BillingInputForm;
