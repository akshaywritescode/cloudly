"use client";

import React from "react";
import { RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface BulkRecoverConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  count: number;
  isLoading?: boolean;
}

export default function BulkRecoverConfirmDialog({ isOpen, onClose, onConfirm, count, isLoading = false }: BulkRecoverConfirmDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <RotateCcw className="w-5 h-5 text-green-600" />
            Recover {count} File{count !== 1 ? 's' : ''}
          </DialogTitle>
          <DialogDescription>
            Are you sure you want to recover {count} selected file{count !== 1 ? 's' : ''} from trash?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button onClick={onConfirm} disabled={isLoading}>
            {isLoading ? 'Recovering...' : 'Recover'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
