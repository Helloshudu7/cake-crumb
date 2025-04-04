
import { useEffect } from "react";
import { Task } from "@/context/AppContext";
import { useAppContext } from "@/context/AppContext";
import { Trash2 } from "lucide-react";

export const CakeRotAnimation = ({ task }: { task: Task }) => {
  const { clearAnimation } = useAppContext();
  
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
        <div className="inline-block animate-cake-rot">
          <Trash2 size={150} className="mx-auto text-destructive" />
          <p className="text-3xl font-bold text-destructive mt-4 animate-cake-rot">
            Cake Tossed!
          </p>
        </div>
      </div>
    </div>
  );
};
