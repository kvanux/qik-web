'use client'

import * as React from 'react';
import { Drawer } from "vaul";
import { Button } from "@/components/ui/button";
import { X, Settings } from "lucide-react";
import { Category } from "@prisma/client";
import CategoryList from "@/components/ui/custom/categoryList/CategoryList";
import CategoryInputForm from "@/components/ui/custom/singleInputForm/CategoryInputForm";

const CategoryDrawer = ({ categories }: { categories: Category[] }) => {
    const [isAddingCategory, setIsAddingCategory] = React.useState(false);
  
    return (
        <Drawer.Root direction="right">
            <Drawer.Trigger asChild>
                <Button
                  variant={"ghost"}
                  className="max-[1280px]:text-xs items-center w-full text-medium text-slate-700"
                >
                  <Settings />
                  Điều chỉnh phân loại
                </Button>
            </Drawer.Trigger>
            <Drawer.Portal>
                <Drawer.Content
                  className="right-0 top-0 bottom-0 fixed outline-none w-[600px] flex min-[360px]:max-[800px]:w-11/12 z-50"
                  style={
                    {
                      "--initial-transform": "calc(100% + 8px)",
                    } as React.CSSProperties
                  }
                >
                  <div className="bg-white/80 backdrop-blur-[6px] shadow-md h-full w-full grow flex flex-col min-[360px]:max-[800px]:bg-white min-[360px]:max-[800px]:backdrop-blur-none ">
                    <div className="w-full flex px-8 pt-8 pb-6 justify-between items-center min-[360px]:max-[800px]:p-4 border-b border-slate-200">
                      <Drawer.Title className="font-semibold text-xl text-slate-800 min-[360px]:max-[800px]:text-lg">
                        Điều chỉnh phân loại
                      </Drawer.Title>
                      <Drawer.Close>
                        <X className="text-slate-900 w-6 h-6"></X>
                      </Drawer.Close>
                    </div>
                    <div className="w-full h-full flex flex-col gap-5 px-8 pt-6 min-[360px]:max-[800px]:px-4 min-[360px]:max-[800px]:gap-4">
                        <CategoryList 
                        categories={categories}
                        isAddingCategory={isAddingCategory}
                        />
                        <CategoryInputForm 
                        onAddStart={() => setIsAddingCategory(true)}
                        onAddComplete={() => setIsAddingCategory(false)}
                        />
                    </div>
                  </div>
                </Drawer.Content>
            </Drawer.Portal>
        </Drawer.Root>
    )
}

export default CategoryDrawer