import { createCaseDocumentSchema } from "@/src/validators/document";
import { useAuth } from "@/src/context/useAuth";
import { useAddDocument } from "@/src/hooks/mutation/document";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Form } from "../../ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../../ui/dialog";
import { Button } from "../../ui/button";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "../../ui/form";
import { Textarea } from "../../ui/textarea";
import { CreateDocumentDto } from "@/src/types/document";
import { useParams } from "next/navigation";
import { Label } from "../../ui/label";


export const AddDocumentDialog = () => {
    const {user} = useAuth();
    const param = useParams();
    const id = Number(param.id);
    const [isOpen, setIsopen] = useState(false);
    const {mutateAsync, isPending} = useAddDocument();
    const form = useForm<CreateDocumentDto>({
        defaultValues: {
           caseId: id,
           description: "",

        },

        resolver:zodResolver(createCaseDocumentSchema)
        
    })
    const onSubmit = (data: CreateDocumentDto) => {
        mutateAsync({
            url: "/documents/upload",
            payload: data,
            successMessage: "case Created successfully"
        })
        setIsopen(false)

    }

    return (
        <>
            <Dialog open={isOpen} onOpenChange={(open) => {setIsopen(open), form.reset()}}>
                <DialogTrigger asChild>
                    <Button className="cursor-pointer">Add Document</Button>
                </DialogTrigger>
                <DialogContent onInteractOutside={(e) => e.preventDefault()} className="lg:min-w-4xl">
                    <DialogHeader>
                        <DialogTitle>Add Case</DialogTitle>
                    </DialogHeader>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)}>
                            <div className="">
                                <Label>Document</Label>
                                <input name="file" className="text-black mt-2 p-1 text-sm rounded w-full border" type="File"
                                    onChange={(e) => {
                                    const file = e.target.files?.[0]
                                    if(!file) return;
                                    form.setValue("file", file, {shouldValidate: true})
                                    }}
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
                            <Button type="submit" className="cursor-pointer" disabled={isPending}>{isPending? "Creating ..." : "Create"}</Button>
                        </form>
                    </Form>
                </DialogContent>
            </Dialog>
        </>
    )
}