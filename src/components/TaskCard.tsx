
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Cake, Clock, ChevronDown, ChevronUp, Trash2 } from "lucide-react";
import { useAppContext } from "@/context/AppContext";
import { Task, CakeFlavor } from "@/context/AppContext";
import { Timer } from "./Timer";
import { Badge } from "@/components/ui/badge";

interface TaskCardProps {
  task: Task;
}

export const TaskCard = ({ task }: TaskCardProps) => {
  const { completeTask, deleteTask, cakeFlavors } = useAppContext();
  const [timerOpen, setTimerOpen] = useState(false);
  
  const difficultyMap = {
    easy: { label: "Easy", color: "bg-green-100 text-green-700" },
    medium: { label: "Medium", color: "bg-amber-100 text-amber-700" },
    hard: { label: "Hard", color: "bg-red-100 text-red-700" },
  };
  
  const flavor = cakeFlavors.find(f => f.id === task.flavorId) as CakeFlavor;
  
  const handleComplete = () => {
    completeTask(task.id);
  };
  
  const handleDelete = () => {
    deleteTask(task.id);
  };
  
  // If task is completed or deleted, don't render it
  if (task.completed || task.deleted) {
    return null;
  }
  
  return (
    <Card className="cake-card overflow-hidden">
      <CardContent className="pt-6">
        <div className="flex items-start gap-3">
          <Checkbox 
            id={`task-${task.id}`}
            checked={task.completed}
            onCheckedChange={handleComplete}
            className="mt-1"
          />
          
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Cake 
                size={18} 
                style={{ color: typeof flavor.color === 'string' ? flavor.color : '#FEF7CD' }}
              />
              <h3 className="font-medium text-lg line-clamp-2">{task.title}</h3>
            </div>
            
            <div className="flex items-center gap-2">
              <Badge className={difficultyMap[task.difficulty].color}>
                {difficultyMap[task.difficulty].label}
              </Badge>
              
              <p className="text-xs text-muted-foreground">
                {/* Format date to show only day and month */}
                {new Date(task.createdAt).toLocaleDateString(undefined, { 
                  month: 'short', 
                  day: 'numeric' 
                })}
              </p>
            </div>
          </div>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={handleDelete}
            className="text-muted-foreground hover:text-destructive"
          >
            <Trash2 size={18} />
          </Button>
        </div>
      </CardContent>
      
      <Collapsible open={timerOpen} onOpenChange={setTimerOpen}>
        <div className="px-6 pb-3">
          <CollapsibleTrigger asChild>
            <Button variant="ghost" size="sm" className="w-full flex items-center justify-center">
              <Clock size={16} className="mr-2" />
              {timerOpen ? "Hide Timer" : "Show Timer"}
              {timerOpen ? <ChevronUp size={16} className="ml-2" /> : <ChevronDown size={16} className="ml-2" />}
            </Button>
          </CollapsibleTrigger>
        </div>
        
        <CollapsibleContent>
          <CardFooter className="border-t border-border px-3 pt-3 pb-4">
            <Timer taskId={task.id} />
          </CardFooter>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
};
