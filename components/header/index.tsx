/* eslint-disable react-hooks/exhaustive-deps */
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
import { Icon } from "@iconify/react/dist/iconify.js";
import { useChatStore } from "@/store/chatStore";
import { AIModel, getAIModels } from "@/service/chat";
import ChatSwitch from "./chatSwitch";
import { useUserStore } from "@/store/userStore";

const Header = () => {
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);
  const accountMenuRef = useRef<HTMLDivElement>(null);

  const [models, setModels] = useState<AIModel[]>([]);

  const model = useModelStore((s) => s.model);
  const setModel = useModelStore((s) => s.setModel);
  const { activeAdminView, setActiveAdminView, setIsSidebarOpen } =
    useChatStore();
  const role = useUserStore((s) => s.user?.role);

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
        setModel(data[0].name);
      }
    };

    fetch();
  }, []);

  return (
    <>
      <div className="w-full flex justify-between items-center p-3 bg-[var(--chatArea)] backdrop-blur-3xl border-none">
        {/* mobile responsive icon */}
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
            <SelectTrigger className="w-[200px] border-none ">
              <SelectValue placeholder="Select AI Model" />
            </SelectTrigger>
            <SelectContent className="bg-white dark:bg-gray-700">
              <SelectGroup>
                {model.length > 0 ? (
                  models.map((modelItem: any, index) => (
                    <SelectItem
                      key={modelItem.id || index}
                      value={modelItem.name}
                    >
                      {modelItem.name}
                    </SelectItem>
                  ))
                ) : (
                  <div className="px-4 py-2 text-sm text-muted-foreground">
                    Model not available
                  </div>
                )}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        {/* Admin Chat Switcher */}
        {role === "admin" && (
          <div>
            <ChatSwitch
              activeChat={activeAdminView}
              setActiveChat={setActiveAdminView}
            />
          </div>
        )}

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
    </>
  );
};

export default Header;
