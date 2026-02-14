import { useState } from "react";
import { Button } from "../../ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
} from "../../ui/dialog";
import { useUpdateCase } from "@/src/hooks/mutation/case";
import { Input } from "../../ui/input";
import { Form } from "../../ui/form";
import { useForm } from "react-hook-form";
import { UpdateCaseDto } from "@/src/types/Case";

export const AddCaseHearingDate = ({ caseId }: { caseId: number }) => {
  const { mutateAsync, isPending } = useUpdateCase();
  const [isOpen, setIsOpen] = useState(false);

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const minDate = new Date(today);
  minDate.setDate(minDate.getDate() + 1);
  const minDateString = minDate.toISOString().split("T")[0];

  const form = useForm({
    defaultValues: {
      nextHearingDate: undefined,
    },
  });

  const handleSubmit = async (data: UpdateCaseDto) => {
    if (!data.nextHearingDate) {
      form.setError("nextHearingDate", {
        type: "manual",
        message: "Hearing date is required",
      });
      return;
    }
    const selectedDate = new Date(data?.nextHearingDate);

    if (selectedDate <= today) {
      form.setError("nextHearingDate", {
        type: "manual",
        message: "Hearing date must be greater than today",
      });
      return;
    }

    try {
      // Convert to ISO string with noon time to avoid timezone issues
      const dateString =
        typeof data.nextHearingDate === "string"
          ? data.nextHearingDate
          : new Date(data.nextHearingDate).toISOString().split("T")[0];

      // Create a date at noon UTC to prevent timezone shifts
      const dateAtNoon = new Date(`${dateString}T12:00:00.000Z`);

      await mutateAsync({
        url: `/case/${caseId}`,
        payload: {
          ...data,
          nextHearingDate: dateAtNoon,
        },
        successMessage: "Case hearing date added successfully",
      });
      setIsOpen(false);
      form.reset();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button>Add Case Hearing Date</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogTitle>Add Case Hearing Date</DialogTitle>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)}>
              <Input
                type="date"
                min={minDateString}
                {...form.register("nextHearingDate", {
                  required: "Hearing date is required",
                })}
              />
              {form.formState.errors.nextHearingDate && (
                <p className="text-sm text-red-500 mt-1">
                  {form.formState.errors.nextHearingDate.message}
                </p>
              )}
              <Button type="submit" disabled={isPending} className="mt-4">
                {isPending ? "Saving..." : "Save"}
              </Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
};
