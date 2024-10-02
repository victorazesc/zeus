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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { EmptyState } from "../empty-state";
import { EmptyStateType } from "@/constants/empty-state";
import { PROPOSAL_STATUS, Status } from "@/constants/proposal-status";

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[];
    data: TData[];
    searchValue: string; // Recebe o valor de busca
    searchFields?: (keyof TData | string)[]; // Campos para filtrar dinamicamente (permitindo campos aninhados como "customer.name")
    dataTableType: EmptyStateType;
    rowProps?: (row: Row<TData>) => React.HTMLAttributes<HTMLTableRowElement>; // Adicionando rowProps para personalizar as linhas
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

// Função para obter valor de campos aninhados como "customer.name" ou "user.name"
const getNestedValue = (obj: any, path: string) => {
    return path.split('.').reduce((value, key) => (value && value[key] ? value[key] : ""), obj);
};

export function DataTable<TData, TValue>({
    columns,
    data,
    searchValue,
    searchFields = [],
    dataTableType,
    rowProps, // Recebendo rowProps como prop
}: DataTableProps<TData, TValue>) {
    const [sorting, setSorting] = React.useState<SortingState>([]);

    // Filtrando dinamicamente com base nos campos fornecidos
    const filteredData = React.useMemo(() => {
        const normalizedSearch = removeSpecialCharacters(searchValue);

        return data.filter((item) => {
            // Se não foram especificados campos, retorna todos os itens
            if (!searchFields.length) return true;

            return searchFields.some((field) => {
                let fieldValue = "";

                // Verifica se o campo é especificamente o status para usar a tradução
                if (field === "status") {
                    const statusKey = (item as any)["status"] as Status; // Acessa o campo "status" de forma segura
                    fieldValue = PROPOSAL_STATUS[statusKey]?.label || "";
                } else {
                    // Para outros campos, incluindo campos aninhados como "customer.name" e "user.name"
                    fieldValue = getNestedValue(item, field as string) || "";
                }

                return removeSpecialCharacters(String(fieldValue)).includes(normalizedSearch);
            });
        });
    }, [data, searchValue, searchFields]);

    const table = useReactTable({
        data: filteredData, // Usar os dados filtrados
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
                                            : flexRender(header.column.columnDef.header, header.getContext())}
                                    </TableHead>
                                ))}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    data-state={row.getIsSelected() && "selected"}
                                    {...(rowProps ? rowProps(row) : {})} // Aplicando as propriedades personalizadas na linha
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