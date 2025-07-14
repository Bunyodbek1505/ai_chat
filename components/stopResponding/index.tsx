import { Icon } from "@iconify/react/dist/iconify.js";
import React from "react";

interface Props {
  onStop: () => void;
}

const StopResponding = ({ onStop }: Props) => {
  return (
    <div>
      <button
        onClick={onStop}
        className="flex items-center gap-1 px-2 py-2 rounded-lg bg-gray-700 opacity-80 text-white text-[10px] hover:bg-gray-600 hover:cursor-pointer transition"
      >
        <Icon
          icon="material-symbols:stop-circle-outline"
          className="w-3 h-3 text-gray-300"
        />{" "}
        Stop responding
      </button>
    </div>
  );
};

export default StopResponding;
