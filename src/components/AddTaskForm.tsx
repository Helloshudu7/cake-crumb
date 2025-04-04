
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAppContext } from "@/context/AppContext";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { PlusCircle, Cake } from "lucide-react";

export const AddTaskForm = () => {
  const { addTask, cakeFlavors } = useAppContext();
  const [title, setTitle] = useState("");
  const [flavorId, setFlavorId] = useState("vanilla"); // Default to vanilla
  const [difficulty, setDifficulty] = useState<"easy" | "medium" | "hard">("easy");
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) return;
    
    addTask({
      title,
      flavorId,
      difficulty,
    });
    
    // Reset form
    setTitle("");
  };
  
  // Filter to only show owned flavors
  const availableFlavors = cakeFlavors.filter(flavor => flavor.owned);
  
  return (
    <Card className="cake-card">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center">
          <PlusCircle size={20} className="mr-2 text-primary" />
          Add New Cake Task
        </CardTitle>
      </CardHeader>
      
      <form onSubmit={handleSubmit}>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Input
                placeholder="What do you need to do?"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full"
              />
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <Select
                  value={flavorId}
                  onValueChange={(value) => setFlavorId(value)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Cake Flavor" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableFlavors.map((flavor) => (
                      <SelectItem key={flavor.id} value={flavor.id} className="flex items-center">
                        <div className="flex items-center">
                          <Cake 
                            size={16} 
                            className="mr-2"
                            style={{ color: typeof flavor.color === 'string' ? flavor.color : '#FEF7CD' }}
                          />
                          {flavor.name}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Select
                  value={difficulty}
                  onValueChange={(value: "easy" | "medium" | "hard") => setDifficulty(value)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Difficulty" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="easy">Easy (20 coins)</SelectItem>
                    <SelectItem value="medium">Medium (50 coins)</SelectItem>
                    <SelectItem value="hard">Hard (100 coins)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </CardContent>
        
        <CardFooter>
          <Button type="submit" className="w-full">
            Add Task
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};
