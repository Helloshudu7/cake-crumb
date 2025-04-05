
import { useState } from "react";
import { useAppContext } from "@/context/AppContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { RefrigeratorIcon, Check, Trash2, Calendar, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type FilterPeriod = "today" | "week" | "month" | "all";

const Fridge = () => {
  const { tasks, cakeFlavors } = useAppContext();
  const [period, setPeriod] = useState<FilterPeriod>("today");
  const [flavorFilter, setFlavorFilter] = useState<string>("all");

  const completedTasks = tasks.filter(task => task.completed);
  const deletedTasks = tasks.filter(task => task.deleted);

  const getFilteredTasks = (taskList: typeof tasks, period: FilterPeriod) => {
    const now = new Date();
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay()); // Sunday as first day
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    return taskList.filter(task => {
      if (flavorFilter !== "all" && task.flavorId !== flavorFilter) {
        return false;
      }

      const date = task.completed 
        ? new Date(task.completedAt!) 
        : task.deleted 
          ? new Date(task.deletedAt!) 
          : new Date(task.createdAt);
      
      switch (period) {
        case "today":
          return date >= startOfDay;
        case "week":
          return date >= startOfWeek;
        case "month":
          return date >= startOfMonth;
        case "all":
        default:
          return true;
      }
    });
  };

  const filteredCompletedTasks = getFilteredTasks(completedTasks, period);
  const filteredDeletedTasks = getFilteredTasks(deletedTasks, period);

  const groupByFlavor = (taskList: typeof tasks) => {
    const groups: Record<string, typeof tasks> = {};
    
    taskList.forEach(task => {
      if (!groups[task.flavorId]) {
        groups[task.flavorId] = [];
      }
      groups[task.flavorId].push(task);
    });
    
    return groups;
  };

  const completedByFlavor = groupByFlavor(filteredCompletedTasks);
  const deletedByFlavor = groupByFlavor(filteredDeletedTasks);

  const renderFlavorStats = (groupedTasks: Record<string, typeof tasks>) => {
    return Object.keys(groupedTasks).map(flavorId => {
      const flavor = cakeFlavors.find(f => f.id === flavorId);
      const count = groupedTasks[flavorId].length;
      
      return (
        <div 
          key={flavorId}
          className="flex items-center justify-between p-3 rounded-lg"
          style={{ 
            backgroundColor: `${typeof flavor?.color === 'string' ? flavor?.color : '#FEF7CD'}40` 
          }}
        >
          <div className="flex items-center gap-2">
            <div 
              className="w-4 h-4 rounded-full"
              style={{ 
                backgroundColor: typeof flavor?.color === 'string' ? flavor?.color : '#FEF7CD' 
              }}
            ></div>
            <span>{flavor?.name || "Unknown"}</span>
          </div>
          <span className="font-bold">{count}</span>
        </div>
      );
    });
  };

  return (
    <div className="container mx-auto py-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-primary mb-2">Your Cake Fridge</h1>
        <p className="text-muted-foreground">Track your completed and deleted cake tasks</p>
      </div>

      <div className="relative max-w-4xl mx-auto">
        {/* Fridge outer design */}
        <div className="bg-gradient-to-b from-gray-100 to-gray-200 rounded-3xl shadow-xl border-8 border-gray-300 pt-10 pb-16 px-6 relative">
          {/* Fridge handle */}
          <div className="absolute top-1/4 -right-6 h-32 w-4 bg-gray-400 rounded-r-full"></div>
          
          {/* Fridge top line - where the door would open */}
          <div className="absolute top-[40%] inset-x-0 border-b-4 border-gray-300 border-dashed"></div>

          <div className="flex flex-col sm:flex-row justify-between items-center mb-4">
            <h2 className="text-xl font-bold flex items-center mb-2 sm:mb-0">
              <RefrigeratorIcon className="mr-2 text-cyan-600 drop-shadow-sm" />
              Fridge Contents
            </h2>

            <div className="flex flex-wrap gap-2">
              <div>
                <Select value={period} onValueChange={(value: FilterPeriod) => setPeriod(value)}>
                  <SelectTrigger className="w-[140px]">
                    <Calendar className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Period" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="today">Today</SelectItem>
                    <SelectItem value="week">This Week</SelectItem>
                    <SelectItem value="month">This Month</SelectItem>
                    <SelectItem value="all">All Time</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Select value={flavorFilter} onValueChange={setFlavorFilter}>
                  <SelectTrigger className="w-[140px]">
                    <SlidersHorizontal className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Flavor" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Flavors</SelectItem>
                    {cakeFlavors.filter(f => f.owned).map(flavor => (
                      <SelectItem key={flavor.id} value={flavor.id}>
                        {flavor.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <Tabs defaultValue="eaten" className="mt-6">
            <TabsList className="w-full grid grid-cols-2 mb-6 bg-gray-100/70">
              <TabsTrigger value="eaten" className="flex items-center gap-2 data-[state=active]:bg-white/80">
                <Check size={16} className="text-green-500" />
                <span>Eaten Cakes</span>
              </TabsTrigger>
              <TabsTrigger value="rotten" className="flex items-center gap-2 data-[state=active]:bg-white/80">
                <Trash2 size={16} className="text-red-500" />
                <span>Rotten Cakes</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="eaten" className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="backdrop-blur-sm bg-white/70 border-none shadow-sm">
                  <CardContent className="pt-6">
                    <h3 className="font-bold mb-4">Eaten Cakes by Flavor</h3>
                    {Object.keys(completedByFlavor).length > 0 ? (
                      <div className="space-y-2">
                        {renderFlavorStats(completedByFlavor)}
                      </div>
                    ) : (
                      <div className="text-muted-foreground text-center py-4 bg-white/50 rounded-lg">
                        <p>No eaten cakes for this period</p>
                        <span className="text-3xl mt-2 block">🍽️</span>
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card className="backdrop-blur-sm bg-white/70 border-none shadow-sm">
                  <CardContent className="pt-6">
                    <h3 className="font-bold mb-4">Cake Details</h3>
                    {filteredCompletedTasks.length > 0 ? (
                      <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2 fridge-scrollbar">
                        {filteredCompletedTasks.map(task => (
                          <TaskItem 
                            key={task.id} 
                            task={task} 
                            flavor={cakeFlavors.find(f => f.id === task.flavorId)} 
                            icon={<Check size={16} className="text-green-500" />}
                          />
                        ))}
                      </div>
                    ) : (
                      <div className="text-muted-foreground text-center py-4 bg-white/50 rounded-lg">
                        <p>No eaten cakes for this period</p>
                        <span className="text-3xl mt-2 block">🍽️</span>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="rotten" className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="backdrop-blur-sm bg-white/70 border-none shadow-sm">
                  <CardContent className="pt-6">
                    <h3 className="font-bold mb-4">Rotten Cakes by Flavor</h3>
                    {Object.keys(deletedByFlavor).length > 0 ? (
                      <div className="space-y-2">
                        {renderFlavorStats(deletedByFlavor)}
                      </div>
                    ) : (
                      <div className="text-muted-foreground text-center py-4 bg-white/50 rounded-lg">
                        <p>No rotten cakes for this period</p>
                        <span className="text-3xl mt-2 block">🧹</span>
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card className="backdrop-blur-sm bg-white/70 border-none shadow-sm">
                  <CardContent className="pt-6">
                    <h3 className="font-bold mb-4">Cake Details</h3>
                    {filteredDeletedTasks.length > 0 ? (
                      <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2 fridge-scrollbar">
                        {filteredDeletedTasks.map(task => (
                          <TaskItem 
                            key={task.id} 
                            task={task} 
                            flavor={cakeFlavors.find(f => f.id === task.flavorId)} 
                            icon={<Trash2 size={16} className="text-red-500" />}
                          />
                        ))}
                      </div>
                    ) : (
                      <div className="text-muted-foreground text-center py-4 bg-white/50 rounded-lg">
                        <p>No rotten cakes for this period</p>
                        <span className="text-3xl mt-2 block">🧹</span>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
        
        {/* Fridge magnet stats */}
        <div className="dashboard-section mt-8">
          <h2 className="text-xl font-bold mb-4">Productivity Stats</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Add fridge magnet styling to the stat cards */}
            <StatsCard 
              label="Completion Rate" 
              value={`${calculateCompletionRate(completedTasks, deletedTasks)}%`} 
              description="Tasks completed vs. deleted"
              icon={<Check size={20} className="text-green-500" />}
              className="transform rotate-1 shadow-lg"
            />
            <StatsCard 
              label="Total Completed" 
              value={completedTasks.length.toString()}
              description="All time eaten cakes"
              icon={<Check size={20} className="text-green-500" />}
              className="transform -rotate-1 shadow-lg"
            />
            <StatsCard 
              label="Total Deleted" 
              value={deletedTasks.length.toString()}
              description="All time rotten cakes"
              icon={<Trash2 size={20} className="text-red-500" />}
              className="transform rotate-2 shadow-lg"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

const TaskItem = ({ task, flavor, icon }: { 
  task: any, 
  flavor: any, 
  icon: React.ReactNode 
}) => {
  const date = task.completed 
    ? new Date(task.completedAt) 
    : task.deleted 
      ? new Date(task.deletedAt)
      : new Date(task.createdAt);

  return (
    <div className="flex items-center justify-between p-3 bg-white/60 rounded-lg shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center gap-2">
        {icon}
        <span className="line-clamp-1">{task.title}</span>
      </div>
      <div className="flex items-center gap-2">
        <div 
          className="w-3 h-3 rounded-full"
          style={{ 
            backgroundColor: typeof flavor?.color === 'string' ? flavor?.color : '#FEF7CD' 
          }}
        ></div>
        <span className="text-xs text-muted-foreground">
          {date.toLocaleDateString()}
        </span>
      </div>
    </div>
  );
};

const StatsCard = ({ 
  label, 
  value, 
  description, 
  icon,
  className
}: { 
  label: string; 
  value: string; 
  description: string; 
  icon: React.ReactNode;
  className?: string;
}) => (
  <Card className={`bg-white/90 border-2 border-gray-300 shadow-md ${className}`}>
    <CardContent className="pt-6">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className="text-3xl font-bold">{value}</p>
          <p className="text-xs text-muted-foreground mt-1">{description}</p>
        </div>
        <div className="p-2 bg-muted rounded-full">
          {icon}
        </div>
      </div>
    </CardContent>
  </Card>
);

const calculateCompletionRate = (completed: any[], deleted: any[]) => {
  const total = completed.length + deleted.length;
  if (total === 0) return 0;
  
  return Math.round((completed.length / total) * 100);
};

export default Fridge;
