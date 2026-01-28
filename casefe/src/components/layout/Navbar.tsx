"use server";
import React from "react";
import LogoutDialog from "../auth/logout-dialog";
import UserActionDropDown from "../auth/user-actions-dropdown";

export default async function Navbar() {
  return (
    <nav className="bg-gray-100 px-4 py-3 flex justify-end items-center gap-4">
      <UserActionDropDown />
      <LogoutDialog />
    </nav>
  );
}
