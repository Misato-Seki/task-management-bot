"use client";

import NavBar from "@/components/NavBar";
import { fetchTasks } from "../hooks/task";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import TaskEditDialog from "@/components/TaskEditDialog";
import { TaskList } from "@/app/task/TaskList";
import { createTask } from "../hooks/task";
import type { Task } from "../types/global";

export default function Task() {
  const [ addDialogOpen, setAddDialogOpen ] = useState(false);
  const [tasks, setTasks] = useState<Task[]>([])
  const [taskError, setTaskError] = useState<string | null>(null);
  const [taskLoading, setTaskLoading] = useState(true);

  useEffect(() => {
    fetchTasks(setTasks, setTaskError, setTaskLoading)
  }, [])

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
          {taskLoading ? (
            <div className="text-[#5093B4]">Loading...</div>
          ) : taskError ? (
            <div className="text-red-500">{taskError}</div>
          ) : tasks.length === 0 ? (
            <div className="text-gray-500">No tasks.</div>
          ) : (
            <TaskList tasks={tasks}/>
          )}
        </div>
      </div>

      {/* Add New Task */}
      <TaskEditDialog
        task = {null}
        open = {addDialogOpen}
        onClose = {() => setAddDialogOpen(false)}
        onSave={async (task, checklist) => {
            if (!task) return;
            await createTask(task, checklist, () => fetchTasks(setTasks, setTaskError, setTaskLoading));
            setAddDialogOpen(false);
        }}
        onDelete = {() => {}}
      />
    </>


  )
}