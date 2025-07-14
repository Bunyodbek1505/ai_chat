"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import fizmaSoftlogoDark from "@/public/logo1.svg";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Icon } from "@iconify/react/dist/iconify.js";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  return (
    <div className="h-screen bg-[var(--chatArea)] flex items-center justify-center px-4">
      <form className="bg-white dark:bg-[var(--background)] rounded-xl shadow-lg p-8 w-full max-w-md text-[var(--foreground)] space-y-6 border border-[var(--border)]">
        <div className="flex flex-col items-center space-y-2">
          <Image
            src={fizmaSoftlogoDark}
            alt="FizmaSoft Logo"
            width={48}
            height={48}
            className="rounded-full"
          />
          <h1 className="text-xl font-semibold">Welcome back 👋</h1>
          <p className="text-sm text-muted-foreground">
            Please enter your credentials
          </p>
        </div>

        <div className="space-y-4">
          <div>
            <Input type="text" placeholder="Username" />
          </div>
          <div className="relative">
            <Input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              className="pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 "
            >
              <Icon
                icon={showPassword ? "mdi:eye-off-outline" : "mdi:eye-outline"}
                className="w-5 h-5 cursor-pointer"
              />
            </button>
          </div>
        </div>

        <Button
          variant="outline"
          type="submit"
          className="w-full bg-[var(--primary)] hover:bg-opacity-90 text-white font-medium py-2 px-4 rounded-md transition cursor-pointer"
        >
          Login
        </Button>
      </form>
    </div>
  );
};

export default Login;
