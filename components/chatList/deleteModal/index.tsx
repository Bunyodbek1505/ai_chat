"use client";

import { Icon } from "@iconify/react/dist/iconify.js";
import React from "react";

interface DeleteModalProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  isSubmitting: boolean;
}

const DeleteModal: React.FC<DeleteModalProps> = React.memo(
  ({ isOpen, onConfirm, onCancel, isSubmitting }) => {
    if (!isOpen) return null;

    return (
      <div className="fixed inset-0 flex items-center justify-center z-[1000] bg-black/50 p-4">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-2xl max-w-sm w-full transform transition-all duration-300 ease-in-out">
          <div className="text-center">
            <div className="mb-4">
              <Icon
                icon="solar:trash-bin-trash-bold"
                className="text-4xl text-red-600 dark:text-red-400 mx-auto mb-3"
              />
            </div>

            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
              Chatni ochirish
            </h3>

            <p className="text-sm text-gray-600 dark:text-gray-300 mb-6">
              Bu amal barcha xabarlarni ochiradi va qaytarib bolmaydi. Davom
              etishni xohlaysizmi?
            </p>

            <div className="flex justify-center gap-3">
              <button
                onClick={onCancel}
                className="px-5 py-2.5 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors font-medium"
                disabled={isSubmitting}
              >
                Bekor qilish
              </button>

              <button
                onClick={onConfirm}
                className="px-5 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isSubmitting}
              >
                {isSubmitting ? "O'chirilmoqda..." : "O'chirish"}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
);

DeleteModal.displayName = "DeleteModal";

export default DeleteModal;
