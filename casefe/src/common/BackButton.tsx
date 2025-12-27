"use client";

import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/src/components/ui/button";

const BackButton = () => {
  const router = useRouter();

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => router.back()}
      className="rounded-sm cursor-pointer"
    >
      <ChevronLeft className="h-5 w-5" />
    </Button>
  );
};

export default BackButton;
