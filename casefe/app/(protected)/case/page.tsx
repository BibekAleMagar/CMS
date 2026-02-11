"use client";

import { PageHeader } from "@/src/common/PageHeader";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
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
  Filter,
  X,
  Scale,
  Clock,
  CheckCircle2,
  XCircle,
  Hourglass,
  MoreHorizontal,
  FileText,
  Users,
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
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/components/ui/select";
import { cn } from "@/src/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/src/components/ui/dropdown-menu";
import { Separator } from "@/src/components/ui/separator";

const statusConfig = {
  [CaseStatus.PENDING]: {
    icon: Hourglass,
    color: "text-amber-600",
    bgColor: "bg-amber-50",
    borderColor: "border-amber-200",
    badgeColor: "bg-amber-100 text-amber-700 hover:bg-amber-100",
    label: "Pending",
  },
  [CaseStatus.IN_PROGRESS]: {
    icon: Clock,
    color: "text-sky-600",
    bgColor: "bg-sky-50",
    borderColor: "border-sky-200",
    badgeColor: "bg-sky-100 text-sky-700 hover:bg-sky-100",
    label: "In Progress",
  },
  [CaseStatus.UNDER_REVIEW]: {
    icon: Gavel,
    color: "text-rose-600",
    bgColor: "bg-rose-50",
    borderColor: "border-rose-200",
    badgeColor: "bg-rose-100 text-rose-700 hover:bg-rose-100",
    label: "Under Review",
  },
  [CaseStatus.RESOLVED]: {
    icon: CheckCircle2,
    color: "text-emerald-600",
    bgColor: "bg-emerald-50",
    borderColor: "border-emerald-200",
    badgeColor: "bg-emerald-100 text-emerald-700 hover:bg-emerald-100",
    label: "Resolved",
  },
  [CaseStatus.CLOSED]: {
    icon: XCircle,
    color: "text-slate-600",
    bgColor: "bg-slate-50",
    borderColor: "border-slate-200",
    badgeColor: "bg-slate-100 text-slate-700 hover:bg-slate-100",
    label: "Closed",
  },
};

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

  const clearFilters = () => {
    setCaseName("");
    setSelectedStatus("");
  };

  const hasFilters = caseName || selectedStatus;

  // Calculate stats
  const totalCases = caseData?.length || 0;
  const activeCases =
    caseData?.filter((c) => c.status === CaseStatus.IN_PROGRESS).length || 0;
  const pendingCases =
    caseData?.filter((c) => c.status === CaseStatus.PENDING).length || 0;
  const resolvedCases =
    caseData?.filter((c) => c.status === CaseStatus.RESOLVED).length || 0;

  return (
    <div className="min-h-screen bg-gray-50/50">
      {/* Header Section */}
      <div className="bg-white border-b sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
                <Briefcase className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
                  Case Management
                </h1>
                <p className="text-sm text-gray-500 mt-0.5">
                  Track, manage, and organize your legal proceedings
                </p>
              </div>
            </div>
            <CreateCaseDialog />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Stats Overview */}
        {!isLoading && !error && totalCases > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard
              icon={FolderOpen}
              label="Total Cases"
              value={totalCases}
              color="indigo"
            />
            <StatCard
              icon={Scale}
              label="Active"
              value={activeCases}
              color="blue"
            />
            <StatCard
              icon={Hourglass}
              label="Pending"
              value={pendingCases}
              color="amber"
            />
            <StatCard
              icon={CheckCircle2}
              label="Resolved"
              value={resolvedCases}
              color="emerald"
            />
          </div>
        )}

        {/* Filters Section */}
        <Card className="border border-gray-200 shadow-sm">
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              <div className="flex items-center gap-2 text-gray-700">
                <Filter className="h-4 w-4" />
                <span className="text-sm font-medium">Filters</span>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                {/* Search Input */}
                <div className="relative w-full sm:w-72">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <InputElement
                    placeholder="Search by case name..."
                    className="pl-10 pr-10 w-full border-gray-200 focus:border-indigo-500 focus:ring-indigo-500"
                    value={caseName}
                    onChange={(e) => setCaseName(e.target.value)}
                  />
                  {caseName && (
                    <button
                      onClick={() => setCaseName("")}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>

                {/* Status Select */}
                <Select
                  value={selectedStatus}
                  onValueChange={setSelectedStatus}
                >
                  <SelectTrigger className="w-full sm:w-44 border-gray-200 text-gray-700">
                    <SelectValue placeholder="All Statuses" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.values(CaseStatus).map((status) => (
                      <SelectItem
                        key={status}
                        value={status}
                        className="cursor-pointer"
                      >
                        <div className="flex items-center gap-2">
                          <span
                            className={cn(
                              "w-2 h-2 rounded-full",
                              status === CaseStatus.PENDING
                                ? "bg-amber-500"
                                : status === CaseStatus.IN_PROGRESS
                                  ? "bg-blue-500"
                                  : status === CaseStatus.UNDER_REVIEW
                                    ? "bg-rose-500"
                                    : status === CaseStatus.CLOSED
                                      ? "bg-indigo-500"
                                      : status === CaseStatus.RESOLVED
                                        ? "bg-emerald-500"
                                        : "bg-slate-500",
                            )}
                          />
                          {status}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {/* Clear Filters */}
                {hasFilters && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearFilters}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <X className="h-4 w-4 mr-1" />
                    Clear
                  </Button>
                )}
              </div>
            </div>

            {/* Active Filters */}
            {hasFilters && (
              <div className="mt-4 pt-4 border-t border-gray-100 flex items-center gap-2 flex-wrap">
                <span className="text-xs text-gray-500">Active filters:</span>
                {caseName && (
                  <Badge variant="secondary" className="text-xs">
                    Name: {caseName}
                    <button
                      onClick={() => setCaseName("")}
                      className="ml-1 hover:text-red-500"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                )}
                {selectedStatus && (
                  <Badge variant="secondary" className="text-xs">
                    Status: {selectedStatus}
                    <button
                      onClick={() => setSelectedStatus("")}
                      className="ml-1 hover:text-red-500"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Results Count */}
        {!isLoading && !error && filteredCase && (
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500">
              Showing{" "}
              <span className="font-medium text-gray-900">
                {filteredCase.length}
              </span>{" "}
              of <span className="font-medium text-gray-900">{totalCases}</span>{" "}
              cases
            </p>
          </div>
        )}

        {/* Content Area */}
        <div className="min-h-[400px]">
          {isLoading ? (
            <div className="flex h-96 flex-col items-center justify-center gap-4">
              <div className="relative">
                <div className="absolute inset-0 bg-indigo-500/20 rounded-full blur-xl animate-pulse" />
                <Loading />
              </div>
              <p className="text-sm text-gray-500 animate-pulse">
                Loading case files...
              </p>
            </div>
          ) : error ? (
            <Card className="border-red-200 bg-red-50/50">
              <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                <div className="h-16 w-16 rounded-full bg-red-100 flex items-center justify-center mb-4">
                  <Gavel className="h-8 w-8 text-red-500" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Unable to load cases
                </h3>
                <p className="text-sm text-gray-500 max-w-sm mb-4">
                  There was a problem connecting to the database. Please try
                  refreshing the page.
                </p>
                <Button
                  onClick={() => window.location.reload()}
                  variant="outline"
                >
                  Refresh Page
                </Button>
              </CardContent>
            </Card>
          ) : filteredCase && filteredCase.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredCase.map((item) => {
                const status =
                  statusConfig[item.status] || statusConfig[CaseStatus.PENDING];
                const StatusIcon = status.icon;

                return (
                  <Link
                    key={item.id}
                    href={`case/${item.id}`}
                    className="block group"
                  >
                    <Card className="h-full overflow-hidden border border-gray-200 bg-white hover:border-gray-300 hover:shadow-xl hover:shadow-gray-200/50 transition-all duration-300 hover:-translate-y-1">
                      {/* Top accent bar */}
                      <div
                        className={cn(
                          "h-1.5 w-full transition-colors",
                          status.bgColor
                            .replace("bg-", "bg-")
                            .replace("50", "400"),
                        )}
                      />

                      <CardHeader className="pb-3">
                        <div className="flex justify-between items-start gap-3">
                          <div
                            className={cn(
                              "p-2.5 rounded-lg transition-colors",
                              status.bgColor,
                            )}
                          >
                            <FolderOpen
                              className={cn("h-5 w-5", status.color)}
                            />
                          </div>
                          <Badge
                            className={cn(
                              "font-medium text-xs px-2.5 py-1",
                              status.badgeColor,
                            )}
                          >
                            <StatusIcon className="h-3 w-3 mr-1" />
                            {status.label}
                          </Badge>
                        </div>

                        <div className="space-y-1 mt-3">
                          <CardTitle className="text-lg font-semibold text-gray-900 line-clamp-1 group-hover:text-indigo-600 transition-colors">
                            {item.title}
                          </CardTitle>
                          <CardDescription className="flex items-center gap-1.5 text-sm">
                            <span className="text-gray-400">Case #</span>
                            <span className="font-mono text-gray-600">
                              {item.caseNumber}
                            </span>
                          </CardDescription>
                        </div>
                      </CardHeader>

                      <CardContent className="space-y-4">
                        <div className="space-y-2.5">
                          <div className="flex items-center gap-3 text-sm">
                            <div className="h-8 w-8 rounded-md bg-gray-50 flex items-center justify-center">
                              <Gavel className="h-4 w-4 text-gray-400" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-xs text-gray-400 uppercase tracking-wider">
                                Court
                              </p>
                              <p className="text-gray-700 truncate">
                                {item.court || "Not specified"}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-3 text-sm">
                            <div className="h-8 w-8 rounded-md bg-gray-50 flex items-center justify-center">
                              <Calendar className="h-4 w-4 text-gray-400" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-xs text-gray-400 uppercase tracking-wider">
                                Created
                              </p>
                              <p className="text-gray-700">
                                {new Date(item.createdAt).toLocaleDateString(
                                  "en-US",
                                  {
                                    month: "short",
                                    day: "numeric",
                                    year: "numeric",
                                  },
                                )}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-3 text-sm">
                            <div className="h-8 w-8 rounded-md bg-gray-50 flex items-center justify-center">
                              <FileText className="h-4 w-4 text-gray-400" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-xs text-gray-400 uppercase tracking-wider">
                                Documents
                              </p>
                              <p className="text-gray-700">
                                {item.documents?.length || 0} files
                              </p>
                            </div>
                          </div>
                        </div>
                      </CardContent>

                      <CardFooter className="pt-0 pb-5">
                        <div className="w-full flex items-center justify-between pt-4 border-t border-gray-100 group-hover:border-gray-200 transition-colors">
                          <span className="text-sm font-medium text-gray-500 group-hover:text-indigo-600 transition-colors">
                            View Details
                          </span>
                          <div className="h-8 w-8 rounded-full bg-gray-50 group-hover:bg-indigo-50 flex items-center justify-center transition-colors">
                            <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-indigo-600 transform group-hover:translate-x-0.5 transition-all" />
                          </div>
                        </div>
                      </CardFooter>
                    </Card>
                  </Link>
                );
              })}
            </div>
          ) : (
            <Card className="border-dashed border-2 border-gray-200 bg-gray-50/50">
              <CardContent className="flex flex-col items-center justify-center py-20 text-center">
                <div className="relative mb-6">
                  <div className="absolute inset-0 bg-indigo-500/10 rounded-full blur-2xl" />
                  <div className="relative h-20 w-20 rounded-full bg-white shadow-lg flex items-center justify-center">
                    <Briefcase className="h-10 w-10 text-gray-300" />
                  </div>
                </div>

                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {hasFilters ? "No matching cases found" : "No cases yet"}
                </h3>
                <p className="text-sm text-gray-500 max-w-sm mb-6">
                  {hasFilters
                    ? "Try adjusting your search or filter criteria to find what you're looking for."
                    : "Get started by creating your first legal case. All your cases will appear here."}
                </p>

                {hasFilters ? (
                  <Button onClick={clearFilters} variant="outline">
                    <X className="h-4 w-4 mr-2" />
                    Clear Filters
                  </Button>
                ) : (
                  <CreateCaseDialog />
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default Case;

// Stat Card Component
interface StatCardProps {
  icon: React.ElementType;
  label: string;
  value: number;
  color: "indigo" | "blue" | "amber" | "emerald" | "slate";
}

const StatCard = ({ icon: Icon, label, value, color }: StatCardProps) => {
  const colorClasses = {
    indigo: "from-indigo-500 to-purple-600 shadow-indigo-500/20",
    blue: "from-blue-500 to-cyan-500 shadow-blue-500/20",
    amber: "from-amber-500 to-orange-500 shadow-amber-500/20",
    emerald: "from-emerald-500 to-teal-500 shadow-emerald-500/20",
    slate: "from-slate-500 to-gray-600 shadow-slate-500/20",
  };

  return (
    <Card className="border border-gray-200 hover:border-gray-300 transition-all duration-200 hover:shadow-md">
      <CardContent className="p-4">
        <div className="flex items-center gap-4">
          <div
            className={cn(
              "h-12 w-12 rounded-xl bg-gradient-to-br flex items-center justify-center shadow-lg",
              colorClasses[color],
            )}
          >
            <Icon className="h-6 w-6 text-white" />
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900">{value}</p>
            <p className="text-sm text-gray-500">{label}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
