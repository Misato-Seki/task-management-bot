import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"
import { Task } from "../types/global"
import { Clock3, SquareCheckBig } from 'lucide-react';
import TaskEditDialog from "@/components/TaskEditDialog"
import { useState } from "react"
import { deleteTask, updateTask, updateChecklistCompletion, fetchTaskById } from "../hooks/task"

type Props = {
  tasks: Task[],
  refetchTasks: () => void 
}

export const TaskList = ({ tasks, refetchTasks }: Props) => {
  const [selectedTask, setSelectedtask] = useState<Task | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)

  const openEditModal = async(task: Task) => {
    const detailedTask = await fetchTaskById(task.id)
    setSelectedtask(detailedTask)
    setDialogOpen(true)
  }
  return (
    <div className="">
      <Accordion type="multiple" className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {tasks.map((task) => (
          <AccordionItem value={`task-${task.id}`} key={task.id}>
            <Card className="w-full h-full">
              <CardHeader className="flex flex-row justify-between items-center cursor-pointer" onClick={() => openEditModal(task)}>
                <CardTitle className="text-xl mr-3">{task.title}</CardTitle>
                <div className="flex flex-wrap items-center gap-3">
                  <Badge variant="outline">
                      <Clock3/>{task.deadline ? format(new Date(task.deadline), "MM/dd") : "-"}
                    </Badge>
                  <Badge variant={
                    task.status === "REMINDER" ? "secondary" :
                    task.status === "NOT_STARTED" ? "taskBotPink" : 
                    task.status === "IN_PROGRESS" ? "taskBotBlue" : "default"
                  }>
                    {task.status === "COMPLETED" ? "COMPLETED" : task.status === "IN_PROGRESS" ? "IN PROGRESS" : task.status === "NOT_STARTED" ? "NOT STARTED" : "REMINDER"}
                  </Badge>
                </div>
              </CardHeader>

              {task.checklist && task.checklist.length > 0 && (
                <>
                  <AccordionTrigger className="px-6 py-2 cursor-pointer justify-start">
                    <span className="flex flex-row gap-2 text-[#5093B4]">
                      <SquareCheckBig color="#5093B4" size={20}/>{task.completedCount}/{task.checklistCount}
                    </span>
                  </AccordionTrigger>
                  <AccordionContent>
                    <CardContent>
                      <ul className="space-y-2">
                        {task.checklist?.map((item) => (
                          <li key={item.id} className="flex justify-between items-center">
                            <div>                      
                              <input
                                type="checkbox"
                                checked={item.completed} 
                                onChange={async () => {
                                  await updateChecklistCompletion(item.id, !item.completed, refetchTasks)
                                }}
                                onClick={(e) => e.stopPropagation()}
                                className="accent-[#5093B4] w-4 h-4 rounded border-2 border-[#49454F] mr-3"/>
                              <span className={item.completed ? "line-through text-muted-foreground" : ""}>
                                {item.title}
                              </span>
                            </div>
                            <Badge variant="outline" className="justify-items-end">
                              <Clock3/>{item.deadline ? format(new Date(item.deadline), "MM/dd") : ""}
                            </Badge>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </AccordionContent>
                </>
              )}
            </Card>
          </AccordionItem>
        ))}
      </Accordion>
      
      {/* Edit/Delete Task */}
      <TaskEditDialog
        task={selectedTask}
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onSave={async(task, checklist) => {
          if(!task) return
          await updateTask(task?.id, task, checklist, refetchTasks)
          setDialogOpen(false)
        }}
        onDelete={async() => {
          if(!selectedTask) return
          await deleteTask(selectedTask.id, refetchTasks)
          setDialogOpen(false)
        }
        }
      />
    </div>

  )
}
