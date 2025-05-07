import {
  Trash2,
  Plus,
  MoreHorizontal,
  type LucideIcon,
  Edit,
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

import { useParams } from "react-router-dom"
import { Button } from "./ui/button"
import { Label } from "./ui/label"
import { Input } from "./ui/input"
import { useState } from "react"

interface Group {
  id: string
  name: string
}

function DeleteDialog({
  group, deleteItem, open, setOpen
}: { group: Group, deleteItem: (id: string) => Promise<boolean>, open: boolean, setOpen: (open: boolean) => void }) {
  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Deletar lista "{group.name}"?</AlertDialogTitle>
          <AlertDialogDescription>
            Essa ação não pode ser desfeita. Isso excluirá
            permanentemente a lista e todos os itens dentro dela.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction onClick={() => deleteItem(group.id)}>Confirmar</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

function CreateDialog({
  groupList, createItem, open, setOpen
}: { groupList: Array<Group>, createItem: (title: string) => Promise<boolean>, open: boolean, setOpen: (open: boolean) => void }) {
  const [title, setTitle] = useState("")
  const [validationError, setValidationError] = useState("")

  const onSubmit = () => {
    if(validationError)
      return
    setOpen(false)
    createItem(title)
  }

  const onTitleChange = (e: any) => {
    setTitle(e.target.value)
    if (groupList.find((group) => group.name === e.target.value)) {
      setValidationError("Já existe uma lista com esse nome")
      return
    }
    if (e.target.value.length < 1) {
      setValidationError("O nome da lista não pode ser vazio")
      return
    }
    setValidationError("")
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Criar nova lista</DialogTitle>
        </DialogHeader>
        <div className="flex items-center space-x-2">
          <div className="grid flex-1 gap-2">
            {validationError && (
              <div className="text-red-500 text-sm">
                {validationError}
              </div>
            )}
            <Label htmlFor="list-name" className="sr-only">
              Nome
            </Label>
            <Input
              id="list-name"
              onChange={(e) => onTitleChange(e)}
              defaultValue={title}
            />
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Fechar
            </Button>
          </DialogClose>
          <Button onClick={() => onSubmit()}>Criar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function EditDialog({
  group, groupList, editItem, open, setOpen
}: { group: Group, groupList: Array<Group>, editItem: (id: string, title: string) => Promise<boolean>, open: boolean, setOpen: (open: boolean) => void }) {
  const [newTitle, setNewTitle] = useState(group.name)
  const [validationError, setValidationError] = useState("")

  const onSubmit = () => {
    if(validationError)
      return
    setOpen(false)
    editItem(group.id, newTitle)
  }

  const onTitleChange = (e: any) => {
    setNewTitle(e.target.value)
    if (groupList.find((g) => g.name === e.target.value && g.id != group.id)) {
      setValidationError("Já existe uma lista com esse nome")
      return
    }
    if (e.target.value.length < 1) {
      setValidationError("O nome da lista não pode ser vazio")
      return
    }
    setValidationError("")
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Renomear lista "{group.name}"</DialogTitle>
        </DialogHeader>
        <div className="flex items-center space-x-2">
          <div className="grid flex-1 gap-2">
            {validationError && (
              <div className="text-red-500 text-sm">
                {validationError}
              </div>
            )}
            <Label htmlFor="list-name" className="sr-only">
              Nome
            </Label>
            <Input
              id="list-name"
              defaultValue={group.name}
              onChange={(e) => onTitleChange(e)}
            />
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Fechar
            </Button>
          </DialogClose>
          <Button onClick={() => onSubmit()}>Renomear</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export function NavProjects({
    projects, deleteItem, createItem, editItem
}: {
  projects: {
    id: string,
    name: string
    url: string
    icon: LucideIcon
  }[],
  deleteItem: (id: string) => Promise<boolean>
  createItem: (id: string) => Promise<boolean>
  editItem: (id: string, title: string) => Promise<boolean>
}) {
  const { isMobile } = useSidebar()
  const params = useParams()
  const [shouldDelete, setShouldDelete] = useState(false)
  const [shouldCreate, setShouldCreate] = useState(false)
  const [shouldEdit, setShouldEdit] = useState(false)
  const [item, setItem] = useState({} as { id: string, name: string })

  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel>Listas</SidebarGroupLabel>
      <SidebarMenu>

        <DeleteDialog group={item} deleteItem={deleteItem} open={shouldDelete} setOpen={setShouldDelete} />
        <EditDialog group={item} groupList={projects} editItem={editItem} open={shouldEdit} setOpen={setShouldEdit} />

        {projects.map((item) => (
          <SidebarMenuItem key={item.id}>
            <SidebarMenuButton asChild isActive={item.id === params.projectId}>
              <a href={item.url}>
                <item.icon />
                <span>{item.name}</span>
              </a>
            </SidebarMenuButton>

            <DropdownMenu modal={false}>
              <DropdownMenuTrigger asChild>
                <SidebarMenuAction showOnHover>
                  <MoreHorizontal />
                  <span className="sr-only">Mais</span>
                </SidebarMenuAction>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-48"
                side={isMobile ? "bottom" : "right"}
                align={isMobile ? "end" : "start"}
              >
                <DropdownMenuItem onClick={() => { setItem(item); setShouldEdit(true) }}>
                  <Edit className="text-muted-foreground" />
                  <span>Renomear</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => { setItem(item); setShouldDelete(true) }}>
                  <Trash2 className="text-muted-foreground" />
                  <span>Deletar lista</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

          </SidebarMenuItem>
        ))}

        <CreateDialog groupList={projects} createItem={createItem} open={shouldCreate} setOpen={setShouldCreate}/>

        <SidebarMenuItem onClick={() => setShouldCreate(true)}>
          <SidebarMenuButton asChild className="min-w-8 bg-primary text-primary-foreground duration-200 ease-linear hover:bg-primary/90 hover:text-primary-foreground active:bg-primary/90 active:text-primary-foreground">
            <a href="#">
              <Plus />
              <span>Criar lista</span>
            </a>
          </SidebarMenuButton>
        </SidebarMenuItem>

      </SidebarMenu>
    </SidebarGroup>
  )
}
