import * as React from "react";
import {
    ColumnDef,
    SortingState,
    flexRender,
    getCoreRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { EmptyState } from "../empty-state";
import { EmptyStateType } from "@/constants/empty-state";

interface DataTableProps<TValue> {
    columns: ColumnDef<any, TValue>[];
    data: any[];
    searchValue: string;
    searchFields?: (keyof any)[];
    dataTableType: EmptyStateType;
}

// Função para remover caracteres especiais e espaços
const removeSpecialCharacters = (str: string) => {
    return str
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^\w\s]/gi, "")
        .replace(/\s+/g, "")
        .toLowerCase();
};

export function DataTable<TValue>({
    columns,
    data,
    searchValue,
    searchFields = [],
    dataTableType,
}: DataTableProps<TValue>) {
    const [sorting, setSorting] = React.useState<SortingState>([]);

    // Filtrando dinamicamente com base nos campos fornecidos
    const filteredData = React.useMemo(() => {
        const normalizedSearch = removeSpecialCharacters(searchValue);
        return data.filter((item) => {
            // Se não foram especificados campos, retorna todos os itens
            if (!searchFields.length) return true;

            // Concatenando os campos especificados para busca
            const valuesToSearch = searchFields
                .map((field) => (item[field] ? String(item[field]) : ""))
                .join(" ");

            // Retorna true se os valores contêm o texto de busca
            return removeSpecialCharacters(valuesToSearch).includes(normalizedSearch);
        });
    }, [data, searchValue, searchFields]);

    const table = useReactTable({
        data: filteredData, // Usar os dados filtrados
        columns,
        onSortingChange: setSorting,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
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
                                            : flexRender(header.column.columnDef.header, header.getContext())}
                                    </TableHead>
                                ))}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
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
                                    <EmptyState type={dataTableType} size="sm" />
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}