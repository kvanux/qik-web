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
import { Drawer } from "vaul";
import { X, Trash2 } from "lucide-react";
import CategoryInputForm from "@/components/ui/custom/singleInputForm/CategoryInputForm";

interface DataProps {
  categories: Category[];
}

interface ExpenseForm {
  amount: number;
  date: string;
  categoryID: number | null;
}

const QikLogger = ({ categories }: DataProps) => {
  const [date, setDate] = useState<Date>(new Date());
  const [categ, setCateg] = useState("");

  const isToday = (date: Date) => {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  const { register, handleSubmit, setValue, reset } = useForm<ExpenseForm>({
    defaultValues: {
      date: new Date().toISOString(),
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
    try {
      const response = await fetch("http://localhost:3000/api/expense", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      toast.success(`Nhập chi phí mới thành công`);
      await revalidateExpenses();

      return response.json();
    } catch (error) {
      toast.error("Có lỗi xảy ra", { description: `${error}` });
    }
  };

  const { ref: inputRefRegister, ...inputRegisterRest } = register("amount", {
    required: "Nhập số tiền nhé",
    valueAsNumber: true,
  });

  const deleteCategory = async function (categoryId: number) {
    try {
      const response = await fetch(`/api/category?id=${categoryId}`, {
        method: "DELETE",
      });
      toast.info("Xóa thành công.");
      revalidateExpenses();
      return response;
    } catch (error) {
      toast.error("Có lỗi xảy ra", { description: `${error}` });
    }
  };

  return (
    <form
      className="flex flex-col gap-2 w-full focus:border-qik-pri-600"
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="relative">
        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-base max-[1280px]:text-sm font-medium text-slate-400">
          ,000
        </div>
        <Input
          ref={(e) => {
            inputRefRegister(e);
            if (e) {
              e.focus();
            }
          }}
          placeholder="Nhập chi phí mới"
          className="w-full pl-4 pr-12 text-base max-[1280px]:text-sm focus:outline-none focus-visible:ring-0 focus-visible:border-2 focus-visible:ring-offset-0 focus-visible:border-qik-pri-400"
          {...inputRegisterRest}
          autoComplete="off"
        />
      </div>
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
        <SelectTrigger className="text-slate-600 text-base focus:border-qik-pri-600 focus:border-2 focus:ring-0 focus:ring-offset-0">
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
      <Label className="text-slate-500 font-normal my-1">
        Lựa chọn phân loại của chi phí giúp chúng tôi đưa ra phân tích chi tiêu
        tốt hơn cho bạn.
        <Drawer.Root direction="right">
          <Drawer.Trigger asChild>
            <Button
              variant={"link"}
              className="h-5 px-1 transition-all text-qik-sec-800 hover:text-qik-pri-900 duration-300"
            >
              Điều chỉnh phân loại
            </Button>
          </Drawer.Trigger>
          <Drawer.Portal>
            <Drawer.Content
              className="right-6 top-6 bottom-6 fixed z-10 outline-none w-[600px] flex"
              style={
                {
                  "--initial-transform": "calc(100% + 8px)",
                } as React.CSSProperties
              }
            >
              <div className="bg-white/80 backdrop-blur-[6px] shadow-md h-full w-full grow flex flex-col rounded-[16px]">
                <div className="w-full flex px-6 py-6 justify-between items-center">
                  <Drawer.Title className="font-semibold text-xl text-slate-800">
                    Điều chỉnh phân loại
                  </Drawer.Title>
                  <Drawer.Close>
                    <X className="text-slate-900 w-6 h-6"></X>
                  </Drawer.Close>
                </div>
                <div className="w-full h-full flex flex-col gap-5 px-6">
                  <ul className="w-full flex flex-col gap-2">
                    {categoryList.map((category) => (
                      <li
                        key={category.id}
                        className="flex gap-2 items-center pl-4"
                      >
                        <span className="text-base font-medium text-slate-600 w-full">
                          {category.title}
                        </span>
                        <Button
                          onClick={() => deleteCategory(category.id)}
                          variant="ghost"
                          size="icon"
                          className=" shrink-0"
                        >
                          <Trash2 className="w-5 h-5 text-red-800" />
                        </Button>
                      </li>
                    ))}
                  </ul>
                  <CategoryInputForm />
                </div>
              </div>
            </Drawer.Content>
          </Drawer.Portal>
        </Drawer.Root>
      </Label>
      <Button
        type="submit"
        className="text-white bg-qik-sec-700 hover:bg-qik-pri-700 transition-colors duration-300 font-semibold text-base mt-2"
      >
        Nhập
      </Button>
    </form>
  );
};

export default QikLogger;
