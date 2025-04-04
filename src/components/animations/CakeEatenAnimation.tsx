
import { useEffect } from "react";
import { Task } from "@/context/AppContext";
import { useAppContext } from "@/context/AppContext";
import { Cake } from "lucide-react";

export const CakeEatenAnimation = ({ task }: { task: Task }) => {
  const { clearAnimation, cakeFlavors } = useAppContext();
  
  // Get the flavor of this cake/task
  const flavor = cakeFlavors.find(f => f.id === task.flavorId);
  const cakeColor = flavor?.color || "#FEF7CD"; // Default to vanilla if not found
  
  useEffect(() => {
    // Clear the animation after it completes
    const timeout = setTimeout(() => {
      clearAnimation();
    }, 1500);
    
    return () => clearTimeout(timeout);
  }, [clearAnimation]);
  
  return (
    <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-50">
      <div className="text-center">
        <div className="inline-block animate-cake-eaten">
          <Cake size={150} className="mx-auto" style={{ 
            color: typeof cakeColor === 'string' ? cakeColor : '#FEF7CD',
            filter: "drop-shadow(0 0 20px rgba(255,255,255,0.8))"
          }} />
          <p className="text-3xl font-bold text-primary mt-4 animate-cake-eaten">
            Yummy!
          </p>
        </div>
      </div>
    </div>
  );
};
