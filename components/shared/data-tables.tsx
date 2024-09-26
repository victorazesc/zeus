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

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[];
    data: TData[];
    searchValue: string; // Recebendo o valor da busca
    dataTableType: EmptyStateType
}

// Função que remove caracteres especiais, espaços e normaliza para busca
const removeSpecialCharacters = (str: string) => {
    return str
        .normalize("NFD") // Decompõe os caracteres acentuados
        .replace(/[\u0300-\u036f]/g, "") // Remove acentos
        .replace(/[^\w\s]/gi, "") // Remove caracteres especiais como pontos, hífens, etc.
        .replace(/\s+/g, "") // Remove todos os espaços
        .toLowerCase(); // Converte para minúsculas
};

export function DataTable<TData, TValue>({
    columns,
    data,
    searchValue, // Usando o valor da busca
    dataTableType
}: DataTableProps<any, TValue>) {
    const [sorting, setSorting] = React.useState<SortingState>([]);

    const filteredData = React.useMemo(() => {
        const normalizedSearch = removeSpecialCharacters(searchValue); // Normaliza o valor de busca

        // Filtrar os dados com base no valor de busca em múltiplos campos
        return data.filter((item) => {
            // Concatenando os valores que queremos buscar
            const valuesToSearch = `${item.client} ${item.document} ${item.email} ${item.phone}`;

            // Normalizando os valores e removendo caracteres especiais e espaços
            return removeSpecialCharacters(valuesToSearch).includes(normalizedSearch);
        });
    }, [data, searchValue]);

    const table = useReactTable({
        data: filteredData, // Usar os dados filtrados aqui
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