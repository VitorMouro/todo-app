import * as React from "react"
import { Task } from "./data-table"
import { DatePicker } from "./date-picker"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { Separator } from "./ui/separator"
import { Sheet, SheetHeader, SheetContent, SheetTitle, SheetFooter, SheetClose } from "./ui/sheet"

export function TaskSheet({
  className,
  open,
  setOpen,
  task,
  mode,
  setMode,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & {
  className?: string
  open: boolean
  setOpen: (open: boolean) => void
  task: Task | undefined
  setTask: (task: Task) => void
  mode: "view" | "edit" | "create"
  setMode: (mode: "view" | "edit" | "create") => void
}) {

  const [dueDate, setDueDate] = React.useState<Date | undefined>(task?.due);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent
        side="right"
        className="flex flex-col w-full sm:max-w-[450px] lg:max-w-[600px] xl:max-w-[800px] p-4"
      >
        <SheetHeader className="gap-1">
          <SheetTitle>
          {
            mode === "view" ? "Visualizar tarefa" : mode === "edit" ? "Editar tarefa" : "Criar tarefa"
          }
          </SheetTitle>
        </SheetHeader>

        <Separator />
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="title">Título</Label>
            {mode === "view" ? (
                <p className="text-muted-foreground text-sm">{task?.title}</p>
              ) : (
                <Input
                  id="title"
                  defaultValue={task?.title}
                  placeholder="Título da tarefa"
                />
              )
            }
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="status">Status</Label>
              {mode === "view" ? (
                <p className="text-muted-foreground text-sm">
                  {task?.status === "pending" ? "Pendente" : task?.status === "in_progress" ? "Em andamento" : "Concluído"}
                </p>
              ) : (
                <Select defaultValue={task?.status || "pending"}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Selecione o status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pendente</SelectItem>
                    <SelectItem value="in_progress">Em andamento</SelectItem>
                    <SelectItem value="completed">Concluído</SelectItem>
                  </SelectContent>
                </Select>
              )}
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="due">Vencimento</Label>
              {mode === "view" ? (
                <p className="text-muted-foreground text-sm">{task?.due.toLocaleDateString()}</p>
              ) : (
                <DatePicker date={dueDate || new Date()} setDate={setDueDate}/>
              )}
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="description">Descrição</Label>
            { mode === "view" ? (
                <p className="text-muted-foreground text-sm">{task?.description}</p>
              ) : (
                <Input
                  id="description"
                  defaultValue={task?.description}
                  placeholder="Descrição da tarefa"
                  required={true}
                />
            )}
          </div>
          <Separator />
        </div>

        <SheetFooter className="mt-auto flex gap-2 sm:flex-col sm:space-x-0">
          <Button
            className="w-full"
            onClick={() => {mode === "edit" ? setMode("view") : mode === "view" ? setMode("edit") : setMode("create")}}
          >{mode === "edit" ? "Salvar" : mode === "view" ? "Editar" : "Criar"}</Button>
          <SheetClose asChild>
            <Button variant="outline" className="w-full">
              Close
            </Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
