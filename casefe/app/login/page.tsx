"use client";
import React, { use } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import Link from "next/link";
import { Form } from "@/src/components/ui/form";
import { loginSchema } from "@/src/validators/Login";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginType } from "@/src/types/Login";
import { useLogin } from "@/src/hooks/mutation/Login";
import { useRouter } from "next/navigation";
import { sweetAlert } from "@/src/lib/helper";
import { AxiosError } from "axios";
import { Label } from "@radix-ui/react-label";

const Login: React.FC = () => {
  const form = useForm<LoginType>({
    resolver: zodResolver(loginSchema),
    values: {
      email: "",
      password: "",
    }
  });
  const router = useRouter();
  const {mutateAsync, isPending} = useLogin();
  const onSubmit = async(data: LoginType) => {
    const payload: LoginType ={
      ...data
    }
    try {
      const res = await mutateAsync({
        url: "/auth/login",
        payload,
        successMessage: "login Succesful"
      });
      if(res?.accessToken){
        sessionStorage.setItem("token", res.accessToken)
        sweetAlert.success("Login Successful");
        router.push("/protected/dashboard")
      }
    }catch(error) {
      if(error instanceof AxiosError) {
        const message = error.response?.data?.error_description || 
          error.response?.data?.message ||
          "Invalid Credentials";
          form.setError("root", {message})
      }else if(error instanceof Error) {
        form.setError("root", {message: error.message})
      } else {
        form.setError("root", {message: "Login Failed"})
      }
    }

  }
  


  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-[url('/hero.jpeg')] ">

      <div className=" rounded-lg shadow-2xl overflow-hidden w-full max-w-4xl grid md:grid-cols-2 bg-white/50">
        
        {/* Banner Section */}
        <div className="hidden md:flex items-center justify-center bg-gray-100 p-8 bg-[url('/login.png')] bg-no-repeat bg-cover bg-center ">
          
        </div>

        <div className="flex flex-col justify-center p-8">
          <div className="mb-8 text-center">
            <h1 className="text-2xl md:text-3xl font-bold text-black mb-2">Welcome Back</h1>
            <p className="text-black">Welcome back, please enter your details</p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="flex flex-col">
              <Label className="text-black">Email</Label>
              <Input name="email" type="email" placeholder="Email" className="text-black" />
            </div>

            <div className="flex flex-col">
              <Label className="text-black">Password</Label>
              <Input name="password" type="password" placeholder="Password" className="text-black"  />
              
            </div>

            <Button
              type="submit"
              className="w-full bg-purple-600 text-white font-semibold py-3 rounded-md hover:bg-purple-700 transition-colors"
            >
              Sign In
            </Button>

            </form>
          </Form>

          <p className="mt-6 text-center text-gray-600">
            Don't have an account? <Link href="/register" className="text-purple-600 hover:underline">Sign up</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;

