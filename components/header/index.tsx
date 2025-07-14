import React, { useState, useRef, useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useModelStore } from "@/store/modelStore";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Icon } from "@iconify/react/dist/iconify.js";
import { useChatStore } from "@/store/chatStore";
import { getAIModels } from "@/service/chat";
import Link from "next/link";
import SettingsModal from "./settingsModal";
import { Button } from "../ui/button";

const Header = () => {
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);
  const accountMenuRef = useRef<HTMLDivElement>(null);

  const [models, setModels] = useState([]);
  const [settingsOpen, setSettingsOpen] = useState(false);

  const model = useModelStore((s) => s.model);
  const setModel = useModelStore((s) => s.setModel);
  const { setIsSidebarOpen } = useChatStore();

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (
        accountMenuRef.current &&
        !accountMenuRef.current.contains(e.target as Node)
      ) {
        setAccountMenuOpen(false);
      }
    }
    if (accountMenuOpen) window.addEventListener("mousedown", handleClick);
    return () => window.removeEventListener("mousedown", handleClick);
  }, [accountMenuOpen]);

  useEffect(() => {
    const fetch = async () => {
      const res = await getAIModels();
      const data = res?.data || [];

      setModels(data);

      if (!model && data.length > 0) {
        setModel(data[0].id);
      }
    };

    fetch();
  }, []);

  return (
    <>
      <div className="w-full flex justify-between items-center p-3 bg-[var(--chatArea)] backdrop-blur-3xl border-none">
        <div className="block md:hidden">
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="block sx:hidden p-1 rounded hover:bg-[var(--border)]"
            title="Sidebarni ochish"
          >
            <Icon
              icon={"solar:list-broken"}
              className="h-5 w-5 text-gray-400"
            />
          </button>
        </div>
        <div>
          <Select value={model} onValueChange={setModel}>
            <SelectTrigger className="w-[180px] border-none ">
              <SelectValue placeholder="Select AI Model" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {models.map((modelItem: any) => (
                  <SelectItem key={modelItem.id} value={modelItem.id}>
                    {modelItem.id}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        <div className="relative hidden sm:block mr-2">
          <button
            onClick={() => {
              setAccountMenuOpen((v) => !v);
            }}
          >
            <Avatar>
              <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
          </button>

          {accountMenuOpen && (
            <div
              ref={accountMenuRef}
              className="absolute right-0 top-full mt-3 w-[270px] rounded-xl border border-[var(--border)] bg-[var(--themeBgModalBtn)] shadow-2xl z-50 text-[var(--foreground)] overflow-hidden"
            >
              {/* User Info */}
              <div className="px-4 py-3 border-b border-[var(--border)]">
                <div>
                  <div className="font-semibold text-sm">Bunyodbek</div>
                  <div className="text-xs text-gray-400">
                    jorayevbunyodbek1505@gmail.com
                  </div>
                </div>
              </div>

              {/* Functional Buttons */}
              <div className="py-2 text-sm">
                <button
                  onClick={() => setSettingsOpen(true)}
                  className="w-full px-4 py-2 text-left hover:bg-[var(--border)] transition-all"
                >
                  <Icon
                    icon="solar:settings-linear"
                    className="inline-block w-4 h-4 mr-2"
                  />
                  Settings
                </button>
                <button
                  onClick={() => console.log("Feedback")}
                  className="w-full px-4 py-2 text-left hover:bg-[var(--border)] transition-all"
                >
                  <Icon
                    icon="tabler:message-dots"
                    className="inline-block w-4 h-4 mr-2"
                  />
                  Send
                </button>
              </div>

              {/* Logout Button */}
              <div className="px-4 py-3">
                <Link href="/login">
                  <Button
                    variant="outline"
                    className="w-full text-center bg-[var(--border)] text-white hover:bg-[var(--border)]"
                  >
                    Login
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </div>
        {/* mobile edit */}
        <div className="block sm:hidden">
          <span>
            <Icon
              icon="material-symbols:edit-square-outline-rounded"
              className="h-5 w-5 text-gray-400"
            />
          </span>
        </div>
      </div>
      {settingsOpen && <SettingsModal onClose={() => setSettingsOpen(false)} />}
    </>
  );
};

export default Header;
