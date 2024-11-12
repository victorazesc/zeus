import * as React from "react";
import {
  ColumnDef,
  SortingState,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
  Row,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { EmptyState } from "../empty-state";
import { EmptyStateType } from "@/constants/empty-state";
import { PROPOSAL_STATUS, Status } from "@/constants/proposal-status";
import { Skeleton } from "../ui/skeleton";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  searchValue: string;
  searchFields?: (keyof TData | string)[];
  dataTableType: EmptyStateType;
  rowProps?: (row: Row<TData>) => React.HTMLAttributes<HTMLTableRowElement>;
  isLoading?: boolean; // Nova prop para estado de carregamento
  addAction?: () => void;
}

const removeSpecialCharacters = (str: string) => {
  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\w\s]/gi, "")
    .replace(/\s+/g, "")
    .toLowerCase();
};

const getNestedValue = (obj: any, path: string) => {
  return path
    .split(".")
    .reduce((value, key) => (value && value[key] ? value[key] : ""), obj);
};

export function DataTable<TData, TValue>({
  columns,
  data,
  searchValue,
  searchFields = [],
  dataTableType,
  rowProps,
  addAction,
  isLoading = false, // Prop padrão definida como falso
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);

  const filteredData = React.useMemo(() => {
    const normalizedSearch = removeSpecialCharacters(searchValue);

    return data.filter((item) => {
      if (!searchFields.length) return true;

      return searchFields.some((field) => {
        let fieldValue = "";

        if (field === "status") {
          const statusKey = (item as any)["status"] as Status;
          fieldValue = PROPOSAL_STATUS[statusKey]?.label || "";
        } else {
          fieldValue = getNestedValue(item, field as string) || "";
        }

        return removeSpecialCharacters(String(fieldValue)).includes(
          normalizedSearch
        );
      });
    });
  }, [data, searchValue, searchFields]);

  const table = useReactTable({
    data: filteredData,
    columns,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting,
    },
  });

  return (
    <div>
      <div className="rounded-md">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {isLoading ? ( // Exibe o loading se estiver carregando
              <>
                {[...Array(10)].map((_, rowIndex) => (
                  <TableRow key={rowIndex}>
                    {columns.map((column, colIndex) => (
                      <TableCell key={colIndex}>
                        <Skeleton className="h-6"></Skeleton>
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </>
            ) : table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  {...(rowProps ? rowProps(row) : {})}
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
                  className="h-24 text-center"
                >
                  <EmptyState
                    type={dataTableType}
                    size="sm"
                    primaryButtonOnClick={addAction}
                  />
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
