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
import { Briefcase, Gavel, Calendar, ArrowUpRight } from "lucide-react";
import { Badge } from "@/src/components/ui/badge";
import Link from "next/link";

const Case = () => {
  const { data: caseData, isLoading, error } = useCase();

  const getStatusVariant = (status: string) => {
    const s = status.toLowerCase();
    if (s.includes("open") || s.includes("active")) return "default";
    if (s.includes("closed")) return "secondary";
    if (s.includes("pending")) return "outline";
    return "default";
  };

  return (
    <div className=" mx-auto px-4 py-8 space-y-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-6">
        <PageHeader heading="Case Management" />
        <CreateCaseDialog />
      </div>

      {/* Content Area */}
      <div>
        {isLoading ? (
          <div className="flex h-64 items-center justify-center">
            <Loading />
          </div>
        ) : error ? (
          <div className="text-center py-10 text-destructive bg-destructive/10 rounded-lg">
            Failed to load cases. Please try again later.
          </div>
        ) : caseData && caseData.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {caseData.map((item) => (
              <Link key={item.id} href={`case/${item.id}`}>
                <Card className="group hover:shadow-lg transition-all duration-300 border-muted-foreground/10">
                  <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                    <div className="space-y-1">
                      <CardTitle className="text-xl font-bold group-hover:text-primary transition-colors">
                        {item.title}
                      </CardTitle>
                      <CardDescription className="flex items-center gap-1">
                        <Briefcase className="w-3 h-3" />#{item.caseNumber}
                      </CardDescription>
                    </div>
                    <Badge
                      variant={getStatusVariant(item.status)}
                      className="capitalize text-black border border-gray-500"
                    >
                      {item.status}
                    </Badge>
                  </CardHeader>

                  <CardContent className="pt-4">
                    <div className="grid gap-3 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Gavel className="w-4 h-4 text-primary" />
                        <span>{item.court || "No Court Assigned"}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        <span>Updated: {new Date().toLocaleDateString()}</span>
                      </div>
                    </div>

                    <button className="mt-6 w-full flex items-center justify-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary  transition-opacity">
                      View Case Details <ArrowUpRight className="w-3 h-3" />
                    </button>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 border-2 border-dashed rounded-xl">
            <p className="text-muted-foreground">
              No cases found. Create your first case to get started.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Case;
