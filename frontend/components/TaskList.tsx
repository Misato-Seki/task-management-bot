import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { format } from "date-fns"
import { Task } from "../app/types/global"
import { Clock3 } from 'lucide-react';

type Props = {
  tasks: Task[]
}

export const TaskList = ({ tasks }: Props) => {
  return (
    <Accordion type="multiple" className="grid grid-cols-3 gap-4">
      {tasks.map((task) => (
        <AccordionItem value={`task-${task.id}`} key={task.id}>
          <Card className="w-full">
            <CardHeader className="flex flex-row justify-between items-center">
              <CardTitle className="text-xl">{task.title}</CardTitle>
              <div className="flex items-center gap-3">
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

            <AccordionTrigger className="px-4 py-2">Show Checklist</AccordionTrigger>
            <AccordionContent>
              <CardContent>
                <ul className="space-y-2">
                  {task.checklist?.map((item) => (
                    <li key={item.id} className="flex justify-between items-center">
                      <div>                      
                        <Checkbox checked={item.completed} className="mr-3"/>
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
          </Card>
        </AccordionItem>
      ))}
    </Accordion>
  )
}
