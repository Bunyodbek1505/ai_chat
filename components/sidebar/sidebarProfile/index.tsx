import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Icon } from "@iconify/react";
import { ThemeSwitch } from "@/components/ui/ThemeSwitch";
import { useUserStore } from "@/store/userStore";
import { useLogout } from "@/hooks/useLogout";

const SidebarProfile = ({
  onOpenSettings,
  onCloseMenu,
  collapsed = false,
}: {
  collapsed?: boolean;
  onOpenSettings: () => void;
  onCloseMenu?: () => void;
}) => {
  const [expanded, setExpanded] = useState(false);

  const username = useUserStore((s) => s.user?.username);
  const role = useUserStore((s) => s.user?.role);
  const logout = useLogout();

  const handleSettingsClick = () => {
    onOpenSettings();
    onCloseMenu?.();
    setExpanded(false);
  };

  const toggleExpand = () => setExpanded((prev) => !prev);

  if (collapsed) {
    return (
      <div className="flex flex-col items-center gap-2">
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-600 to-indigo-700 flex items-center justify-center text-white text-sm font-bold shadow-lg">
          {username?.slice(0, 1)?.toUpperCase()}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <motion.div
        className="flex items-center justify-between gap-3 py-2 px-3 cursor-pointer hover:bg-gray-100/80 dark:hover:bg-gray-800/50 rounded-xl transition-all duration-200 group"
        onClick={toggleExpand}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-600 to-indigo-700 flex items-center justify-center text-white text-sm font-bold shadow-lg flex-shrink-0">
            {username?.slice(0, 1)?.toUpperCase()}
          </div>
          <div className="flex flex-col min-w-0 flex-1">
            <p className="text-sm font-semibold text-gray-800 dark:text-gray-100 truncate">
              {username}
            </p>
            {role && (
              <p className="text-xs text-gray-500 dark:text-gray-400 capitalize truncate">
                {role}
              </p>
            )}
          </div>
        </div>
        <motion.div
          animate={{ rotate: expanded ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <Icon
            icon="solar:alt-arrow-down-linear"
            className="w-4 h-4 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors flex-shrink-0"
          />
        </motion.div>
      </motion.div>

      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="mt-3 mb-4 h-px bg-gradient-to-r from-transparent via-gray-300 dark:via-gray-600 to-transparent" />

            {/* Theme Switch */}
            <div className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors">
              <div className="flex items-center gap-3">
                <div className="p-1.5 bg-gradient-to-br from-orange-400 to-yellow-500 rounded-lg">
                  <Icon
                    icon="solar:gallery-minimalistic-broken"
                    className="w-4 h-4 text-white"
                  />
                </div>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Theme
                </span>
              </div>
              <ThemeSwitch />
            </div>

            {/* Menu Actions */}
            <div className="space-y-1 mt-2">
              {role === "admin" && (
                <motion.button
                  onClick={handleSettingsClick}
                  className="w-full py-2.5 px-3 text-left rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-200 cursor-pointer flex items-center gap-3 group"
                  whileHover={{ x: 2 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="p-1.5 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg group-hover:shadow-md transition-shadow">
                    <Icon
                      icon="solar:settings-linear"
                      className="w-4 h-4 text-white"
                    />
                  </div>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    Settings
                  </span>
                </motion.button>
              )}

              <motion.button
                onClick={logout}
                className="w-full py-2.5 px-3 text-left rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-200 cursor-pointer flex items-center gap-3 group"
                whileHover={{ x: 2 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="p-1.5 bg-gradient-to-br from-red-500 to-rose-600 rounded-lg group-hover:shadow-md transition-shadow">
                  <Icon
                    icon="solar:logout-outline"
                    className="w-4 h-4 text-white"
                  />
                </div>
                <span className="text-sm font-medium text-red-600 dark:text-red-400 group-hover:text-red-700 dark:group-hover:text-red-300 transition-colors">
                  Exit
                </span>
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SidebarProfile;
