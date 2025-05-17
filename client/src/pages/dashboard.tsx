import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { useCookies } from "react-cookie"
import { useParams } from "react-router-dom"
import { useState, useEffect } from "react"
import axiosInstance from "@/api/axiosInstance"
import { Task, DataTable } from "@/components/data-table"

export default function Dashboard() {

  const [cookies] = useCookies(['sidebar_state']);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [tasksModified, setTasksModified] = useState(true);
  const params = useParams();

  const fetchData = async () => {
    const response = await axiosInstance.get("/tasks");
    if (response.status !== 200) {
      console.error("Error fetching tasks");
      return;
    }
    const filteredTasks = response.data.filter(
      (task: Task) => task.group_id === params.projectId
    );
    setTasks(filteredTasks.map((task: Task) => ({
      ...task,
      due: task.due, // Ensure due date is a Date object
    })));
    setTasksModified(false);
    return response.data;
  }

  useEffect(() => { fetchData() }, [params.projectId, tasksModified])

  return (
    <div className="[--header-height:calc(theme(spacing.14))]">
      <SidebarProvider className="flex flex-col" defaultOpen={cookies.sidebar_state === true}>
        <div className="flex flex-1">
          <AppSidebar variant="inset" />
          <SidebarInset>
            <SiteHeader />
            <div className="flex flex-1 flex-col">
              <div className="@container/main flex flex-1 flex-col gap-2">
                <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
                  {params.projectId ? (
                    <DataTable data={tasks} setData={setTasks} setTasksModified={setTasksModified}/>
                  ) : (
                    <div className="flex flex-1 items-center justify-center">
                      <div className="text-center">
                        <h3 className="text-2xl font-bold">Bem-vindo!</h3>
                        <p className="mt-2 text-gray-500">Utilize a barra lateral para criar uma lista.</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </div>
  )
}
