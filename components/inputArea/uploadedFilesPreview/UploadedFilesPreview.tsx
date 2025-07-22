import { Icon } from "@iconify/react";
import Image from "next/image";

interface Props {
  uploadedFile: { name: string; base64: string }[];
  setUploadedFile: React.Dispatch<
    React.SetStateAction<{ name: string; base64: string }[]>
  >;
  uploadedFolder: string | null;
  setUploadedFolder: React.Dispatch<React.SetStateAction<string | null>>;
}

export default function UploadedFilesPreview({
  uploadedFile,
  setUploadedFile,
  uploadedFolder,
  setUploadedFolder,
}: Props) {
  return (
    <div className="flex flex-wrap gap-2 items-center">
      {uploadedFolder && (
        <div className="relative w-fit mb-1">
          <div className="text-sm bg-gray-800 text-gray-300 rounded px-2 py-1">
            📁 {uploadedFolder}
          </div>
          <div
            className="absolute -top-1 -right-1 cursor-pointer"
            onClick={() => setUploadedFolder(null)}
          >
            <Icon icon="solar:close-circle-linear" className="h-4 w-4" />
          </div>
        </div>
      )}

      {uploadedFile.map((file, index) => (
        <div key={index} className="relative w-[50px] h-[50px]">
          <Image
            src={file.base64}
            alt={`file_${index}`}
            width={50}
            height={50}
            className="rounded"
            unoptimized
          />
          <div
            className="absolute -top-1 -right-1 cursor-pointer"
            onClick={() =>
              setUploadedFile((prev) => prev.filter((_, i) => i !== index))
            }
          >
            <Icon icon="solar:close-circle-linear" className="h-4 w-4" />
          </div>
        </div>
      ))}
    </div>
  );
}
