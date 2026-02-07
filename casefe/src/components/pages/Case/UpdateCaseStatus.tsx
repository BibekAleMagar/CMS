import { useAuth } from "@/src/context/useAuth";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useLawyer } from "@/src/hooks/query/lawyer";
import { useParams } from "next/navigation";
import {
  useAssignLawyer,
  useUpdateCaseStatus,
} from "@/src/hooks/mutation/case";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../ui/dialog";
import { Button } from "../../ui/button";
import { Card, CardContent } from "../../ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../../ui/carousel";
import { UpdateCaseDto } from "@/src/types/Case";
import { CaseStatus } from "@/src/types/enums/case-status.enum";
import { Form } from "../../ui/form";
import { enumToArray } from "@/src/common/SelectEnum";
import { SelectElement } from "../../ui/select";

export const UpdateCaseStatus = () => {
  const param = useParams();
  const id = Number(param.id);
  const [isOpen, setIsopen] = useState(false);
  const caseStatus = enumToArray(CaseStatus);

  const form = useForm({
    values: {
      status: "",
    },
  });

  const { mutateAsync, isPending } = useUpdateCaseStatus();

  const handleAssignLawyer = async (status: CaseStatus) => {
    try {
      await mutateAsync({
        url: `/case/update-lawyer/${id}`,
        payload: { status },
        successMessage: "Status updated successfully",
      });
      setIsopen(false);
    } catch (error) {
      console.error("Failed to assign lawyer:", error);
    }
  };

  return (
    <>
      {/* <Dialog
        open={isOpen}
        onOpenChange={(open) => {
          setIsopen(open);
          form.reset();
        }}
      >
        <DialogTrigger asChild>
          <Button className="cursor-pointer w-full sm:w-auto">
            Update Status
          </Button>
        </DialogTrigger>

        <DialogContent
          onInteractOutside={(e) => e.preventDefault()}
          className="bg-white text-black"
        >
          <DialogHeader className="">
            <DialogTitle>Update Status</DialogTitle>
          </DialogHeader>
        </DialogContent>
      </Dialog><SelectEnum name="status" enumObject={CaseStatus} /> */}
      <Form {...form}>
        <form></form>
      </Form>
    </>
  );
};
