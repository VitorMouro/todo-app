import * as React from "react"
import {
  Notebook,
  List
} from "lucide-react"

import { NavProjects } from "@/components/nav-projects"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

import { useAuth } from "@/contexts/AuthContext"
import axiosInstance from "@/api/axiosInstance"
import { useNavigate, useParams } from "react-router-dom"


export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {

  const { user } = useAuth()
  const [groups, setGroups] = React.useState([])
  const [shouldUpdate, setShouldUpdate] = React.useState(false)
  const params = useParams()
  const navigate = useNavigate()

  React.useEffect(() => {
    const fetchData = async () => {
      const response = await axiosInstance.get("/groups");
      const sorted = response.data.sort((a: any, b: any) => a.name.localeCompare(b.name));
      setGroups(sorted);
      if (!params.projectId && sorted.length > 0)
        navigate(`/dashboard/${sorted[0].id}`);
    }
    fetchData();
    setShouldUpdate(false)
  }, [shouldUpdate, params.projectId, navigate]);

  const deleteItem = async (id: string) => {
    const response = await axiosInstance.delete("/groups/" + id);
    if (!response.data.id)
      return false;
    if (params.projectId === id)
      navigate("/dashboard");
    setShouldUpdate(true)
    return true;
  }

  const createItem = async (title: string) => {
    const response = await axiosInstance.post("/groups", {name: title});
    if (!response.data.id)
      return false;
    navigate("/dashboard/" + response.data.id);
    setShouldUpdate(true)
    return true;
  }

  const editItem = async (id: string, title: string) => {
    const response = await axiosInstance.put("/groups/" + id, {name: title});
    if (!response.data.id)
      return false;
    setShouldUpdate(true)
    return true;
  }

  const data = {
    user: {
      email: user?.email || "",
    },
    projects: groups.map((group: any) => ({
      id: group.id,
      name: group.name,
      url: "/dashboard/" + group.id,
      icon: List,
    })),
  }

  return (
    <Sidebar
      {...props}
    >
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="/dashboard">
                <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                  <Notebook className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">ViLista</span>
                  <span className="truncate text-xs">Tarefas + Markdown + Vim</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavProjects projects={data.projects} deleteItem={deleteItem} createItem={createItem} editItem={editItem}/>
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  )
}
