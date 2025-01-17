import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

const loading = () => {
  return <Skeleton className="w-full max-w-[1840px] h-[800px] rounded-xl" />;
};

export default loading;
