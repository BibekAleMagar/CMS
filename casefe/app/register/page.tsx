// Register.tsx
import React from "react";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Form } from "@/src/components/ui/form";
import {useForm} from "react-hook-form"


const Register: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-[url('/hero.jpeg')]">

      <div className="rounded-lg shadow-2xl overflow-hidden w-full max-w-4xl grid md:grid-cols-2 bg-white/50">
        
        {/* Banner Section */}
        <div className="hidden md:flex items-center justify-center bg-gray-100 p-8 bg-[url('/login.png')] bg-no-repeat bg-cover bg-center" />

        {/* Form Section */}
        <div className="flex flex-col justify-center p-8">
          <div className="mb-8 text-center">
            <h1 className="text-2xl md:text-3xl font-bold text-black mb-2">
              Create Account
            </h1>
            <p className="text-black">
              Sign up to get started with our system
            </p>
          </div>

          <form className="space-y-4">
            
            {/* Full Name */}
            <div className="flex flex-col">
              <label className="mb-1 font-medium text-black">
                Full Name
              </label>
              <input
                type="text"
                placeholder="Enter your full name"
                className="border border-gray-300 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-400"
              />
            </div>

            {/* Email */}
            <div className="flex flex-col">
              <label className="mb-1 font-medium text-black">
                Email
              </label>
              <input
                type="email"
                placeholder="Enter your email"
                className="border border-gray-300 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-400"
              />
            </div>

            {/* Password */}
            <div className="flex flex-col">
              <label className="mb-1 font-medium text-black">
                Password
              </label>
              <input
                type="password"
                placeholder="Create a password"
                className="border border-gray-300 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-400"
              />
            </div>

            {/* Confirm Password */}
            <div className="flex flex-col">
              <label className="mb-1 font-medium text-black">
                Confirm Password
              </label>
              <input
                type="password"
                placeholder="Confirm your password"
                className="border border-gray-300 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-400"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-purple-600 text-white font-semibold py-3 rounded-md hover:bg-purple-700 transition-colors"
            >
              Sign Up
            </button>
          </form>

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
