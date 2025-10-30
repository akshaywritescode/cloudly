import React, { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog";
import { getStorage } from '@/lib/appwrite';

interface FilePreviewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  fileId: string;
  fileName: string;
  fileType: "images" | "videos" | "docs" | "audio" | "archives";
}

const FilePreviewDialog: React.FC<FilePreviewDialogProps> = ({ open, onOpenChange, fileId, fileName, fileType }) => {
  const [fileUrl, setFileUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!fileId) return;
    const storage = getStorage();
    const bucketId = process.env.NEXT_PUBLIC_APPWRITE_CLOUDLY_BUCKET_MAIN;
    if (!bucketId) return;

    // Use Appwrite preview for images, get download otherwise
    if (fileType === "images") {
      setFileUrl(storage.getFilePreview(bucketId, fileId).toString());
    } else {
      setFileUrl(storage.getFileDownload(bucketId, fileId).toString());
    }
  }, [fileId, fileType]);

  const handleOpenInNewTab = () => {
    if (fileUrl) window.open(fileUrl, "_blank");
  }

  let previewContent: React.ReactNode = null;
  if (fileType === "images" && fileUrl) {
    previewContent = (
      <img
        src={fileUrl}
        alt={fileName}
        className="max-w-full max-h-[70vh] m-auto rounded shadow border"
      />
    );
  } else if (fileType === "videos" && fileUrl) {
    previewContent = (
      <video src={fileUrl} controls className="max-w-full max-h-[70vh] m-auto rounded shadow border" />
    );
  } else if (fileType === "docs" && fileUrl && fileName.toLowerCase().endsWith('.pdf')) {
    previewContent = (
      <iframe
        src={fileUrl}
        title={fileName}
        className="w-full h-[70vh] rounded shadow border"
      />
    );
  } else if (fileUrl) {
    previewContent = (
      <div className="flex flex-col items-center space-y-4 p-4">
        <span>Cannot preview this file type.</span>
        <button className="px-4 py-2 bg-blue-600 text-white rounded" onClick={handleOpenInNewTab}>
          Open in new tab
        </button>
      </div>
    )
  } else {
    previewContent = <div className="p-8 text-center text-gray-500">Loading preview...</div>;
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl w-full">
        <DialogHeader>
          <DialogTitle>Preview: {fileName}</DialogTitle>
        </DialogHeader>
        {previewContent}
        <DialogClose asChild>
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
}

export default FilePreviewDialog;
