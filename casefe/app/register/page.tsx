"use client";
import React from "react";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Form } from "@/src/components/ui/form";
import { useForm } from "react-hook-form";
import { Label } from "@/src/components/ui/label";
import { SelectElement } from "@/src/components/ui/select";
import { UserRole } from "@/src/types/enums/user-role.enum";
import { RegisterType } from "@/src/types/register";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema } from "@/src/validators/register";
import { useRegister } from "@/src/hooks/mutation/register";
import { useRouter } from "next/navigation";
import { AxiosError } from "axios";
import { CommaSeparatedInput } from "@/src/common/CommaSeperator";
import { useLawyer } from "@/src/hooks/query/lawyer";

const userRolesArray = Object.values(UserRole).map((role) => ({
  value: role,
  label: role
    .replace("_", " ")
    .toLowerCase()
    .replace(/\b\w/g, (c) => c.toUpperCase()), // optional formatting
}));

const Register: React.FC = () => {
  const router = useRouter();

  const form = useForm<RegisterType>({
    resolver: zodResolver(registerSchema),
    values: {
      email: "",
      password: "",
      firstName: "",
      lastName: "",
      role: UserRole.CLIENT,
      phoneNumber: "",
      avatar: undefined,
      specializations: [],
      experience: 0,
    },
  });
  const role = form.watch("role");
  const { data: lawyers } = useLawyer();
  console.log("Available lawyers:", lawyers);
  const { mutateAsync, isPending } = useRegister();
  const onSubmit = async (data: RegisterType) => {
    console.log("Submitting data:", data);
    debugger;
    try {
      const res = await mutateAsync({
        payload: data,
        url: "/auth/register",
        successMessage: "Registered Successfully",
      });
      router.push("/login");
    } catch (error) {
      if (error instanceof AxiosError) {
        const message =
          error.response?.data?.error?.message ||
          error.response?.data?.error_description ||
          error.response?.data?.message ||
          error?.message ||
          "Unexpected error";
        form.setError("root", { message });
      } else if (error instanceof Error) {
        form.setError("root", { message: error.message });
      } else {
        form.setError("root", { message: "Login failed" });
      }
    }
  };
  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-[url('/hero.jpeg')]">
      <div className="rounded-lg shadow-2xl overflow-hidden w-full max-w-4xl grid md:grid-cols-2 bg-white/50">
        <div className="hidden md:flex items-center justify-center bg-gray-100 p-8 bg-[url('/login.png')] bg-no-repeat bg-cover bg-center" />

        <div className="flex flex-col justify-center p-8 bg-white">
          <div className="mb-8 text-center">
            <h1 className="text-2xl md:text-3xl font-bold text-black mb-2">
              Create Account
            </h1>
            <p className="text-black">Sign up to get started with our system</p>
          </div>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-4 text-black"
            >
              <div>
                <Label>Email *</Label>
                <Input<RegisterType>
                  name="email"
                  placeholder="johndoe@example.com"
                />
              </div>
              <div>
                <Label>Password *</Label>
                <Input<RegisterType>
                  name="password"
                  type="password"
                  placeholder="********"
                />
              </div>
              <div>
                <Label>FirstName *</Label>
                <Input name="firstName" placeholder="John" />
              </div>
              <div>
                <Label>LastName *</Label>
                <Input<RegisterType> name="lastName" placeholder="Doe" />
              </div>
              <div>
                <Label className="mb-2">Role *</Label>
                <SelectElement<RegisterType>
                  name="role"
                  data={userRolesArray.map((role) => ({
                    label: role.label,
                    value: role.value,
                  }))}
                />
              </div>
              <div>
                <Label>Phone Number *</Label>
                <Input<RegisterType>
                  name="phoneNumber"
                  placeholder="98********"
                />
              </div>
              {role === UserRole.LAWYER && (
                <>
                  <div>
                    <Label>Specializations (comma separated) *</Label>
                    <CommaSeparatedInput
                      name="specializations"
                      placeholder="e.g. Divorce, Criminal Law"
                    />
                    {form.formState.errors.specializations && (
                      <p className="text-sm text-red-500 mt-1">
                        {form.formState.errors.specializations.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <Label>Experience (in years) *</Label>
                    <Input name="experience" type="number" placeholder="5" />
                  </div>
                </>
              )}
              <div>
                <Label>ProfileImage</Label>
                <input
                  name="avatar"
                  className="text-black mt-2 p-1 text-sm rounded w-full border"
                  type="File"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    form.setValue("avatar", file, { shouldValidate: true });
                  }}
                  accept="image/*"
                />
              </div>

              <Button type="submit" disabled={isPending} className="w-full">
                Register{" "}
              </Button>
              {form.formState.errors.root && (
                <div className="text-sm text-red-500 text-center">
                  {form.formState.errors.root.message}
                </div>
              )}
            </form>
          </Form>

          <p className="mt-6 text-center text-gray-600">
            Already have an account?{" "}
            <a href="/login" className="text-purple-600 hover:underline">
              Sign in
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
