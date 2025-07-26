/* eslint-disable react/no-unescaped-entities */
"use client";

import React, { useLayoutEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import fizmaSoftlogoDark from "@/public/logo1.svg";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Icon } from "@iconify/react/dist/iconify.js";
import { getMe, loginUser } from "@/service/auth";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/store/userStore";
import { toast } from "react-toastify";
import loginBg from "@/public/login_bg.png";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);

  const router = useRouter();

  const token = Cookies.get("token");

  useLayoutEffect(() => {
    if (token) {
      router.push("/");
    }
  }, []);

  const handleLogin = async (
    e: React.FormEvent<HTMLFormElement>,
    username: string,
    password: string
  ) => {
    e.preventDefault();
    try {
      const res = await loginUser({ username, password });
      if (!res || !res.data?.token) {
        throw new Error("Login failed: No token returned");
      }
      Cookies.set("token", res.data.token);

      //  getMe orqali foydalanuvchini olish
      const userRes = await getMe();
      const userData = userRes?.data;

      if (!userData) throw new Error("Foydalanuvchi ma'lumotlari olinmadi");

      const user = {
        id: res.data.id,
        username: res.data.username,
        token: res.data.token,
        role: userData.role,
      };
      useUserStore.getState().setUser(user);

      toast.success("Welcome, " + res.data.username + " 🎉");
      router.push("/");
    } catch (err: any) {
      console.error("Login error", err);
      toast.error(
        "Login failed: " + (err?.response?.data?.message || err.message)
      );
    }
  };

  return (
    <div className="relative h-screen w-screen">
      <Image
        src={loginBg}
        alt="Login Background"
        layout="fill"
        objectFit="cover"
        className="z-0"
      />
      <div className="absolute inset-0 bg-black/40 z-10 flex items-center justify-center px-4">
        <form
          onSubmit={(e) => handleLogin(e, username, password)}
          className="relative z-20 backdrop-blur-md bg-white/5 border border-white/10 rounded-xl p-8 w-full max-w-sm space-y-6 text-white"
        >
          <div className="flex flex-col items-center space-y-2">
            <Image
              src={fizmaSoftlogoDark}
              alt="FizmaSoft Logo"
              width={48}
              height={48}
              className="rounded-full"
            />
            <h1 className="text-xl font-semibold text-center">
              Enter your login and password to log in to the "Fizmasoft AI"
              system.
            </h1>
          </div>

          <div className="space-y-4">
            <div>
              <Input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="outline-none border-none"
              />
            </div>
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pr-10"
                // style={{ border: "1px solid red" }}
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 "
              >
                <Icon
                  icon={
                    showPassword ? "mdi:eye-off-outline" : "mdi:eye-outline"
                  }
                  className="w-5 h-5 cursor-pointer"
                />
              </button>
            </div>
          </div>

          <Button
            type="submit"
            className="w-full bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white font-medium py-2 px-4 rounded-md transition cursor-pointer"
          >
            Login
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Login;
