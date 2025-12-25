"use client";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/src/components/ui/table";
import { useEffect } from "react";
import { Button } from "../components/ui/button";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  totalCount?: number;
  skipCount?: number;
  onPageChange?: (newSkip: number) => void;
  onMaxResultChange?: (value: number) => void
}

export function DataTable<TData, TValue>({
  columns,
  data,
  totalCount,
  skipCount,
  onPageChange,
  onMaxResultChange
}: DataTableProps<TData, TValue>) {
  const maxCountResult :number = 10;
  useEffect(() => {
    if (onMaxResultChange) onMaxResultChange(maxCountResult);
  },[onMaxResultChange, maxCountResult])
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });
  const totalPage = Math.max(1, Math.ceil((totalCount ?? 0) / maxCountResult));
  const currentPage = Math.floor((skipCount ?? 0) / maxCountResult) + 1;

  const handletoFirstPage = () => {
    const newSkip = 0;
    onPageChange?.(newSkip)
  }

  const handleToLastPage = () => {
    const newSkip = (totalPage - 1) * maxCountResult;
    onPageChange?.(newSkip)
  }

  const handlePrevious = () => {
    const newSkip = Math.max((skipCount ?? 0) - maxCountResult, 0);
    onPageChange?.(newSkip)
  }

  const handleNext = () => {
    const newSkip = (skipCount ?? 0) + maxCountResult;
    if (newSkip < (totalCount ?? 0)) onPageChange?.(newSkip)
  }

  return (
    <>
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
                );
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
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
       {
        skipCount != null && (
           <div className="flex items-center justify-center mt-5 gap-3">
          <Button
            className="cursor-pointer font-bold"
            disabled={skipCount === 0}
            onClick={handletoFirstPage}
            variant="outline"
          >
            &lt;&lt;
          </Button>
          <Button
          className="cursor-pointer font-bold"
            onClick={handlePrevious}
            disabled={skipCount === 0}
            variant="outline"
          >
             &lt; Previous
          </Button>
          <p className="mx-3">Page <span className="font-bold">{currentPage}</span> of <span className="font-bold">{totalPage}</span></p>
          <Button
            className="cursor-pointer font-bold"
            onClick={handleNext}
            disabled={(skipCount ?? 0) + maxCountResult >= (totalCount ?? 0)}
            variant="outline"
          >
            Next &gt;
          </Button>
          <Button
            className="cursor-pointer font-bold"
            onClick={handleToLastPage}
            disabled={(skipCount ?? 0) + maxCountResult >= (totalCount ?? 0)}
            variant="outline"
          >
            &gt;&gt;
          </Button>
    </div>
        )
       }
    </>
  );
}
