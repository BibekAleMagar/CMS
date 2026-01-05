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
import Login from "../../../app/login/page";

const UserActionDropDown = () => {
  const { user } = useAuth();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="bg-white text-black cursor-pointer">
          <User /> {user?.email || "-"}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="">
        <div className="flex flex-col gap-1">
          {/* <UserNameUpdateDialog username={user || ""} setUser={setUser} /> */}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserActionDropDown;
