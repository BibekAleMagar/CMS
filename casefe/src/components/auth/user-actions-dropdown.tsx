"use client";

import React from "react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
} from "@/src/components/ui/dropdown-menu";
import { Button } from "@/src/components/ui/button";
import { User } from "lucide-react";
import { useAuth } from "@/src/context/useAuth";
import { ShieldAlertIcon } from "lucide-react";

const UserActionDropDown = () => {
  const { user } = useAuth();

  return (
    <div className="flex gap-4 items-center">
      <DropdownMenu>
        <Button variant="outline" className="bg-white text-black">
          <ShieldAlertIcon className="mr-1" />
          {user?.role}
        </Button>
      </DropdownMenu>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            className="bg-white text-black cursor-pointer"
          >
            <User /> {user?.email || "-"}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="">
          <div className="flex flex-col gap-1">
            {/* <UserNameUpdateDialog username={user || ""} setUser={setUser} /> */}
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default UserActionDropDown;
