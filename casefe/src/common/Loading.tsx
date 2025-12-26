import { Loader } from "lucide-react";

export const Loading = () => {
    return (
        <div className="h-screen flex justify-center mt-10">
            <Loader size={36} className="animate-spin font-bold" />
        </div>
    )
}