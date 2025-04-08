"use client"

import React from "react"
import { useSelector, useDispatch } from "react-redux"
import {
    fetchUsers,
    nextPage,
    previousPage,
    setSorting,
    setGlobalFilter,
    setColumnFilter,
} from "@/store/userSlice"
import { RootState, AppDispatch } from "@/store/store"
import {
    Table,
    TableHeader,
    TableRow,
    TableHead,
    TableBody,
    TableCell,
} from "@/components/ui/table"
import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    getSortedRowModel,
    getFilteredRowModel,
    useReactTable,
} from "@tanstack/react-table"
import { ArrowUpDown, ChevronDown } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
} from "@/components/ui/dropdown-menu"

export type Results = {
    name: string
    id: string
    email: string
    gender: string
    age: number
}

const columns: ColumnDef<Results>[] = [
    {
        accessorKey: "name",
        header: ({ column }) => (
            <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                Name <ArrowUpDown />
            </Button>
        ),
    },
    {
        accessorKey: "email",
        header: ({ column }) => (
            <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                Email <ArrowUpDown />
            </Button>
        ),
    },
    {
        accessorKey: "gender",
        header: "Gender",
    },
    {
        accessorKey: "age",
        header: ({ column }) => (
            <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                Age <ArrowUpDown />
            </Button>
        ),
    },
]

export default function DataTableDemo() {
    const dispatch = useDispatch<AppDispatch>()
    const {
        users,
        currentPage,
        isLoading,
        sorting,
        globalFilter,
        columnFilters,
    } = useSelector((state: RootState) => state.users)

    React.useEffect(() => {
        dispatch(fetchUsers(currentPage))
    }, [dispatch, currentPage])

    const table = useReactTable({
        data: users,
        columns,
        state: {
            sorting,
            globalFilter,
            columnFilters: Object.entries(columnFilters).map(([id, value]) => ({
                id,
                value,
            })),
        },
        onSortingChange: (updater) => {
            const newSorting = typeof updater === "function" ? updater(sorting) : updater
            dispatch(setSorting(newSorting))
        },
        onGlobalFilterChange: (value) => dispatch(setGlobalFilter(value)),
        onColumnFiltersChange: (filters) => {
            const updatedFilters = typeof filters === "function" ? filters([]) : filters;
            updatedFilters.forEach((filter) => {
                dispatch(setColumnFilter({ columnId: filter.id, value: filter.value as string }))
            })
        },
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
    })

    return (
        <div className="w-full">
            <div className="flex items-center py-4 space-x-4">
                <Input
                    placeholder="Search..."
                    value={globalFilter ?? ""}
                    onChange={(e) => dispatch(setGlobalFilter(e.target.value))}
                    className="max-w-sm"
                />
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline">
                            Filter Columns <ChevronDown />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start">
                        {table.getAllColumns().map((column) =>
                            column.getCanFilter() ? (
                                <div key={column.id} className="p-2">
                                    <label className="block text-sm capitalize">{column.id}</label>
                                    <Input
                                        placeholder={`Filter ${column.id}`}
                                        value={(column.getFilterValue() as string) ?? ""}
                                        onChange={(e) =>
                                            column.setFilterValue(e.target.value)
                                        }
                                    />
                                </div>
                            ) : null
                        )}
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((group) => (
                            <TableRow key={group.id}>
                                {group.headers.map((header) => (
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
                        {isLoading ? (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="text-center h-24">
                                    Loading...
                                </TableCell>
                            </TableRow>
                        ) : table.getRowModel().rows.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow key={row.id}>
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="text-center h-24">
                                    No results.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            <div className="flex justify-end gap-2 py-4">
                <Button
                    onClick={() => dispatch(previousPage())}
                    disabled={currentPage === 1 || isLoading}
                >
                    Previous
                </Button>
                <Button
                    onClick={() => dispatch(nextPage())}
                    disabled={isLoading}
                >
                    Next
                </Button>
            </div>
        </div>
    )
}
