"use client";

import { redirect } from "next/navigation";
import { Button } from "../ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../ui/alert-dialog";

const LogoutDialog = () => {
  const handleLogout = async () => {
    // authClient.signOut();
    redirect("/login");
  };
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button className="cursor-pointer">Logout</Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="bg-white text-black">
        <AlertDialogHeader>
          <AlertDialogTitle>Logout?</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to logout?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="bg-white cursor-pointer">Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleLogout} className="cursor-pointer">Confirm</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default LogoutDialog;
