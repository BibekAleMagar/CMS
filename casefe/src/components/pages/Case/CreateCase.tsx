import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../ui/dialog";

import { useAuth } from "@/src/context/useAuth";
import { useCreateCase } from "@/src/hooks/mutation/case";
import { useState } from "react";
import { Button } from "../../ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CreateCaseDto } from "@/src/types/Case";
import { createCaseSchema } from "@/src/validators/case";
import { Input } from "../../ui/input";
import { Textarea } from "../../ui/textarea";
import { Label } from "../../ui/label";
import { number } from "zod";

export const CreateCaseDialog = () => {
  const { user } = useAuth();
  const [isOpen, setIsopen] = useState(false);
  const { mutateAsync, isPending } = useCreateCase();
  const form = useForm<CreateCaseDto>({
    values: {
      title: "",
      description: "",
      lawyerId: undefined,
      court: "",
    },

    resolver: zodResolver(createCaseSchema),
  });
  const onSubmit = (data: CreateCaseDto) => {
    mutateAsync({
      url: "/case",
      payload: data,
      successMessage: "case Created successfully",
    });
    setIsopen(false);
  };

  return (
    <>
      <Dialog
        open={isOpen}
        onOpenChange={(open) => {
          (setIsopen(open), form.reset());
        }}
      >
        <DialogTrigger asChild>
          <Button className="cursor-pointer">Add Case</Button>
        </DialogTrigger>
        <DialogContent
          onInteractOutside={(e) => e.preventDefault()}
          className="lg:min-w-4xl bg-white text-black"
        >
          <DialogHeader>
            <DialogTitle>Add Case</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className="grid sm:grid-cols-2 gap-3">
                <Input
                  name="title"
                  placeholder="Enter your case title"
                  label="Title *"
                />
                <Input
                  name="court"
                  placeholder="Enter court name"
                  label="Court Name"
                />
              </div>
              <div className="space-y-2 my-4">
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Short description about your case"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <Button
                type="submit"
                className="cursor-pointer"
                disabled={isPending}
              >
                {isPending ? "Creating ..." : "Create"}
              </Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
};
