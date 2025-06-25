"use client";

import NavBar from "@/components/NavBar";
import { fetchTasks } from "../hooks/task";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import TaskEditDialog from "@/components/TaskEditDialog";
import { TaskList } from "@/components/TaskList";

const data = await fetchTasks()
export default function Task() {
  const [ addDialogOpen, setAddDialogOpen ] = useState(false);

  return (
    <>
      <div className="min-h-screen bg-[#F1F7F8] flex flex-col">
        <NavBar />
        <div className="container mx-auto py-10">
          <Button
            variant="taskbotBlue"
            className="mb-10"
            onClick={() => setAddDialogOpen(true)}
          >+ Add New Task</Button>
          <TaskList tasks={data}/>
        </div>
      </div>

      {/* Add New Task */}
      <TaskEditDialog
        task = {null}
        open = {addDialogOpen}
        onClose = {() => setAddDialogOpen(false)}
        onSave = {() => {}}
        onDelete = {() => {}}
      />
    </>


  )
}