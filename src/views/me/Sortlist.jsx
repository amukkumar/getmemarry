import React, { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { CaretSortIcon, ChevronDownIcon } from "@radix-ui/react-icons"
import { flexRender, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, useReactTable } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import axios from "axios"
import { useNavigate } from "react-router-dom"
import { useSelector } from "react-redux";
import AvatarPic from "../inbox/avatar"
import { useToast } from "@/components/ui/use-toast"

const Sortlist = () => {

    const apiUrl = import.meta.env.VITE_API_URL;
    const navigate = useNavigate();
    const { toast } = useToast();
    const user = useSelector((state) => state.global.user.payload);
    const [selected, setSelected] = useState([]);
    const [data, setData] = useState([]);
    const [sorting, setSorting] = useState([]);
    const [columnFilters, setColumnFilters] = useState([]);
    const [columnVisibility, setColumnVisibility] = useState({});
    const [rowSelection, setRowSelection] = useState({});

    const columns = [
        {
            id: 'select',
            header: ({ table }) => (
                <Checkbox
                    checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && 'indeterminate')}
                    onCheckedChange={(value) => {
                        table.getIsAllPageRowsSelected() ? setSelected([]) : setSelected(data)
                        table.toggleAllPageRowsSelected(!!value)
                    }}
                    aria-label="Select all"
                />
            ),
            cell: ({ row }) => (
                <Checkbox
                    checked={row.getIsSelected()}
                    onCheckedChange={(value) => {
                        handleClick(row);
                        row.toggleSelected(!!value);
                    }}
                    aria-label="Select row"
                />
            ),
            enableSorting: false,
            enableHiding: false,
        },
        {
            accessorKey: 'sno',
            header: 'Sno',
            cell: ({ row }) => <div className="capitalize">{row.index + 1}</div>,
        },
        {
            accessorKey: 'profile',
            header: 'Profile',
            cell: ({ row }) => <div>< AvatarPic id={row.original.ref_userid} /></div>,
        },
        {
            accessorKey: 'ref_username',
            header: 'ID',
            cell: ({ row }) => <div className="uppercase">{row.getValue('ref_username')}</div>,
        },
        {
            accessorKey: 'ref_userfirstname',
            header: ({ column }) => (
                <Button variant="ghost" className="p-0" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
                    Name
                    <CaretSortIcon className="ml-2 h-4 w-4" />
                </Button>
            ),
            cell: ({ row }) => <div className="capitalize">{row.getValue('ref_userfirstname') + " " + row.original.ref_userlastname}</div>,
        },
        {
            id: 'actions',
            header: 'View',
            enableHiding: false,
            cell: ({ row }) => {
                return (
                    <Button onClick={() => navigate('/profile/' + row.original.ref_username)} size='sm' className="h-6 w-16 p-4 text-md">
                        View
                    </Button>
                );
            },
        },
        {
            id: 'dactions',
            header: 'Delete',
            enableHiding: false,
            cell: ({ row }) => {
                return (
                    <Button onClick={() => removeSortlist(row.original.lisid)} size='sm' variant="destructive" className="h-6 w-16 p-4 text-md">
                        Delete
                    </Button>
                );
            },
        },
    ];

    const table = useReactTable({
        data,
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
    });

    const removeSortlist = (id) => {
        axios.get(apiUrl + 'watchedprofiles.php', {
            params: {
                token: user?.token,
                id: id,
                remove: 1
            }
        })
            .then(function (response) {
                if (response.data.success) {
                    toast({
                        variant: "success",
                        description: response.data.message,
                    })
                    setData(response.data.data)
                }
                else {
                    toast({
                        variant: "destructive",
                        description: response.data.message,
                    })
                }
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    const removeSelectSortlist = () => {
        const formData = new FormData();
        formData.append("token", user?.token);
        formData.append("groupaction", "Delete");
        selected.map((item) => (
            formData.append("txtcheck[]", item.lisid)
        ))
        axios.post(apiUrl + 'watchedprofiles.php', formData)
            .then(function (response) {
                if (response.data.success) {
                    toast({
                        variant: "success",
                        description: response.data.message,
                    })
                    setData(response.data.data)
                }
                else {
                    toast({
                        variant: "destructive",
                        description: response.data.message,
                    })
                }
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    const getSortlist = () => {
        axios.get(apiUrl + 'watchedprofiles.php', {
            params: {
                token: user?.token,
                act: "get",
            }
        })
            .then(function (response) {
                if (response.data.success) {
                    setData(response?.data?.data)
                }
                else {
                    toast({
                        variant: "destructive",
                        description: response.data.message,
                    })
                }
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    const handleClick = (row) => {
        setSelected(prevData => {
            if (prevData.includes(row.original)) {
                // Remove the item (pop)
                return prevData.filter(item => item !== row.original);
            } else {
                // Add the item (push)
                return [...prevData, row.original];
            }
        });
    };

    console.log(selected)

    useEffect(() => {
        getSortlist();
    }, [])

    return (
        <div className="bg">
            <div className="container p-3">
                <div className="section-title text-center relative pb-3 pt-14 wow fadeInUp" data-wow-delay="0.1s">
                    <h5 className="font-bold text-2xl text-primary uppercase">Your Favourite Partners</h5>
                    <p className="font-bold text-4xl">Sortlist Partner</p>
                </div>
                <Card className="w-full mt-8">
                    <CardContent className='px-3'>
                        <div className="flex items-center py-4">
                            <Input
                                placeholder="Search by name..."
                                value={(table.getColumn('ref_userfirstname')?.getFilterValue() || '')}
                                onChange={(event) => table.getColumn('ref_userfirstname')?.setFilterValue(event.target.value)}
                                className="max-w-sm"
                            />
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="outline" className="ml-auto">
                                        Columns <ChevronDownIcon className="ml-2 h-4 w-4" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    {table
                                        .getAllColumns()
                                        .filter((column) => column.getCanHide())
                                        .map((column) => (
                                            <DropdownMenuCheckboxItem
                                                key={column.id}
                                                className="capitalize"
                                                checked={column.getIsVisible()}
                                                onCheckedChange={(value) => column.toggleVisibility(!!value)}
                                            >
                                                {column.id}
                                            </DropdownMenuCheckboxItem>
                                        ))}
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                        <div className="rounded-md border">
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
                                    {table.getRowModel().rows.length ? (
                                        table.getRowModel().rows.map((row) => (
                                            <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
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
                        <div className="flex items-center justify-end pt-4">
                            <div className="flex-1 text-sm text-muted-foreground">
                                <Button variant='destructive' onClick={removeSelectSortlist}>Delete Selected</Button>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                {table.getFilteredSelectedRowModel().rows.length} of{' '}
                                {table.getFilteredRowModel().rows.length} row(s) selected.
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}


export default Sortlist