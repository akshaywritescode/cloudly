'use client';

import React, { useState, useEffect } from 'react';
import { Pencil } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface RenameDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (newFileName: string) => void;
  currentFileName: string;
  isLoading?: boolean;
}

export default function RenameDialog({
  isOpen,
  onClose,
  onConfirm,
  currentFileName,
  isLoading = false
}: RenameDialogProps) {
  const [newFileName, setNewFileName] = useState(currentFileName);
  const [error, setError] = useState<string>('');

  // Reset the input when dialog opens with new file
  useEffect(() => {
    if (isOpen) {
      setNewFileName(currentFileName);
      setError('');
    }
  }, [isOpen, currentFileName]);

  const handleConfirm = () => {
    const trimmedName = newFileName.trim();
    
    if (!trimmedName) {
      setError('File name cannot be empty');
      return;
    }
    
    if (trimmedName === currentFileName) {
      setError('New file name must be different from current name');
      return;
    }
    
    onConfirm(trimmedName);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !isLoading) {
      handleConfirm();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Pencil className="w-5 h-5 text-blue-600" />
            Rename File
          </DialogTitle>
          <DialogDescription>
            Enter a new name for "{currentFileName}"
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-2">
          <Input
            value={newFileName}
            onChange={(e) => {
              setNewFileName(e.target.value);
              setError('');
            }}
            onKeyPress={handleKeyPress}
            placeholder="Enter new file name"
            disabled={isLoading}
            autoFocus
          />
          {error && (
            <p className="text-sm text-red-600">{error}</p>
          )}
        </div>
        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={isLoading}
          >
            {isLoading ? 'Renaming...' : 'Rename'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
