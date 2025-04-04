
import { useAppContext } from "@/context/AppContext";
import { TaskCard } from "@/components/TaskCard";
import { AddTaskForm } from "@/components/AddTaskForm";
import { CakeFlavor } from "@/context/AppContext";

const Dashboard = () => {
  const { tasks, cakeFlavors } = useAppContext();
  
  // Filter only active tasks (not completed or deleted)
  const activeTasks = tasks.filter(task => !task.completed && !task.deleted);
  
  // Get the flavor for each task
  const getFlavorName = (flavorId: string): string => {
    const flavor = cakeFlavors.find(f => f.id === flavorId) as CakeFlavor;
    return flavor?.name || "Vanilla";
  };
  
  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold text-primary mb-6 text-center">Your Cake Tasks</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Tasks Column */}
        <div className="md:col-span-8">
          {activeTasks.length === 0 ? (
            <div className="dashboard-section flex flex-col items-center justify-center py-12">
              <Cake size={64} className="text-muted mb-4" />
              <h3 className="text-xl font-medium text-center">No tasks yet!</h3>
              <p className="text-muted-foreground text-center mt-2">
                Add your first task to start earning coins.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {activeTasks.map((task) => (
                <TaskCard key={task.id} task={task} />
              ))}
            </div>
          )}
        </div>
        
        {/* Form Column */}
        <div className="md:col-span-4">
          <AddTaskForm />
          
          <div className="cake-card mt-6">
            <div className="p-4">
              <h3 className="font-bold text-lg mb-2">Cake Difficulty Rewards</h3>
              <ul className="space-y-2">
                <li className="flex justify-between items-center">
                  <span>Easy Cakes:</span>
                  <span className="font-medium">20 coins</span>
                </li>
                <li className="flex justify-between items-center">
                  <span>Medium Cakes:</span>
                  <span className="font-medium">50 coins</span>
                </li>
                <li className="flex justify-between items-center">
                  <span>Hard Cakes:</span>
                  <span className="font-medium">100 coins</span>
                </li>
              </ul>
              
              <div className="mt-4 pt-4 border-t">
                <h3 className="font-bold text-lg mb-2">Timer Rewards</h3>
                <p className="text-sm">Earn 5 berries for every 5 minutes of focused work!</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Cake = ({ size, className }: { size: number, className: string }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M20 10h-2a5 5 0 0 0-10 0H6a3 3 0 1 0 0 6h14a3 3 0 0 0 0-6Z" />
    <path d="M2.5 16C2 17 2 18 2 18c0 .5.5 1 1 1h18c.5 0 1-.5 1-1 0 0 0-1-.5-2" />
    <path d="M3.2 10a4 4 0 0 1 1.5-1.6" />
    <path d="M9 17c.9 0 1.9-.32 2.4-.8" />
    <path d="M16 17c-.9 0-1.9-.32-2.4-.8" />
    <path d="M13 14c-.9 0-1.9-.32-2.4-.8" />
    <path d="M19 14c-.9 0-1.9-.32-2.4-.8" />
  </svg>
);

export default Dashboard;
