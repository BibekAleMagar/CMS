"use client";

import { PageHeader } from "@/src/common/PageHeader";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { CreateCaseDialog } from "@/src/components/pages/Case/CreateCase";
import { useCase } from "@/src/hooks/query/case";
import { Loading } from "@/src/common/Loading";
import {
  Briefcase,
  Gavel,
  Calendar,
  ArrowRight,
  FolderOpen,
  Search,
} from "lucide-react";
import { Badge } from "@/src/components/ui/badge";
import Link from "next/link";
import { Button } from "@/src/components/ui/button";
import { InputElement } from "@/src/components/ui/input";
import { useState } from "react";
import { CaseStatus } from "@/src/types/enums/case-status.enum";
import {
  Select,
  SelectContent,
  SelectElement,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/components/ui/select";
import { set } from "zod";
const Case = () => {
  const [caseName, setCaseName] = useState<string>("");
  const [selectedStatus, setSelectedStatus] = useState<string>("");
  const { data: caseData, isLoading, error } = useCase();

  const filteredCase = caseData?.filter((caseItem) => {
    const matchesName = caseName
      ? caseItem?.title?.toLowerCase().includes(caseName.toLowerCase())
      : true;

    const matchesStatus = selectedStatus
      ? caseItem?.status === selectedStatus
      : true;

    return matchesName && matchesStatus;
  });

  const getStatusVariant = (status: string) => {
    const s = status.toLowerCase();
    if (s.includes("open") || s.includes("active")) return "default";
    if (s.includes("closed")) return "secondary";
    return "outline";
  };
  const caseStatusOptions = Object.values(CaseStatus).map((status) => ({
    label: status,
    value: status,
  }));

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 space-y-2">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 border-b border-muted pb-2">
        <div>
          <PageHeader heading="Case Management" />
          <p className="text-muted-foreground mt-2">
            Track, manage, and organize your active legal proceedings.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <CreateCaseDialog />
        </div>
      </div>
      <div className="flex justify-between items-center">
        <div>
          <InputElement
            placeholder="Search cases..."
            className="w-fit border-2 border-[#0c71f3]"
            value={caseName}
            onChange={(e) => setCaseName(e.target.value)}
          >
            <Search className="w-4 h-4 text-muted-foreground relative right-8" />
          </InputElement>
        </div>
        <div>
          <Select value={selectedStatus} onValueChange={setSelectedStatus}>
            <SelectTrigger className=" text-black cursor-pointer">
              <SelectValue placeholder="Select status" />
            </SelectTrigger>

            <SelectContent>
              {caseStatusOptions.map((status) => (
                <SelectItem
                  key={status.value}
                  value={status.value}
                  className="text-black cursor-pointer md:max-w-[400px]"
                  onClick={() => setSelectedStatus(status.value)}
                >
                  {status.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Content Area */}
      <div className="min-h-[400px]">
        {isLoading ? (
          <div className="flex h-64 flex-col items-center justify-center gap-4">
            <Loading />
            <p className="text-sm text-muted-foreground animate-pulse">
              Retrieving case files...
            </p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-16 px-4 text-center bg-destructive/5 border border-destructive/20 rounded-2xl">
            <div className="p-3 bg-destructive/10 rounded-full mb-4">
              <Gavel className="w-8 h-8 text-destructive" />
            </div>
            <h3 className="text-lg font-semibold">Unable to load cases</h3>
            <p className="text-muted-foreground max-w-xs mx-auto">
              There was a problem connecting to the database. Please refresh the
              page.
            </p>
          </div>
        ) : filteredCase && filteredCase.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredCase?.map((item) => (
              <Link
                key={item.id}
                href={`case/${item.id}`}
                className="block group"
              >
                <Card className="relative h-full overflow-hidden border-muted/60 bg-card hover:bg-accent/5 transition-all duration-300 hover:shadow-2xl hover:shadow-primary/5 hover:-translate-y-1">
                  {/* Accent bar */}
                  <div className="absolute top-0 left-0 w-full h-1 bg-primary/10 group-hover:bg-primary transition-colors" />

                  <CardHeader className="space-y-4">
                    <div className="flex justify-between items-start">
                      <div className="p-2 bg-primary/5 rounded-lg group-hover:bg-primary/10 transition-colors">
                        <FolderOpen className="w-5 h-5 text-primary" />
                      </div>
                      <Badge
                        variant={getStatusVariant(item.status)}
                        className="font-medium px-2.5 py-0.5"
                      >
                        {item.status}
                      </Badge>
                    </div>

                    <div className="space-y-1">
                      <CardTitle className="text-xl font-bold leading-tight">
                        {item.title}
                      </CardTitle>
                      <CardDescription className="flex items-center gap-1.5 font-medium">
                        <span className="text-primary/70">Ref:</span> #
                        {item.caseNumber}
                      </CardDescription>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-6">
                    <div className="space-y-3">
                      <div className="flex items-center gap-3 text-sm text-muted-foreground">
                        <Gavel className="w-4 h-4 shrink-0" />
                        <span className="truncate">
                          {item.court || "Jurisdiction Not Set"}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-sm text-muted-foreground">
                        <Calendar className="w-4 h-4 shrink-0" />
                        <span>
                          Last Activity: {new Date().toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-muted flex items-center justify-between group-hover:text-primary transition-colors">
                      <span className="text-sm font-semibold">
                        View Case File
                      </span>
                      <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-24 border-2 border-dashed border-muted rounded-3xl bg-muted/5">
            <div className="bg-background p-4 rounded-full shadow-sm mb-4">
              <Briefcase className="w-10 h-10 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-medium">No active cases</h3>
            <p className="text-muted-foreground mt-1 mb-6">
              Start by documenting your first legal proceeding.
            </p>
            <CreateCaseDialog />
          </div>
        )}
      </div>
    </div>
  );
};

export default Case;
