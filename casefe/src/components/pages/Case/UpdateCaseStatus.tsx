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
import {
  Select,
  SelectContent,
  SelectElement,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../ui/select";
import { useCaseById } from "@/src/hooks/query/case";

export const UpdateCaseStatus = () => {
  const param = useParams();
  const id = Number(param.id);
  const [pendingStatus, setPendingStatus] = useState<CaseStatus | null>(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  const caseStatus = enumToArray(CaseStatus);
  const { data } = useCaseById(id);
  const { mutateAsync, isPending } = useUpdateCaseStatus();

  const handleSelectClick = (val: string) => {
    setPendingStatus(val as CaseStatus);
    setIsConfirmOpen(true);
  };

  const confirmUpdate = async () => {
    if (!pendingStatus) return;
    try {
      await mutateAsync({
        url: `/case/update-status/${id}`,
        payload: { status: pendingStatus },
        successMessage: "Status updated successfully",
      });
      setIsConfirmOpen(false);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      {data && (
        <Select
          defaultValue={String(data.status)}
          onValueChange={handleSelectClick}
        >
          <SelectTrigger className="min-w-[130px]">
            <SelectValue placeholder="Select a status" className="text-black" />
          </SelectTrigger>
          <SelectContent>
            {caseStatus.map((status) => (
              <SelectItem
                key={status.value}
                value={status.value}
                className="cursor-pointer"
              >
                {status.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}

      {/* Separate Dialog for Confirmation */}
      <Dialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Status Change</DialogTitle>
          </DialogHeader>
          <p>Are you sure you want to change the status to {pendingStatus}?</p>
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => setIsConfirmOpen(false)}
              className="cursor-pointer bg-white hover:bg-white shadow"
            >
              Cancel
            </Button>
            <Button
              onClick={confirmUpdate}
              disabled={isPending}
              className="cursor-pointer bg-black hover:bg-black"
            >
              {isPending ? "Updating..." : "Update"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
