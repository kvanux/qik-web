"use client";

import { useState, useEffect, useMemo } from "react";
import { Category } from "@prisma/client";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { revalidateExpenses } from "@/app/actions";
import { useForm, SubmitHandler } from "react-hook-form";
import { Calendar as CalendarIcon } from "lucide-react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Info, Loader2, PlusCircle } from "lucide-react";

interface DataProps {
  categories: Category[];
}

interface ExpenseForm {
  amount: number | undefined;
  date: string;
  categoryID: number | null;
}

const QikLogger = ({ categories }: DataProps) => {
  const [date, setDate] = useState<Date>(new Date());
  const [categ, setCateg] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isToday = (date: Date) => {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  const { register, handleSubmit, setValue } = useForm<ExpenseForm>({
    defaultValues: {
      amount: undefined,
      date: date.toISOString(),
      categoryID: Number(categ),
    },
  });

  const formatDateToUTC = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const day = date.getDate();
    return new Date(Date.UTC(year, month, day)).toISOString();
  };

  const categoryList = useMemo(() => {
    const updateCategories = categories;
    return updateCategories;
  }, [categories]);

  useEffect(() => {
    setValue("date", formatDateToUTC(date));
  }, [date, setValue]);

  const onSubmit: SubmitHandler<ExpenseForm> = async (data) => {
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/expense", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
        next: { revalidate: 0},
      });

      if (response.status === 500) {
        toast.error("Có lỗi xảy ra", {
          description: `${response.statusText}`,
        });
      } else {
        await revalidateExpenses();
        setValue("amount", undefined);
        toast.success(`Nhập chi phí mới thành công`);
        return response.json();
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      className="flex flex-col gap-2 w-full focus:border-qik-pri-600 min-[360px]:max-[800px]:gap-2"
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="relative">
        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-base max-[1280px]:text-sm font-medium text-slate-400">
          ,000
        </div>
        <Input
          placeholder="Nhập chi phí mới"
          className="w-full pl-4 pr-12 text-base max-[1280px]:text-sm focus:outline-none focus-visible:ring-0 focus-visible:border-2 focus-visible:ring-offset-0 focus-visible:border-qik-pri-400"
          {...register("amount", {
            valueAsNumber: true,
          })}
          autoComplete="off"
          disabled={isSubmitting}
        />
      </div>
      <div className="flex flex-col gap-2 min-[360px]:max-[800px]:flex-row min-[360px]:max-[800px]:gap-2">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              type="button"
              variant="outline"
              className={cn(
                "w-full justify-start text-left text-base max-[1280px]:text-sm text-slate-900 items-center font-normal border-slate-200",
                !date && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="h-4 w-4 text-slate-700" />
              {isToday(date) ? "Hôm nay" : format(date, "dd/MM/yyyy")}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={date}
              onSelect={(newDate) => {
                if (newDate) {
                  setDate(newDate);
                  setValue("date", formatDateToUTC(newDate));
                }
              }}
              initialFocus
              defaultMonth={date}
              ISOWeek
            />
          </PopoverContent>
        </Popover>
        <Select
          value={categ}
          onValueChange={(newCateg) => {
            if (newCateg) {
              setCateg(newCateg);
              setValue("categoryID", Number(newCateg));
            }
          }}
        >
          <SelectTrigger className="text-slate-600 text-left text-base focus:border-qik-pri-600 focus:border-2 focus:ring-0 focus:ring-offset-0 hover:bg-slate-100 transition-colors duration-300 max-[1280px]:text-sm min-[360px]:max-[800px]:w-full min-[360px]:max-[800px]:p-3">
            <SelectValue
              placeholder="Không ghi rõ phân loại"
              className="text-base"
            />
          </SelectTrigger>
          <SelectContent>      
            <SelectItem key={null} value={"null"} className="text-slate-500">
              Không ghi rõ phân loại
            </SelectItem>
            {categoryList.map((category) => (
              <SelectItem key={category.id} value={category.id.toString()}>
                {category.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="flex gap-1 items-center max-[1440px]:hidden">
        <Info className="text-slate-600 w-5 h-5 pt-[2px]" />
        <Label className="text-slate-500 font-normal max-[1280px]:text-xs">
          Phân loại chi phí giúp quản lý chi tiêu tốt hơn.
        </Label>
      </div>
      <Button
        type="submit"
        className="text-white bg-qik-sec-700 hover:bg-qik-pri-700 transition-colors duration-300 font-semibold text-base mt-3 min-[360px]:max-[800px]:text-sm min-[360px]:max-[800px]:mt-0"
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <div className="flex items-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin text-white" />
            Chờ chút nha...
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <PlusCircle className="h-4 w-4 text-white" />
            Nhập chi phí
          </div>
        )}
      </Button>
    </form>
  );
};

export default QikLogger;
