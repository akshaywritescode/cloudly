'use client';

import React from 'react';
import { RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface RecoverConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  fileName: string;
  isLoading?: boolean;
}

export default function RecoverConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  fileName,
  isLoading = false
}: RecoverConfirmDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <RotateCcw className="w-5 h-5 text-green-600" />
            Recover File
          </DialogTitle>
          <DialogDescription>
            Are you sure you want to recover "{fileName}" from trash? 
            The file will be restored to its original location.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            variant="default"
            onClick={onConfirm}
            disabled={isLoading}
            className="bg-green-600 hover:bg-green-700"
          >
            {isLoading ? 'Recovering...' : 'Recover'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
