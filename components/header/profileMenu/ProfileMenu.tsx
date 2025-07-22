"use client";

import React, { useRef, useEffect, useState } from "react";
import { Icon } from "@iconify/react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useUserStore } from "@/store/userStore";
import { useLogout } from "@/hooks/useLogout";

interface ProfileMenuProps {
  onSettings: () => void;
}

const ProfileMenu = ({ onSettings }: ProfileMenuProps) => {
  const [, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const username = useUserStore((s) => s.user?.username);
  const role = useUserStore((s) => s.user?.role);
  const logout = useLogout();

  const handleClickOutside = (event: MouseEvent) => {
    if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
      setOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div
      ref={menuRef}
      className="absolute right-0 top-full mt-3 w-[270px] rounded-xl  bg-sidebar shadow-2xl z-100 text-[var(--foreground)] overflow-hidden"
    >
      {/* User Info */}
      <div className="px-4 py-3 border-b border-[var(--border)] flex items-center gap-3">
        <div>
          <div className="font-semibold text-sm"> {username}</div>
        </div>
      </div>

      {/* Action Items */}
      <div className="py-2 px-1 text-sm">
        {role === "admin" && (
          <button
            onClick={onSettings}
            className="w-full px-4 py-2 text-left hover:bg-[var(--accent)] rounded-sm transition-all cursor-pointer"
          >
            <Icon
              icon="solar:settings-linear"
              className="inline-block w-4 h-4 mr-2"
            />
            Settings
          </button>
        )}
        <button
          onClick={() => console.log("Feedback")}
          className="w-full px-4 py-2 text-left hover:bg-[var(--accent)] rounded-sm transition-all cursor-pointer"
        >
          <Icon
            icon="tabler:message-dots"
            className="inline-block w-4 h-4 mr-2"
          />
          Test
        </button>
      </div>

      {username ? (
        <div className="px-4 py-3">
          <Button
            onClick={logout}
            // variant="outline"
            className="w-full text-center bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white cursor-pointer"
          >
            Logout
          </Button>
        </div>
      ) : (
        <div className="px-4 py-3">
          <Link href="/login">
            <Button
              // variant="outline"
              className="w-full text-centerbg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white cursor-pointer"
            >
              Login
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
};

export default ProfileMenu;
