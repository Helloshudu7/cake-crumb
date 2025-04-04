
import { useState } from "react";
import { useAppContext } from "@/context/AppContext";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Medal, Star, Trophy, Award, Lock, Info } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

const Achievements = () => {
  const { achievements, userStats } = useAppContext();
  const [filter, setFilter] = useState<'all' | 'unlocked' | 'locked'>('all');
  
  const filteredAchievements = achievements.filter(achievement => {
    if (filter === 'all') return true;
    return filter === 'unlocked' ? achievement.isUnlocked : !achievement.isUnlocked;
  });
  
  const unlockedCount = achievements.filter(a => a.isUnlocked).length;
  const totalAchievements = achievements.length;
  const progressPercentage = Math.round((unlockedCount / totalAchievements) * 100);
  
  return (
    <div className="container mx-auto py-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-primary mb-2">Achievements</h1>
        <p className="text-muted-foreground">Showcase your baking prowess!</p>
        
        <div className="mt-6 flex flex-col items-center">
          <div className="flex gap-2 items-center mb-3">
            <Trophy className="text-bakery-yellow" />
            <span className="font-bold">{unlockedCount} / {totalAchievements} Unlocked</span>
          </div>
          
          <div className="w-full max-w-md mb-4">
            <Progress value={progressPercentage} className="h-3" />
          </div>
          
          <div className="flex items-center justify-center gap-2 mt-2">
            <Button 
              variant={filter === 'all' ? "default" : "outline"} 
              size="sm"
              onClick={() => setFilter('all')}
            >
              All
            </Button>
            <Button 
              variant={filter === 'unlocked' ? "default" : "outline"} 
              size="sm"
              onClick={() => setFilter('unlocked')}
            >
              Unlocked
            </Button>
            <Button 
              variant={filter === 'locked' ? "default" : "outline"} 
              size="sm"
              onClick={() => setFilter('locked')}
            >
              Locked
            </Button>
          </div>
        </div>
        
        <div className="mt-4 inline-flex items-center px-4 py-2 bg-bakery-pink rounded-full">
          <Star className="text-amber-500 mr-2" size={18} />
          <span className="font-bold">Level {userStats.level}</span>
        </div>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
        {filteredAchievements.map((achievement) => (
          <AchievementCard 
            key={achievement.id} 
            achievement={achievement} 
          />
        ))}
      </div>
    </div>
  );
};

const AchievementCard = ({ achievement }: { achievement: any }) => {
  const isLocked = !achievement.isUnlocked;
  
  return (
    <Card className={cn(
      "overflow-hidden transition-all duration-300",
      isLocked ? "opacity-75 grayscale" : "hover:shadow-md"
    )}>
      <CardContent className="p-6">
        <div className="flex gap-4">
          <div className={cn(
            "w-14 h-14 flex items-center justify-center rounded-full text-3xl",
            isLocked ? "bg-muted" : "bg-bakery-pink/20"
          )}>
            {isLocked ? <Lock size={24} className="text-muted-foreground" /> : achievement.icon}
          </div>
          
          <div className="flex-1">
            <div className="flex items-center justify-between mb-1">
              <h3 className="font-bold">{achievement.title}</h3>
              
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-6 w-6">
                      <Info size={14} />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{achievement.description}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            
            <p className="text-sm text-muted-foreground mb-2">
              {achievement.description}
            </p>
            
            {achievement.goal && (
              <div className="mt-2">
                <div className="flex justify-between text-xs mb-1">
                  <span>{achievement.progress || 0} / {achievement.goal}</span>
                  <span>{Math.round(((achievement.progress || 0) / achievement.goal) * 100)}%</span>
                </div>
                <Progress 
                  value={((achievement.progress || 0) / achievement.goal) * 100} 
                  className="h-2" 
                />
              </div>
            )}
            
            {achievement.isUnlocked && (
              <div className="flex items-center gap-1 mt-2 text-xs text-green-600">
                <Award size={14} />
                <span>Unlocked</span>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default Achievements;
