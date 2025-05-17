import * as React from "react"
import { Task } from "./data-table"
import { DatePicker } from "./date-picker"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { Separator } from "./ui/separator"
import { Sheet, SheetHeader, SheetContent, SheetTitle, SheetFooter, SheetClose } from "./ui/sheet"
import { Textarea } from "./ui/textarea"
import axiosInstance from "@/api/axiosInstance"
import { useParams } from "react-router-dom"

function TaskForm({ task, setTask }: { task: Task | undefined, setTask: (task: Task) => void }) {

  const [title, setTitle] = React.useState<string | undefined>(task?.title)
  const [dueDate, setDueDate] = React.useState<Date | undefined>(task?.due)
  const [status, setStatus] = React.useState<"pending" | "in_progress" | "completed">(task?.status || "pending")
  const [description, setDescription] = React.useState<string | undefined>(task?.description)
  const [errors, setErrors] = React.useState<Map<string, string>>(new Map())

  const validate = () => {
    const newErrors = new Map<string, string>()
    if (!title) {
      newErrors.set("title", "Campo obrigatório")
    }

    setErrors(newErrors)
    if (newErrors.size > 0)
      return false

    setTask({
      id: task?.id || "",
      title: title as string,
      group_id: task?.group_id || "",
      description: description,
      status: status,
      due: dueDate,
    })
    return true
  }

  React.useEffect(() => {
    validate();
  }, [title, dueDate, status, description])

  return (
    <div className="flex flex-col gap-4 h-full">
      <div className="flex flex-col gap-2">
        <Label htmlFor="title">Título<span className="text-red-500">*{errors.get("title")}</span></Label>
        <Input
          id="title"
          defaultValue={title}
          placeholder="Título da tarefa"
          required={true}
          onChange={(e) => {setTitle(e.target.value)}}
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-2">
          <Label htmlFor="status">Status<span className="text-red-500">*{errors.get("status")}</span></Label>
          <Select 
            defaultValue={status || "pending"}
            onValueChange={(e) => {setStatus(e as "pending" | "in_progress" | "completed")}}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Selecione o status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pending">Pendente</SelectItem>
              <SelectItem value="in_progress">Em andamento</SelectItem>
              <SelectItem value="completed">Concluído</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="due">Vencimento<span className="text-red-500">{errors.get("due")}</span></Label>
          <DatePicker date={dueDate} setDate={setDueDate}/>
        </div>
      </div>
      <div className="flex flex-col gap-2 grow">
        <Label htmlFor="description">Descrição<span className="text-red-500">{errors.get("description")}</span></Label>
        <Textarea
          id="description"
          defaultValue={description}
          placeholder="Descrição da tarefa"
          required={true}
          className="grow resize-none"
          onChange={(e) => {setDescription(e.target.value)}}
        />
      </div>
    </div>
  )

}

function TaskView({ task }: { task: Task }) {
  return (
    <div className="flex flex-col gap-4 h-full">
      <div className="flex flex-col gap-2">
        <Label htmlFor="title">Título</Label>
        <p className="text-muted-foreground text-sm">{task?.title}</p>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-2">
          <Label htmlFor="status">Status</Label>
          <p className="text-muted-foreground text-sm">
            {task?.status === "pending" ? "Pendente" : task?.status === "in_progress" ? "Em andamento" : "Concluído"}
          </p>
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="due">Vencimento</Label>
          <p className="text-muted-foreground text-sm">{task?.due ? new Date(task.due).toLocaleDateString() : "ND"}</p>
        </div>
      </div>
      <div className="flex flex-col gap-2 grow">
        <Label htmlFor="description">Descrição</Label>
        <p className="text-muted-foreground text-sm">{task?.description}</p>
      </div>
    </div>
  )
}


export function TaskSheet({
  className,
  open,
  setOpen,
  task,
  setTask,
  mode,
  setMode,
  setTasksModified,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & {
  className?: string
  open: boolean
  setOpen: (open: boolean) => void
  task: Task | undefined
  setTask: (task: Task) => void
  mode: "view" | "edit" | "create"
  setMode: (mode: "view" | "edit" | "create") => void
  setTasksModified: (modified: boolean) => void
}) {

  const params = useParams()

  const submitTask = async (data: Task | undefined) => {

    if (!data) {
      console.log("No task data provided");
      return
    }

    data.group_id = params.projectId || ""

    if (mode === "edit") {
      const response = await axiosInstance.put(`/tasks/${task?.id}`, data)
      if (response.status !== 200) {
        console.error(response.data.message);
        return;
      }
      setMode("view")
      
    } else if (mode === "create") {
      const response = await axiosInstance.post("/tasks", data)
      if (response.status !== 201) {
        console.error(response);
        return;
      }
      setOpen(false)
    }

    setTasksModified(true)
  }

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

        {mode === "view" && task ? (
          <TaskView task={task} />
        ) : (
          <TaskForm task={task} setTask={setTask} />
        )}

        <Separator />

        <SheetFooter className="mt-auto flex gap-2 sm:flex-col sm:space-x-0">
          <Button
            className="w-full"
            onClick={() => { mode === "view" ? setMode("edit") : submitTask(task) }}
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
