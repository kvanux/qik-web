"use client";

import React, { useState } from "react";
import { Skeleton } from "../../skeleton";
import { Category } from "@prisma/client";
import { toast } from "sonner";
import { revalidateExpenses } from "@/app/actions";
import { Button } from "../../button";
import { Loader2, Trash2 } from "lucide-react";

interface CategoryListProps {
  categories: Category[];
  isAddingCategory: boolean;
}

const CategoryList = ({ categories, isAddingCategory }: CategoryListProps) => {
  const [deletingCategories, setDeletingCategories] = useState<number[]>([]);

  const deleteCategory = async (categoryId: number) => {
    setDeletingCategories((prev) => [...prev, categoryId]);
    try {
      const response = await fetch(`/api/category?id=${categoryId}`, {
        method: "DELETE",
      });
      toast.info("Xóa thành công.");
      revalidateExpenses();
      return response;
    } catch (error) {
      toast.error("Có lỗi xảy ra", { description: `${error}` });
    } finally {
      setDeletingCategories((prev) => prev.filter((id) => id !== categoryId));
    }
  };

  return (
    <ul className="w-full min-h-7 flex flex-col gap-2 min-[360px]:max-[800px]:py-2 min-[360px]:max-[800px]:rounded-xl bg-white border-slate-200 border py-3 px-2 rounded-xl">
      {categories.map((category) => (
        <li key={category.id} className="flex gap-2 items-center pl-4">
          <span className="text-base font-medium text-slate-600 w-full">
            {category.title}
          </span>
          <Button
            onClick={() => deleteCategory(category.id)}
            variant="ghost"
            size="icon"
            className="shrink-0"
            disabled={deletingCategories.includes(category.id)}
          >
            {deletingCategories.includes(category.id) ? (
              <Loader2 className="h-5 w-5 animate-spin text-slate-600" />
            ) : (
              <Trash2 className="w-5 h-5 text-red-800" />
            )}
          </Button>
        </li>
      ))}
      {categories.length === 0 && (
        <p className="text-base text-slate-400 ml-1">Chưa có phân loại</p>
      )}
      {isAddingCategory && <Skeleton className="h-10 w-40 rounded-lg" />}
    </ul>
  );
};

export default CategoryList;
