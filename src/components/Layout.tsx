
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import { useAppContext } from "@/context/AppContext";
import { CakeEatenAnimation } from "./animations/CakeEatenAnimation";
import { CakeRotAnimation } from "./animations/CakeRotAnimation";

const Layout = () => {
  const { currentAnimation, tasks } = useAppContext();
  
  // Find the current task for the animation
  const animatedTask = currentAnimation.taskId 
    ? tasks.find(task => task.id === currentAnimation.taskId) 
    : null;
  
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      
      <main className="flex-1 container mx-auto py-6 px-4">
        <Outlet />
      </main>
      
      {/* Animations */}
      {currentAnimation.type === 'eat' && animatedTask && (
        <CakeEatenAnimation task={animatedTask} />
      )}
      
      {currentAnimation.type === 'rot' && animatedTask && (
        <CakeRotAnimation task={animatedTask} />
      )}
    </div>
  );
};

export default Layout;
