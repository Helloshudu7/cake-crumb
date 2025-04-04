
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Timer as TimerIcon, Play, Pause, RotateCcw } from "lucide-react";
import { useAppContext } from "@/context/AppContext";
import { useToast } from "@/hooks/use-toast";

interface TimerProps {
  taskId: string;
}

export const Timer = ({ taskId }: TimerProps) => {
  const { startTimer, completeTimer } = useAppContext();
  const { toast } = useToast();
  
  const [duration, setDuration] = useState(15); // Default 15 minutes
  const [timeLeft, setTimeLeft] = useState(duration * 60); // Convert to seconds
  const [isRunning, setIsRunning] = useState(false);
  const [timerId, setTimerId] = useState<string | null>(null);
  
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };
  
  useEffect(() => {
    let interval: number | null = null;
    
    if (isRunning) {
      interval = window.setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            // Timer completed
            clearInterval(interval!);
            setIsRunning(false);
            
            if (timerId) {
              completeTimer(timerId);
              toast({
                title: "Timer completed!",
                description: "You've earned berries for your focused work!",
              });
            }
            
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    
    return () => {
      if (interval !== null) {
        clearInterval(interval);
      }
    };
  }, [isRunning, completeTimer, timerId, toast]);
  
  const handleStart = () => {
    if (!isRunning) {
      const id = startTimer(taskId, duration);
      setTimerId(id);
      setIsRunning(true);
      
      toast({
        title: "Timer started!",
        description: `Focus for ${duration} minutes to earn berries!`,
      });
    }
  };
  
  const handlePause = () => {
    setIsRunning(false);
  };
  
  const handleReset = () => {
    setIsRunning(false);
    setTimeLeft(duration * 60);
    setTimerId(null);
  };
  
  const handleDurationChange = (value: number[]) => {
    const newDuration = value[0];
    setDuration(newDuration);
    setTimeLeft(newDuration * 60);
  };
  
  return (
    <div className="p-4 bg-white bg-opacity-90 rounded-lg border border-bakery-pink">
      <div className="flex items-center mb-4">
        <TimerIcon className="mr-2 text-primary" size={20} />
        <h3 className="font-medium">Focus Timer</h3>
      </div>
      
      <div className="text-center mb-6">
        <div className="text-4xl font-bold mb-2 text-primary">
          {formatTime(timeLeft)}
        </div>
        
        {!isRunning && !timerId && (
          <div className="mb-4">
            <p className="text-sm text-muted-foreground mb-2">Set timer duration (minutes):</p>
            <Slider
              defaultValue={[duration]}
              max={60}
              min={5}
              step={5}
              onValueChange={handleDurationChange}
              disabled={isRunning}
              className="w-full max-w-xs mx-auto"
            />
            <p className="text-sm mt-1">{duration} min</p>
          </div>
        )}
      </div>
      
      <div className="flex justify-center space-x-2">
        {!isRunning ? (
          <Button onClick={handleStart} disabled={isRunning}>
            <Play size={16} className="mr-1" /> Start
          </Button>
        ) : (
          <Button onClick={handlePause} variant="outline">
            <Pause size={16} className="mr-1" /> Pause
          </Button>
        )}
        
        <Button onClick={handleReset} variant="ghost" disabled={!timerId}>
          <RotateCcw size={16} className="mr-1" /> Reset
        </Button>
      </div>
    </div>
  );
};
