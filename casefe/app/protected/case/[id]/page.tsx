"use client";

import { useParams } from "next/navigation";
import {
  ChevronLeft,
  Calendar,
  Gavel,
  FileText,
  Clock,
  ShieldCheck,
} from "lucide-react";
import Link from "next/link";

import { Button } from "@/src/components/ui/button";
import { Badge } from "@/src/components/ui/badge";
import {
  Card,
  CardContent,
} from "@/src/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/src/components/ui/accordion";
import { useCaseById } from "@/src/hooks/query/case";
import BackButton from "@/src/common/BackButton";

const CaseDetails = () => {
  const params = useParams();
  const id = Number(params.id);
  const { data } = useCaseById(id);

  if (!data) return null;

  return (
    <div className=" space-y-8 lg:max-w-5xl">
      <div className="flex items-center gap-4">
        <BackButton />
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            {data.title}
          </h1>
          <p className="text-sm text-muted-foreground">
            Case No: {data.caseNumber}
          </p>
        </div>
      </div>

      <Card className="border shadow-sm">
        <CardContent className="flex flex-wrap items-center gap-6">
          <Badge className="flex items-center gap-2 px-4 py-2 text-sm">
            <ShieldCheck className="h-4 w-4" />
            {data.status}
          </Badge>

          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            {new Date(data.createdAt).toLocaleDateString()}
          </div>

          {data.court && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Gavel className="h-4 w-4" />
              {data.court}
            </div>
          )}
        </CardContent>
      </Card>

      <Accordion type="single" collapsible className="lg:max-w-5xl">
        <AccordionItem value="case-info">
          <AccordionTrigger className="px-2 cursor-pointer border shadow-md">
            <div className="flex items-center gap-2">
              <div className="flex items-center  bg-blue-100 p-2 rounded-md">
              <FileText className="text-red-600" size={20} />
            </div>
            <p className="md:text-md lg:text-lg  font-semibold no-underline">Case Information</p>
            </div>
          </AccordionTrigger>

          <AccordionContent>
            <Card className="border shadow-sm">
              <CardContent className="space-y-6 pt-6">
                {data.description && (
                  <div className="rounded-lg bg-muted/50 p-4">
                    <p className="text-sm font-medium text-muted-foreground mb-1">
                      Description
                    </p>
                    <p className="text-sm leading-relaxed">
                      {data.description}
                    </p>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <InfoItem
                    icon={<Clock className="h-4 w-4 text-blue-600" />}
                    label="Status"
                    value={data.status}
                    bg="bg-blue-100"
                  />

                  <InfoItem
                    icon={<Calendar className="h-4 w-4 text-green-600" />}
                    label="Created At"
                    value={new Date(data.createdAt).toLocaleString()}
                    bg="bg-green-100"
                  />

                  {data.court && (
                    <InfoItem
                      icon={<Gavel className="h-4 w-4 text-purple-600" />}
                      label="Court"
                      value={data.court}
                      bg="bg-purple-100"
                    />
                  )}
                </div>
              </CardContent>
            </Card>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default CaseDetails;

const InfoItem = ({
  icon,
  label,
  value,
  bg,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  bg: string;
}) => (
  <div className="flex items-start gap-4 rounded-xl border p-4">
    <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${bg}`}>
      {icon}
    </div>
    <div>
      <p className="text-sm font-medium text-muted-foreground">
        {label}
      </p>
      <p className="text-sm font-semibold">
        {value}
      </p>
    </div>
  </div>
);
