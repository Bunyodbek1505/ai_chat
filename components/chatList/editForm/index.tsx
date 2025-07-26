"use client";

import React from "react";

interface EditFormProps {
  value: string;
  onChange: (value: string) => void;
  onSave: () => void;
  onCancel: () => void;
  isSubmitting: boolean;
}

const EditForm: React.FC<EditFormProps> = React.memo(
  ({ value, onChange, onSave, onCancel, isSubmitting }) => (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSave();
      }}
      className="edit-form w-full"
    >
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full text-sm bg-transparent border-b border-gray-300 dark:border-gray-600 outline-none focus:border-blue-500 dark:focus:border-blue-400 transition-colors"
        autoFocus
        onBlur={onSave}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            onSave();
          } else if (e.key === "Escape") {
            onCancel();
          }
        }}
        disabled={isSubmitting}
      />
    </form>
  )
);

EditForm.displayName = "EditForm";

export default EditForm;
