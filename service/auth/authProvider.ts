"use client";

import { useEffect } from "react";
import { getMe } from "@/service/auth";
import { useUserStore } from "@/store/userStore";
import Cookies from "js-cookie";
import { usePathname } from "next/navigation";

export const AuthProvider = () => {
  const setUser = useUserStore((state) => state.setUser);
  const pathname = usePathname();

  useEffect(() => {
    if (pathname === "/login") return;

    const fetchUser = async () => {
      try {
        const res = await getMe();
        const userData = res?.data;

        if (userData) {
          const user = {
            id: userData.id,
            username: userData.username,
            token: Cookies.get("token") || "",
            role: userData.role,
          };
          setUser(user);
        }
      } catch (error) {
        console.error("getMe xatosi:", error);
      }
    };

    fetchUser();
  }, [setUser]);

  return null;
};
