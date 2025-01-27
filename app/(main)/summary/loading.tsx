import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

const loading = () => {
  return (
      <div className="grid-cols-12 w-full max-w-[1840px] h-[760px] gap-6 self-center">
        <Skeleton className="col-span-9 h-[760px] rounded-xl" />
        <Skeleton className="col-span-3 h-[760px] rounded-xl" />
      </div>
    );
};

export default loading;
