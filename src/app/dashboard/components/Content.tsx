"use client"

import * as React from "react"
import Image from "next/image"
import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table"
import { ArrowUpDown, ChevronDown, MoreHorizontal, Copy, Download, Share, Trash2, RotateCcw, Pencil, Star } from "lucide-react"
import sadIllustration from "@/app/assets/sad-illustration.svg"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { NavigationItem } from "../page"
import { useFiles, FileData } from "@/hooks/useFiles"
import ImagePreview from "./ImagePreview"
import DeleteConfirmDialog from "./DeleteConfirmDialog"
import RecoverConfirmDialog from "./RecoverConfirmDialog"
import PermanentDeleteConfirmDialog from "./PermanentDeleteConfirmDialog"
import RenameDialog from "./RenameDialog"
import { downloadFile } from "@/lib/download"
import { moveFileToTrash, restoreFileFromTrash, permanentlyDeleteFile } from "@/lib/delete"
import { renameFile, toggleStarFile } from "@/lib/files"
import Heading2 from "@/components/Heading2"
import FilePreviewDialog from "./FilePreviewDialog"

export type File = {
  id: string
  fileName: string
  type: "images" | "videos" | "docs" | "audio"
  size: string
  dateTime: string
}

function getColumns(setPreviewFile: (file: FileData) => void): ColumnDef<FileData>[] {
  return [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "fileName",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            File Name
            <ArrowUpDown />
          </Button>
        )
      },
      cell: ({ row }) => {
        const file = row.original;
        return (
          <div className="flex items-center gap-3">
            <ImagePreview 
              fileId={file.fileId} 
              fileName={file.fileName} 
              fileType={file.fileType}
              className="w-8 h-8"
            />
            <button
              className="font-medium underline hover:opacity-80 focus:outline-none"
              onClick={() => setPreviewFile(file)}
              title="Preview file"
              type="button"
            >
              {file.fileName}
            </button>
          </div>
        );
      }
    },
    {
      accessorKey: "fileType",
      header: "Type",
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("fileType")}</div>
      ),
    },
    {
      accessorKey: "fileSize",
      header: () => <div className="text-right">Size</div>,
      cell: ({ row }) => {
        return <div className="text-right font-medium">{row.getValue("fileSize")}</div>
      },
    },
    {
      accessorKey: "uploadDate",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Date & Time
            <ArrowUpDown />
          </Button>
        )
      },
      cell: ({ row }) => <div>{row.getValue("uploadDate")}</div>,
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const file = row.original
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0 cursor-pointer">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              {
                file.isTrash ? (
                  // Trash file actions
                  <>
                    <DropdownMenuItem className="cursor-pointer" onClick={() => navigator.clipboard.writeText(file.id)}>
                      <Copy className="w-4 h-4 mr-2" />
                      Copy file ID
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="cursor-pointer text-green-600" onClick={() => {
                      const event = new CustomEvent('recoverFile', {
                        detail: { fileId: file.id, fileName: file.fileName }
                      });
                      window.dispatchEvent(event);
                    }}>
                      <RotateCcw className="w-4 h-4 mr-2 text-green-600" />
                      Recover
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-red-600 cursor-pointer" onClick={() => {
                      const event = new CustomEvent('permanentDeleteFile', {
                        detail: { fileId: file.id, fileName: file.fileName }
                      });
                      window.dispatchEvent(event);
                    }}>
                      <Trash2 className="w-4 h-4 mr-2 text-red-600" />
                      Delete Permanently
                    </DropdownMenuItem>
                  </>
                ) : (
                  // Normal file actions
                  <>
                    <DropdownMenuItem className="cursor-pointer" onClick={() => navigator.clipboard.writeText(file.id)}>
                      <Copy className="w-4 h-4 mr-2" />
                      Copy file ID
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="cursor-pointer" onClick={async () => {
                      try {
                        await toggleStarFile(file.id, !file.isStarred);
                        const event = new CustomEvent('filesUpdated');
                        window.dispatchEvent(event);
                      } catch (error) {
                        console.error('Failed to toggle star:', error);
                        alert('Failed to update star status. Please try again.');
                      }
                    }}>
                      <Star className={`w-4 h-4 mr-2 ${file.isStarred ? 'fill-yellow-400 text-yellow-400' : ''}`} />
                      {file.isStarred ? 'Unstar' : 'Star'}
                    </DropdownMenuItem>
                    <DropdownMenuItem className="cursor-pointer" onClick={() => {
                      const event = new CustomEvent('renameFile', {
                        detail: { fileId: file.id, fileName: file.fileName }
                      });
                      window.dispatchEvent(event);
                    }}>
                      <Pencil className="w-4 h-4 mr-2" />
                      Rename
                    </DropdownMenuItem>
                    <DropdownMenuItem className="cursor-pointer" onClick={async () => {
                      try {
                        await downloadFile(file.fileId, file.fileName);
                      } catch (error) {
                        console.error('Download failed:', error);
                        alert('Failed to download file. Please try again.');
                      }
                    }}>
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </DropdownMenuItem>
                    <DropdownMenuItem className="cursor-pointer" onClick={() => {
                      navigator.clipboard.writeText(file.id);
                      alert('File ID copied to clipboard for sharing');
                    }}>
                      <Share className="w-4 h-4 mr-2" />
                      Share
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-red-600 cursor-pointer" onClick={() => {
                      const event = new CustomEvent('deleteFile', {
                        detail: { fileId: file.id, fileName: file.fileName }
                      });
                      window.dispatchEvent(event);
                    }}>
                      <Trash2 className="w-4 h-4 mr-2 text-red-600" />
                      Delete
                    </DropdownMenuItem>
                  </>
                )
              }
            </DropdownMenuContent>
          </DropdownMenu>
        );
      }
    },
  ];
}

interface ContentTableProps {
  activeNavigation: NavigationItem;
}

export function ContentTable({ activeNavigation }: ContentTableProps) {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})

  // Dialog states
  const [previewFile, setPreviewFile] = React.useState<FileData | null>(null);

  // Delete confirmation dialog state
  const [deleteDialog, setDeleteDialog] = React.useState<{
    isOpen: boolean;
    fileId: string | null;
    fileName: string | null;
    isLoading: boolean;
  }>({
    isOpen: false,
    fileId: null,
    fileName: null,
    isLoading: false
  });

  // Recover confirmation dialog state
  const [recoverDialog, setRecoverDialog] = React.useState<{
    isOpen: boolean;
    fileId: string | null;
    fileName: string | null;
    isLoading: boolean;
  }>({
    isOpen: false,
    fileId: null,
    fileName: null,
    isLoading: false
  });

  // Permanent delete confirmation dialog state
  const [permanentDeleteDialog, setPermanentDeleteDialog] = React.useState<{
    isOpen: boolean;
    fileId: string | null;
    fileName: string | null;
    isLoading: boolean;
  }>({
    isOpen: false,
    fileId: null,
    fileName: null,
    isLoading: false
  });

  // Rename dialog state
  const [renameDialog, setRenameDialog] = React.useState<{
    isOpen: boolean;
    fileId: string | null;
    fileName: string | null;
    isLoading: boolean;
  }>({
    isOpen: false,
    fileId: null,
    fileName: null,
    isLoading: false
  });

  const { files, loading, refetch } = useFiles(activeNavigation);

  // generate columns with current setPreviewFile
  const columns = React.useMemo(() => getColumns(setPreviewFile), [setPreviewFile]);

  // Use useRef to store stable references
  const refetchRef = React.useRef(refetch);
  refetchRef.current = refetch;

  // Handle delete file event
  React.useEffect(() => {
    const handleDeleteFile = (event: CustomEvent) => {
      const { fileId, fileName } = event.detail;
      setDeleteDialog({
        isOpen: true,
        fileId,
        fileName,
        isLoading: false
      });
    };

    const handleRecoverFile = (event: CustomEvent) => {
      const { fileId, fileName } = event.detail;
      setRecoverDialog({
        isOpen: true,
        fileId,
        fileName,
        isLoading: false
      });
    };

    const handlePermanentDeleteFile = (event: CustomEvent) => {
      const { fileId, fileName } = event.detail;
      setPermanentDeleteDialog({
        isOpen: true,
        fileId,
        fileName,
        isLoading: false
      });
    };

    const handleRenameFile = (event: CustomEvent) => {
      const { fileId, fileName } = event.detail;
      setRenameDialog({
        isOpen: true,
        fileId,
        fileName,
        isLoading: false
      });
    };

    const handleFilesUpdated = () => {
      console.log('ContentTable: Files updated event received, refetching...');
      refetchRef.current();
    };

    window.addEventListener('deleteFile', handleDeleteFile as EventListener);
    window.addEventListener('recoverFile', handleRecoverFile as EventListener);
    window.addEventListener('permanentDeleteFile', handlePermanentDeleteFile as EventListener);
    window.addEventListener('renameFile', handleRenameFile as EventListener);
    window.addEventListener('filesUpdated', handleFilesUpdated);
    
    return () => {
      window.removeEventListener('deleteFile', handleDeleteFile as EventListener);
      window.removeEventListener('recoverFile', handleRecoverFile as EventListener);
      window.removeEventListener('permanentDeleteFile', handlePermanentDeleteFile as EventListener);
      window.removeEventListener('renameFile', handleRenameFile as EventListener);
      window.removeEventListener('filesUpdated', handleFilesUpdated);
    };
  }, []); // Empty dependency array - event listeners are stable

  const handleDeleteConfirm = async () => {
    if (!deleteDialog.fileId) return;

    setDeleteDialog(prev => ({ ...prev, isLoading: true }));

    try {
      await moveFileToTrash(deleteDialog.fileId);
      // Refresh the files list
      await refetch();
      
      // Dispatch filesUpdated event to update counts in sidebar
      const filesUpdatedEvent = new CustomEvent('filesUpdated');
      window.dispatchEvent(filesUpdatedEvent);
      
      setDeleteDialog({
        isOpen: false,
        fileId: null,
        fileName: null,
        isLoading: false
      });
    } catch (error) {
      console.error('Delete failed:', error);
      alert('Failed to delete file. Please try again.');
      setDeleteDialog(prev => ({ ...prev, isLoading: false }));
    }
  };

  const handleRecoverConfirm = async () => {
    if (!recoverDialog.fileId) return;

    setRecoverDialog(prev => ({ ...prev, isLoading: true }));

    try {
      await restoreFileFromTrash(recoverDialog.fileId);
      // Refresh the files list
      await refetch();
      
      // Dispatch filesUpdated event to update counts in sidebar
      const filesUpdatedEvent = new CustomEvent('filesUpdated');
      window.dispatchEvent(filesUpdatedEvent);
      
      setRecoverDialog({
        isOpen: false,
        fileId: null,
        fileName: null,
        isLoading: false
      });
    } catch (error) {
      console.error('Recover failed:', error);
      alert('Failed to recover file. Please try again.');
      setRecoverDialog(prev => ({ ...prev, isLoading: false }));
    }
  };

  const handlePermanentDeleteConfirm = async () => {
    if (!permanentDeleteDialog.fileId) return;

    setPermanentDeleteDialog(prev => ({ ...prev, isLoading: true }));

    try {
      await permanentlyDeleteFile(permanentDeleteDialog.fileId);
      // Refresh the files list
      await refetch();
      
      // Dispatch filesUpdated event to update counts in sidebar
      const filesUpdatedEvent = new CustomEvent('filesUpdated');
      window.dispatchEvent(filesUpdatedEvent);
      
      setPermanentDeleteDialog({
        isOpen: false,
        fileId: null,
        fileName: null,
        isLoading: false
      });
    } catch (error) {
      console.error('Permanent delete failed:', error);
      alert('Failed to permanently delete file. Please try again.');
      setPermanentDeleteDialog(prev => ({ ...prev, isLoading: false }));
    }
  };

  const handleRenameConfirm = async (newFileName: string) => {
    if (!renameDialog.fileId) return;

    setRenameDialog(prev => ({ ...prev, isLoading: true }));

    try {
      await renameFile(renameDialog.fileId, newFileName);
      // Refresh the files list
      await refetch();
      
      // Dispatch filesUpdated event to update counts in sidebar
      const filesUpdatedEvent = new CustomEvent('filesUpdated');
      window.dispatchEvent(filesUpdatedEvent);
      
      setRenameDialog({
        isOpen: false,
        fileId: null,
        fileName: null,
        isLoading: false
      });
    } catch (error) {
      console.error('Rename failed:', error);
      alert('Failed to rename file. Please try again.');
      setRenameDialog(prev => ({ ...prev, isLoading: false }));
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialog({
      isOpen: false,
      fileId: null,
      fileName: null,
      isLoading: false
    });
  };

  const handleRecoverCancel = () => {
    setRecoverDialog({
      isOpen: false,
      fileId: null,
      fileName: null,
      isLoading: false
    });
  };

  const handlePermanentDeleteCancel = () => {
    setPermanentDeleteDialog({
      isOpen: false,
      fileId: null,
      fileName: null,
      isLoading: false
    });
  };

  const handleRenameCancel = () => {
    setRenameDialog({
      isOpen: false,
      fileId: null,
      fileName: null,
      isLoading: false
    });
  };

  const table = useReactTable({
    data: files,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  })

  if (loading) {
    return (
      <div className="w-full">
        <div className="flex items-center justify-center py-8">
          <div className="text-gray-500">Loading files...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="flex items-center py-4">
        <Input
          placeholder="Filter files..."
          value={(table.getColumn("fileName")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("fileName")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              Columns <ChevronDown />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                )
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="overflow-hidden rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-96 text-center"
                >
                  <div className="flex flex-col items-center justify-center space-y-6">
                    <Image
                      src={sadIllustration}
                      width={192} height={192} className="w-48 h-48 object-contain" alt="No files found" />
                    <div className="space-y-2 flex flex-col items-center justify-center m-auto">
                      <Heading2 className="text-lg font-semibold text-gray-700">
                        No files found
                      </Heading2>
                      <div className="text-sm text-gray-500 max-w-md text-center flex flex-col items-center leading-[1.5rem] mt-3">
                        <p className="text-center">You don't have any files yet.</p>
                        <p className="text-center">Click on the upload button above to start uploading your files and get started!</p>
                      </div>
                    </div>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="text-muted-foreground flex-1 text-sm">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmDialog
        isOpen={deleteDialog.isOpen}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        fileName={deleteDialog.fileName || ''}
        isLoading={deleteDialog.isLoading}
      />

      {/* Recover Confirmation Dialog */}
      <RecoverConfirmDialog
        isOpen={recoverDialog.isOpen}
        onClose={handleRecoverCancel}
        onConfirm={handleRecoverConfirm}
        fileName={recoverDialog.fileName || ''}
        isLoading={recoverDialog.isLoading}
      />

      {/* Permanent Delete Confirmation Dialog */}
      <PermanentDeleteConfirmDialog
        isOpen={permanentDeleteDialog.isOpen}
        onClose={handlePermanentDeleteCancel}
        onConfirm={handlePermanentDeleteConfirm}
        fileName={permanentDeleteDialog.fileName || ''}
        isLoading={permanentDeleteDialog.isLoading}
      />

      {/* Rename Dialog */}
      <RenameDialog
        isOpen={renameDialog.isOpen}
        onClose={handleRenameCancel}
        onConfirm={handleRenameConfirm}
        currentFileName={renameDialog.fileName || ''}
        isLoading={renameDialog.isLoading}
      />
      <FilePreviewDialog
        open={!!previewFile}
        onOpenChange={open => !open ? setPreviewFile(null) : void 0}
        fileId={previewFile?.fileId || ''}
        fileName={previewFile?.fileName || ''}
        fileType={previewFile?.fileType || 'images'}
      />
    </div>
  )
}
