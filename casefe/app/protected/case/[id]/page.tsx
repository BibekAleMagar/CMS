"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { 
    ChevronLeft, 
    Calendar, 
    Gavel, 
    FileText, 
    Clock, 
    MoreVertical, 
    User,
    ShieldCheck
} from "lucide-react";

import { Button } from "@/src/components/ui/button";
import { Badge } from "@/src/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/src/components/ui/tabs";
import Case from "../page";

const CaseDetails = () => {
    const params = useParams();
    const id = params.id;

    // In a real app, fetch data here using:
    // const { data: caseData } = useSingleCase(id);

    return (
      <>
      </>
    )
};



export default CaseDetails