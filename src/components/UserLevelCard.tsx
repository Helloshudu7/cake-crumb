
import { useAppContext } from "@/context/AppContext";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Star, Award, Trophy, Flame } from "lucide-react";

export const UserLevelCard = () => {
  const { userStats, achievements } = useAppContext();
  
  const unlockedAchievements = achievements.filter(a => a.isUnlocked).length;
  const experiencePercentage = Math.round((userStats.experience / userStats.experienceToNextLevel) * 100);
  
  return (
    <Card className="cake-card">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-bold text-lg">Your Stats</h3>
          <div className="flex items-center gap-1">
            <Star className="text-amber-500" size={16} />
            <span className="font-bold">Level {userStats.level}</span>
          </div>
        </div>
        
        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span>Experience</span>
              <span>{userStats.experience} / {userStats.experienceToNextLevel} XP</span>
            </div>
            <Progress value={experiencePercentage} />
          </div>
          
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="bg-bakery-yellow/20 rounded-md p-2">
              <Flame className="mx-auto text-amber-500 mb-1" size={18} />
              <p className="text-sm font-medium">{userStats.streak} Day Streak</p>
            </div>
            
            <div className="bg-bakery-pink/20 rounded-md p-2">
              <Trophy className="mx-auto text-pink-500 mb-1" size={18} />
              <p className="text-sm font-medium">{unlockedAchievements} Achievements</p>
            </div>
            
            <div className="bg-bakery-lavender/20 rounded-md p-2">
              <Award className="mx-auto text-purple-500 mb-1" size={18} />
              <p className="text-sm font-medium">Next: Lvl {userStats.level + 1}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
