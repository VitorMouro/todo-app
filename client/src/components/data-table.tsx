import { ColumnDef, flexRender, getCoreRowModel, getFilteredRowModel, getSortedRowModel, SortingState, useReactTable } from "@tanstack/react-table";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import { ArrowUpDown, MoreHorizontal, CircleCheckBigIcon, CircleDashedIcon, CircleDotIcon } from "lucide-react";
import { Input } from "./ui/input";
import React, { ReactNode } from "react";
import { TaskSheet } from "./task-sheet";
import axiosInstance from '../api/axiosInstance';
import { AlertDialogHeader, AlertDialogFooter, AlertDialog, AlertDialogContent, AlertDialogTitle, AlertDialogDescription, AlertDialogCancel, AlertDialogAction } from "./ui/alert-dialog";

export interface Task {
  id: string;
  title: string;
  group_id: string;
  description: string | undefined;
  status: "pending" | "in_progress" | "completed";
  due: Date | undefined;
}

function DeleteDialog({ task, deleteTask, open, setOpen }: { task: Task, deleteTask: (taskId: string) => Promise<void>, open: boolean, setOpen: (open: boolean) => void }) {
  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Você tem certeza que deseja deletar a tarefa "{task?.title}"?</AlertDialogTitle>
          <AlertDialogDescription>
            Essa ação não poderá ser desfeita.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction onClick={() => deleteTask(task?.id)}>Confirmar</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export function DataTable({ data, setData, setTasksModified }: { data: Task[], setData: React.Dispatch<React.SetStateAction<Task[]>>, setTasksModified: React.Dispatch<React.SetStateAction<boolean>> }) {

  const [sorting, setSorting] = React.useState<SortingState>([])
  const [openTaskSheet, setOpenTaskSheet] = React.useState(false)
  const [modeTaskSheet, setModeTaskSheet] = React.useState<"view" | "edit" | "create">("create")
  const [task, setTask] = React.useState<Task | undefined>(undefined)
  const [openDeleteDialog, setOpenDeleteDialog] = React.useState(false)

  const deleteTask = async (taskId: string) => {
    const result = await axiosInstance.delete("/tasks/" + taskId);
    if (result.status !== 200) {
      console.error("Error deleting task");
      return;
    }
    setTasksModified(true);
  }

  const columns: ColumnDef<Task>[] = [
    {
      accessorKey: "title",
      header: "Título",
      cell: ({ row }) => {
        return (
          <Button
            variant="link"
            className="w-fit px-0 text-left text-foreground"
            onClick={() => {
              setOpenTaskSheet(true)
              setModeTaskSheet("view")
              setTask(row.original)
            }}
          >
            {row.original.title}
          </Button>
        )
      }
    },
    {
      accessorKey: "status",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Status
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => {
        const status: string = row.getValue("status");
        const statusMap: Record<string, ReactNode> = {
          "pending": <div className="flex items-center gap-2 text-yellow-500"><CircleDashedIcon className="h-4 w-4" /> Pendente</div>,
          "in_progress": <div className="flex items-center gap-2 text-blue-500"><CircleDotIcon className="h-4 w-4" /> Em andamento</div>,
          "completed": <div className="flex items-center gap-2 text-green-500"><CircleCheckBigIcon className="h-4 w-4" /> Concluído</div>,
        };
        return statusMap[status] || status;
      }
    },
    {
      accessorKey: "due",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Vencimento
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => {
        const dueValue: string = row.getValue("due");
        if (!dueValue) {
          return "Sem data"
        } else {
          const date = new Date(row.getValue("due"));
          return date.toLocaleDateString("pt-BR");
        }
      }
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const task = row.original
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8">
                <span className="sr-only">Abrir menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => { setTask(task); setOpenDeleteDialog(true) }}>
                Deletar
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
    },
  ]

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
    }
  })

  return (
    <div className="flex flex-1 flex-col gap-4">

      <DeleteDialog task={task as Task} deleteTask={deleteTask} open={openDeleteDialog} setOpen={setOpenDeleteDialog} />

      <TaskSheet open={openTaskSheet} setOpen={setOpenTaskSheet} mode={modeTaskSheet} setMode={setModeTaskSheet} task={task} setTask={setTask} setTasksModified={setTasksModified} />

      <div className="flex items-center justify-between ps-4">
        <div className="flex items-center space-x-2">
          <Button
            className="w-fit"
            onClick={() => {
              setOpenTaskSheet(true)
              setTask(undefined)
              setModeTaskSheet("create")
            }}
          >Adicionar tarefa</Button>
          <Input
            placeholder="Filtrar titulos"
            value={(table.getColumn("title")?.getFilterValue() as string) ?? ""}
            onChange={(event) => {
                table.getColumn("title")?.setFilterValue(event.target.value)
              }
            }
            className="h-8 w-[150px] lg:w-[250px]"
          />

        </div>
      </div>

      <div className="rounded-md border mr-4 ml-4">
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
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  Sem resultados.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
