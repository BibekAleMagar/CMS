"use client";

import { PageHeader } from "@/src/common/PageHeader";
import { CreateCaseDialog } from "@/src/components/pages/Case/CreateCase";
import { useCase } from "@/src/hooks/query/case";
const Case = () => {
    const {data} = useCase();
    console.log(data)
    return (
        <>
        <PageHeader heading="Your Cases" />
        <div className="flex justify-end">
            <CreateCaseDialog />
        </div>
        </>
    )
}

export default Case;