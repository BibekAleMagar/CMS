"use client";

import { Form } from "@/src/components/ui/form";
import { useForm } from "react-hook-form";
import { useParams } from "next/navigation";
import {
  ChevronLeft,
  Calendar,
  Gavel,
  FileText,
  Clock,
  ShieldCheck,
  Briefcase,
  UserCircle,
  CircleAlert,
  CircleCheck,
  Home,
  Download,
  ExternalLink,
  MoreVertical,
  File,
  FileImage,
  FileSpreadsheet,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Hourglass,
  Calendar1,
  Speaker,
} from "lucide-react";
import Link from "next/link";

import { Button } from "@/src/components/ui/button";
import { Badge } from "@/src/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/src/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/src/components/ui/accordion";
import { useCaseById } from "@/src/hooks/query/case";
import BackButton from "@/src/common/BackButton";
import { AddDocumentDialog } from "@/src/components/pages/documents/CreateDocument";
import { AssignLawyerDialog } from "@/src/components/pages/lawyer/AssignLawyer";
import { useAuth } from "@/src/context/useAuth";
import { UserRole } from "@/src/types/enums/user-role.enum";
import { useEffect } from "react";
import { UpdateCaseStatus } from "@/src/components/pages/Case/UpdateCaseStatus";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
} from "@/src/components/ui/dialog";
import { CaseStatus } from "@/src/types/enums/case-status.enum";
import { useUpdateCaseStatus } from "@/src/hooks/mutation/case";
import { Separator } from "@/src/components/ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/src/components/ui/dropdown-menu";
import { cn } from "@/src/lib/utils";
import { AddCaseHearingDate } from "@/src/components/pages/Case/AdddCaseHearingDate";

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

const getFileIcon = (fileName: string) => {
  const ext = fileName.split(".").pop()?.toLowerCase();
  switch (ext) {
    case "pdf":
      return <File className="h-5 w-5 text-red-500" />;
    case "doc":
    case "docx":
      return <FileText className="h-5 w-5 text-blue-500" />;
    case "jpg":
    case "jpeg":
    case "png":
      return <FileImage className="h-5 w-5 text-purple-500" />;
    case "xls":
    case "xlsx":
      return <FileSpreadsheet className="h-5 w-5 text-green-500" />;
    default:
      return <File className="h-5 w-5 text-gray-500" />;
  }
};

const CaseDetails = () => {
  const { user } = useAuth();
  const params = useParams();
  const id = Number(params.id);
  const { data } = useCaseById(id);
  const form = useForm({
    values: {
      status: data?.status,
    },
  });

  const { mutate: updateCaseStatus } = useUpdateCaseStatus();

  if (!data) return null;

  const status = statusConfig[data.status] || statusConfig[CaseStatus.PENDING];
  const StatusIcon = status.icon;

  return (
    <div className="min-h-screen bg-gray-50/50 pb-12">
      {/* Header Section */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <BackButton />
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-sm">
                  <Briefcase className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-semibold text-gray-900 tracking-tight">
                    {data.title}
                  </h1>
                  <p className="text-sm text-gray-500 font-medium">
                    Case #{data.caseNumber}
                  </p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {user?.role === UserRole.CLIENT && !data.lawyer && (
                <AssignLawyerDialog />
              )}
              {user?.role === UserRole.LAWYER && (
                <>
                  <AddCaseHearingDate caseId={id} />
                  <UpdateCaseStatus />
                </>
              )}
              <AddDocumentDialog />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Status Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Status Card */}
          <Card className={cn("border-2 overflow-hidden", status.borderColor)}>
            <CardContent className="p-0">
              <div className={cn("p-4", status.bgColor)}>
                <div className="flex items-center gap-3">
                  <div
                    className={cn(
                      "p-2 rounded-lg bg-white/80 backdrop-blur",
                      status.color,
                    )}
                  >
                    <StatusIcon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                      Status
                    </p>
                    <p className={cn("text-lg font-bold", status.color)}>
                      {status.label}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Date Created Card */}
          <Card className="border border-gray-200 hover:border-gray-300 transition-colors">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600">
                  <Calendar className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Date Created
                  </p>
                  <p className="text-sm font-semibold text-gray-900">
                    {new Date(data.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Client/Lawyer Card */}
          <Card className="border border-gray-200 hover:border-gray-300 transition-colors">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600">
                  <UserCircle className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                    {user?.role === UserRole.CLIENT
                      ? "Assigned Lawyer"
                      : "Client"}
                  </p>
                  <p className="text-sm font-semibold text-gray-900 truncate">
                    {user?.role === UserRole.CLIENT
                      ? data?.lawyer
                        ? `${data.lawyer.firstName} ${data.lawyer.lastName}`
                        : "Not Assigned"
                      : `${data?.client?.firstName} ${data?.client?.lastName}`}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Court Card */}
          <Card className="border border-gray-200 hover:border-gray-300 transition-colors">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-amber-50 text-amber-600">
                  <Gavel className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Court
                  </p>
                  <p className="text-sm font-semibold text-gray-900 truncate">
                    {data.court || "Not Specified"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Case Information */}
          <div className="lg:col-span-2 space-y-6">
            {/* Case Information Accordion */}
            <Card className="border border-gray-200 shadow-sm">
              <Accordion type="single" collapsible defaultValue="case-info">
                <AccordionItem value="case-info" className="border-0">
                  <AccordionTrigger className="px-6 py-4 hover:no-underline hover:bg-gray-50/50 rounded-t-lg [&[data-state=open]]:rounded-b-none">
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-sm">
                        <FileText className="h-4 w-4 text-white" />
                      </div>
                      <div className="text-left">
                        <p className="font-semibold text-gray-900">
                          Case Information
                        </p>
                        <p className="text-xs text-gray-500">
                          View detailed case details
                        </p>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-6 pb-6">
                    <Separator className="mb-6" />

                    {/* Description */}
                    {data.description && (
                      <div className="mb-6">
                        <h4 className="text-sm font-semibold text-gray-900 mb-2 flex items-center gap-2">
                          <FileText className="h-4 w-4 text-gray-400" />
                          Description
                        </h4>
                        <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                          <p className="text-sm text-gray-700 leading-relaxed">
                            {data.description}
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Info Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <InfoItem
                        icon={<StatusIcon className="h-4 w-4" />}
                        label="Current Status"
                        value={status.label}
                        bgColor={status.bgColor}
                        textColor={status.color}
                      />

                      <InfoItem
                        icon={<Speaker className="h-4 w-4" />}
                        label="Next Hearing"
                        value={
                          data?.nextHearing
                            ? new Date(data.nextHearing).toLocaleString(
                                "en-US",
                                {
                                  month: "short",
                                  day: "numeric",
                                  year: "numeric",
                                },
                              )
                            : "Not Scheduled"
                        }
                        bgColor={status.bgColor}
                        textColor={status.color}
                      />

                      <InfoItem
                        icon={<Calendar className="h-4 w-4" />}
                        label="Created Date"
                        value={new Date(data.createdAt).toLocaleString(
                          "en-US",
                          {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          },
                        )}
                        bgColor="bg-indigo-50"
                        textColor="text-indigo-600"
                      />

                      {user?.role === UserRole.LAWYER && (
                        <InfoItem
                          icon={<UserCircle className="h-4 w-4" />}
                          label="Client Name"
                          value={`${data?.client?.firstName} ${data?.client?.lastName}`}
                          bgColor="bg-emerald-50"
                          textColor="text-emerald-600"
                        />
                      )}

                      {user?.role === UserRole.CLIENT && (
                        <InfoItem
                          icon={<UserCircle className="h-4 w-4" />}
                          label="Assigned Lawyer"
                          value={
                            data?.lawyer
                              ? `${data.lawyer.firstName} ${data.lawyer.lastName}`
                              : "Not Assigned"
                          }
                          bgColor="bg-emerald-50"
                          textColor="text-emerald-600"
                        />
                      )}

                      {data.court && (
                        <InfoItem
                          icon={<Gavel className="h-4 w-4" />}
                          label="Court"
                          value={data.court}
                          bgColor="bg-amber-50"
                          textColor="text-amber-600"
                        />
                      )}

                      <InfoItem
                        icon={<Briefcase className="h-4 w-4" />}
                        label="Case Number"
                        value={data.caseNumber}
                        bgColor="bg-purple-50"
                        textColor="text-purple-600"
                      />
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </Card>

            {/* Case Documents Accordion */}
            <Card className="border border-gray-200 shadow-sm">
              <Accordion type="single" collapsible defaultValue="documents">
                <AccordionItem value="documents" className="border-0">
                  <AccordionTrigger className="px-6 py-4 hover:no-underline hover:bg-gray-50/50 rounded-t-lg [&[data-state=open]]:rounded-b-none">
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-rose-500 to-orange-500 flex items-center justify-center shadow-sm">
                        <Briefcase className="h-4 w-4 text-white" />
                      </div>
                      <div className="text-left">
                        <p className="font-semibold text-gray-900">
                          Case Documents
                        </p>
                        <p className="text-xs text-gray-500">
                          {data?.documents?.length || 0} document(s) attached
                        </p>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-6 pb-6">
                    <Separator className="mb-6" />

                    {data?.documents && data.documents.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {data.documents.map((document) => {
                          const ext = document.fileName
                            .split(".")
                            .pop()
                            ?.toLowerCase();
                          const pdfUrl =
                            ext === "pdf"
                              ? document.filePath.replace(
                                  "/raw/upload/",
                                  "/image/upload/fl_attachment:inline/",
                                )
                              : "";

                          return (
                            <Card
                              key={document.id}
                              className="group border border-gray-200 hover:border-gray-300 hover:shadow-md transition-all duration-200 overflow-hidden"
                            >
                              <CardContent className="p-0">
                                {/* Document Preview */}
                                <div
                                  className="relative h-40 bg-gray-100 cursor-pointer overflow-hidden"
                                  onClick={() =>
                                    window.open(document.filePath, "_blank")
                                  }
                                >
                                  {ext === "pdf" ? (
                                    <iframe
                                      src={pdfUrl}
                                      className="w-full h-full border-0 pointer-events-none"
                                      title={document.fileName}
                                    />
                                  ) : ext === "doc" || ext === "docx" ? (
                                    <div className="w-full h-full flex items-center justify-center bg-blue-50">
                                      <FileText className="h-16 w-16 text-blue-300" />
                                    </div>
                                  ) : ["jpg", "jpeg", "png"].includes(
                                      ext || "",
                                    ) ? (
                                    <img
                                      src={document.filePath}
                                      alt={document.fileName}
                                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                    />
                                  ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-gray-50">
                                      {getFileIcon(document.fileName)}
                                    </div>
                                  )}

                                  {/* Hover Overlay */}
                                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-2">
                                    <Button
                                      size="sm"
                                      variant="secondary"
                                      className="gap-1"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        window.open(
                                          document.filePath,
                                          "_blank",
                                        );
                                      }}
                                    >
                                      <ExternalLink className="h-3 w-3" />
                                      View
                                    </Button>
                                  </div>
                                </div>

                                {/* Document Info */}
                                <div className="p-4">
                                  <div className="flex items-start justify-between gap-2">
                                    <div className="flex items-center gap-2 min-w-0">
                                      {getFileIcon(document.fileName)}
                                      <p className="text-sm font-medium text-gray-900 truncate">
                                        {document.fileName}
                                      </p>
                                    </div>
                                    <DropdownMenu>
                                      <DropdownMenuTrigger asChild>
                                        <Button
                                          variant="ghost"
                                          size="icon"
                                          className="h-8 w-8 shrink-0"
                                        >
                                          <MoreVertical className="h-4 w-4" />
                                        </Button>
                                      </DropdownMenuTrigger>
                                      <DropdownMenuContent align="end">
                                        <DropdownMenuItem
                                          onClick={() =>
                                            window.open(
                                              document.filePath,
                                              "_blank",
                                            )
                                          }
                                        >
                                          <ExternalLink className="h-4 w-4 mr-2" />
                                          Open
                                        </DropdownMenuItem>
                                        <DropdownMenuItem
                                        // onClick={() => {
                                        //   // Ensure you use the variable from your map/loop, not the global 'document'
                                        //   const link =
                                        //     document.createElement("a");
                                        //   link.href = doc.filePath; // Changed from document.filePath
                                        //   link.download = doc.fileName; // Changed from document.fileName
                                        //   link.target = "_blank"; // Good practice for external links
                                        //   document.body.appendChild(link); // Append to body to ensure it works in all browsers
                                        //   link.click();
                                        //   document.body.removeChild(link); // Clean up
                                        // }}
                                        >
                                          <Download className="h-4 w-4 mr-2" />
                                          Download
                                        </DropdownMenuItem>
                                      </DropdownMenuContent>
                                    </DropdownMenu>
                                  </div>
                                  <p className="text-xs text-gray-500 mt-1 ml-7">
                                    {ext?.toUpperCase()} Document
                                  </p>
                                </div>
                              </CardContent>
                            </Card>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="text-center py-12 bg-gray-50 rounded-lg border border-dashed border-gray-200">
                        <Briefcase className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                        <p className="text-gray-500 font-medium">
                          No documents yet
                        </p>
                        <p className="text-sm text-gray-400 mt-1">
                          Add documents to this case to keep everything
                          organized
                        </p>
                      </div>
                    )}
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </Card>
          </div>

          {/* Right Column - Quick Info */}
          <div className="space-y-6">
            {/* Case Summary Card */}
            <Card className="border border-gray-200 shadow-sm">
              <CardHeader className="pb-4">
                <CardTitle className="text-base font-semibold flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-indigo-600" />
                  Case Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between py-2 border-b border-gray-100">
                  <span className="text-sm text-gray-500">Case Number</span>
                  <span className="text-sm font-medium text-gray-900">
                    {data.caseNumber}
                  </span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-gray-100">
                  <span className="text-sm text-gray-500">Status</span>
                  <Badge className={cn("font-medium", status.badgeColor)}>
                    {status.label}
                  </Badge>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-gray-100">
                  <span className="text-sm text-gray-500">Created</span>
                  <span className="text-sm font-medium text-gray-900">
                    {new Date(data.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center justify-between py-2">
                  <span className="text-sm text-gray-500">Documents</span>
                  <span className="text-sm font-medium text-gray-900">
                    {data?.documents?.length || 0}
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Assigned Parties Card */}
            <Card className="border border-gray-200 shadow-sm">
              <CardHeader className="pb-4">
                <CardTitle className="text-base font-semibold flex items-center gap-2">
                  <UserCircle className="h-4 w-4 text-emerald-600" />
                  Assigned Parties
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Client */}
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="h-10 w-10 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white font-semibold text-sm">
                    {data?.client?.firstName?.[0]}
                    {data?.client?.lastName?.[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {data?.client?.firstName} {data?.client?.lastName}
                    </p>
                    <p className="text-xs text-gray-500">Client</p>
                  </div>
                </div>

                {/* Lawyer */}
                {data?.lawyer ? (
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-white font-semibold text-sm">
                      {data.lawyer.firstName?.[0]}
                      {data.lawyer.lastName?.[0]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {data.lawyer.firstName} {data.lawyer.lastName}
                      </p>
                      <p className="text-xs text-gray-500">Assigned Lawyer</p>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-3 p-3 bg-amber-50 border border-amber-100 rounded-lg">
                    <div className="h-10 w-10 rounded-full bg-amber-200 flex items-center justify-center">
                      <AlertCircle className="h-5 w-5 text-amber-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-amber-900">
                        No Lawyer Assigned
                      </p>
                      <p className="text-xs text-amber-700">
                        {user?.role === UserRole.CLIENT
                          ? "Assign a lawyer to proceed"
                          : "Waiting for assignment"}
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Court Info Card */}
            {data.court && (
              <Card className="border border-gray-200 shadow-sm">
                <CardHeader className="pb-4">
                  <CardTitle className="text-base font-semibold flex items-center gap-2">
                    <Gavel className="h-4 w-4 text-amber-600" />
                    Court Information
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-3 p-3 bg-amber-50 rounded-lg">
                    <div className="h-10 w-10 rounded-full bg-amber-200 flex items-center justify-center">
                      <Home className="h-5 w-5 text-amber-700" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {data.court}
                      </p>
                      <p className="text-xs text-gray-500">Jurisdiction</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CaseDetails;

interface InfoItemProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  bgColor: string;
  textColor: string;
}

const InfoItem = ({
  icon,
  label,
  value,
  bgColor,
  textColor,
}: InfoItemProps) => (
  <div className="flex items-center gap-3 p-3 rounded-lg border border-gray-100 bg-white hover:border-gray-200 hover:shadow-sm transition-all duration-200">
    <div
      className={cn(
        "h-9 w-9 rounded-lg flex items-center justify-center shrink-0",
        bgColor,
        textColor,
      )}
    >
      {icon}
    </div>
    <div className="min-w-0 flex-1">
      <p className="text-xs text-gray-500 mb-0.5">{label}</p>
      <p className="text-sm font-semibold text-gray-900 truncate">{value}</p>
    </div>
  </div>
);
