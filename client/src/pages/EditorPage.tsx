import React from "react";
import Task from "../models/task";
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarHeader, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";


const mockTask: Task = {
    id: "1",
    title: "Sample Task",
    description: "This is a sample task description.",
    status: "pending",
    userId: "user123",
    createdAt: new Date(),
    updatedAt: new Date(),
}

export const EditorPage: React.FC = () => {
    return (
        <SidebarProvider>
            <Sidebar>
                <SidebarHeader />
                <SidebarContent>
                    <SidebarGroup />
                    <SidebarGroup />
                </SidebarContent>
                <SidebarFooter />
            </Sidebar>
            <main>
            <SidebarTrigger />
            </main>
        </SidebarProvider>
    );
}
