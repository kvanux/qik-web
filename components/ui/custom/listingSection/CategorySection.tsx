import * as React from "react";
import { Category } from "@prisma/client";
import CategoryList from "@/components/ui/custom/categoryList/CategoryList";
import CategoryInputForm from "@/components/ui/custom/singleInputForm/CategoryInputForm";

const CategorySection = ({ categories }: { categories: Category[] }) => {
    const [isAddingCategory, setIsAddingCategory] = React.useState(false);
  
    return (
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
    );
  };
  
  export default CategorySection;