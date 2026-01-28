import { useAuth } from "@/src/context/useAuth";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useLawyer } from "@/src/hooks/query/lawyer";
import { useParams } from "next/navigation";
import { useAssignLawyer } from "@/src/hooks/mutation/case";
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

export const AssignLawyerDialog = () => {
  const param = useParams();
  const id = Number(param.id);
  const [isOpen, setIsopen] = useState(false);

  const form = useForm<UpdateCaseDto>({
    defaultValues: {
      lawyerId: undefined,
    },
  });

  const { data: lawyers } = useLawyer(isOpen);
  const { mutateAsync, isPending } = useAssignLawyer(); // Add mutation hook

  const handleAssignLawyer = async (lawyerId: number) => {
    try {
      await mutateAsync({
        url: `/case/update-lawyer/${id}`,
        payload: { lawyerId },
        successMessage: "Lawyer assigned successfully",
      });
      setIsopen(false);
    } catch (error) {
      console.error("Failed to assign lawyer:", error);
    }
  };

  return (
    <>
      <Dialog
        open={isOpen}
        onOpenChange={(open) => {
          setIsopen(open);
          form.reset();
        }}
      >
        <DialogTrigger asChild>
          <Button className="cursor-pointer w-full sm:w-auto">
            Assign Lawyer
          </Button>
        </DialogTrigger>

        <DialogContent
          onInteractOutside={(e) => e.preventDefault()}
          className="w-[92vw] max-w-4xl lg:max-w-5xl p-0 overflow-hidden bg-white text-black sm:rounded-lg"
        >
          <DialogHeader className="p-4 sm:p-6 border-b">
            <DialogTitle className="text-xl sm:text-2xl font-bold">
              Assign Lawyer
            </DialogTitle>
          </DialogHeader>

          <div className="p-4 sm:p-8 max-h-[70vh] overflow-y-auto">
            <div className="relative px-4 sm:px-12">
              <Carousel className="w-full">
                <CarouselContent>
                  {lawyers?.map((lawyer) => (
                    <CarouselItem
                      key={lawyer.id}
                      className="md:basis-full lg:basis-full"
                    >
                      <Card className="border-2 shadow-sm">
                        <CardContent className="p-4 sm:p-8">
                          <div className="flex flex-col items-center space-y-4">
                            {/* Avatar Section */}
                            <div className="relative">
                              {lawyer.avatar ? (
                                <img
                                  src={lawyer.avatar}
                                  alt={`${lawyer.firstName}`}
                                  className="w-24 h-24 sm:w-32 sm:h-32 rounded-full object-cover border-4 border-primary/10"
                                />
                              ) : (
                                <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-gray-100 flex items-center justify-center text-2xl font-bold text-gray-400">
                                  {lawyer.firstName[0]}
                                  {lawyer.lastName[0]}
                                </div>
                              )}
                            </div>

                            {/* Header Info */}
                            <div className="text-center space-y-1">
                              <h3 className="text-xl sm:text-2xl font-bold">
                                {lawyer.firstName} {lawyer.lastName}
                              </h3>
                              <p className="text-sm sm:text-base text-muted-foreground break-all">
                                {lawyer.email}
                              </p>
                              {lawyer.phone && (
                                <p className="text-sm font-medium text-primary">
                                  {lawyer.phone}
                                </p>
                              )}
                            </div>

                            {/* Profile Details */}
                            {lawyer.lawyerProfile && (
                              <div className="w-full grid grid-cols-1 gap-4 pt-4 border-t">
                                {lawyer.lawyerProfile.specializations?.length >
                                  0 && (
                                  <div className="space-y-2">
                                    <p className="text-xs font-bold uppercase tracking-wider text-gray-500">
                                      Specializations
                                    </p>
                                    <div className="flex flex-wrap justify-center gap-1.5">
                                      {lawyer.lawyerProfile.specializations.map(
                                        (spec, idx) => (
                                          <span
                                            key={idx}
                                            className="bg-blue-50 text-blue-700 px-2.5 py-1 rounded-md text-xs font-medium border border-blue-100"
                                          >
                                            {spec}
                                          </span>
                                        ),
                                      )}
                                    </div>
                                  </div>
                                )}

                                {lawyer.lawyerProfile.experience !==
                                  undefined && (
                                  <div className="text-center">
                                    <p className="text-xs font-bold uppercase tracking-wider text-gray-500">
                                      Professional Experience
                                    </p>
                                    <p className="text-sm sm:text-base font-semibold">
                                      {lawyer.lawyerProfile.experience} Years
                                    </p>
                                  </div>
                                )}
                              </div>
                            )}

                            <Button
                              onClick={() => handleAssignLawyer(lawyer.id)}
                              disabled={isPending}
                              className="w-full mt-2 py-6 text-lg shadow-lg hover:shadow-none transition-all disabled:opacity-50"
                            >
                              {isPending
                                ? "Assigning..."
                                : "Assign This Lawyer"}
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </CarouselItem>
                  ))}
                </CarouselContent>

                <CarouselPrevious className="hidden sm:flex -left-6 lg:-left-12 h-10 w-10 bg-white text-black cursor-pointer" />
                <CarouselNext className="hidden sm:flex -right-6 lg:-right-12 h-10 w-10 bg-white text-black cursor-pointer" />
              </Carousel>
            </div>
          </div>

          <div className="p-4 bg-gray-50 border-t text-center">
            {lawyers && (
              <p className="text-xs font-medium text-gray-500">
                Swipe to view {lawyers.length} available professionals
              </p>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
