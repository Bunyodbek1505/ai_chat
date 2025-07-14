import React from "react";

interface ModalProps {
  open: boolean;
  title: string;
  children: React.ReactNode;
  onOk: () => void;
  onCancel: () => void;
  okText?: string;
  cancelText?: string;
}

const Modal: React.FC<ModalProps> = ({
  open,
  title,
  children,
  onOk,
  onCancel,
  okText = "Save",
  cancelText = "Cancel",
}) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/60">
      <div className="bg-[#191A23] rounded-2xl px-8 pt-7 pb-6 min-w-[400px] shadow-xl">
        <h2 className="text-xl font-bold mb-4">{title}</h2>
        <div className="mb-7">{children}</div>
        <div className="flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="px-5 py-2 bg-[#232327] rounded text-white text-[16px] font-medium"
          >
            {cancelText}
          </button>
          <button
            onClick={onOk}
            className="px-5 py-2 bg-[#2563eb] rounded text-white text-[16px] font-medium"
          >
            {okText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
