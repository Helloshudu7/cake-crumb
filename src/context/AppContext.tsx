import React, { createContext, useState, useContext, useEffect } from 'react';

export type CakeFlavor = {
  id: string;
  name: string;
  color: string;
  price: number;
  owned: boolean;
  isCustom?: boolean;
};

export type Reward = {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  isCustom?: boolean;
};

export type Achievement = {
  id: string;
  title: string;
  description: string;
  icon: string;
  isUnlocked: boolean;
  progress?: number;
  goal?: number;
};

export type Task = {
  id: string;
  title: string;
  flavorId: string;
  difficulty: 'easy' | 'medium' | 'hard';
  completed: boolean;
  deleted: boolean;
  createdAt: Date;
  completedAt: Date | null;
  deletedAt: Date | null;
};

export type TimerSession = {
  id: string;
  taskId: string;
  duration: number;  // in minutes
  startedAt: Date;
  completedAt: Date | null;
};

export type UserStats = {
  level: number;
  experience: number;
  experienceToNextLevel: number;
  streak: number;
  lastActiveDate: string | null;
};

type AppContextType = {
  tasks: Task[];
  addTask: (task: Omit<Task, 'id' | 'completed' | 'deleted' | 'createdAt' | 'completedAt' | 'deletedAt'>) => void;
  completeTask: (id: string) => void;
  deleteTask: (id: string) => void;
  
  timerSessions: TimerSession[];
  startTimer: (taskId: string, duration: number) => string;
  completeTimer: (id: string) => void;
  
  coins: number;
  berries: number;
  addCoins: (amount: number) => void;
  addBerries: (amount: number) => void;
  
  cakeFlavors: CakeFlavor[];
  purchaseCakeFlavor: (id: string) => boolean;
  addCustomCakeFlavor: (flavor: Omit<CakeFlavor, 'id' | 'owned' | 'isCustom'>) => void;
  
  rewards: Reward[];
  purchaseReward: (id: string) => boolean;
  addCustomReward: (reward: Omit<Reward, 'id' | 'isCustom'>) => void;
  
  achievements: Achievement[];
  unlockAchievement: (id: string) => void;
  incrementAchievementProgress: (id: string, amount: number) => void;
  
  userStats: UserStats;
  gainExperience: (amount: number) => void;
  checkAndUpdateStreak: () => void;
  
  currentAnimation: {
    type: 'eat' | 'rot' | null;
    taskId: string | null;
  };
  clearAnimation: () => void;
};

const AppContext = createContext<AppContextType | undefined>(undefined);

// Default cake flavors
const defaultCakeFlavors: CakeFlavor[] = [
  { id: 'vanilla', name: 'Vanilla', color: '#FEF7CD', price: 0, owned: true },
  { id: 'strawberry', name: 'Strawberry', color: '#FFDEE2', price: 50, owned: false },
  { id: 'chocolate', name: 'Chocolate', color: '#8B4513', price: 50, owned: false },
  { id: 'mint', name: 'Mint', color: '#F2FCE2', price: 75, owned: false },
  { id: 'blueberry', name: 'Blueberry', color: '#E5DEFF', price: 75, owned: false },
  { id: 'rainbow', name: 'Rainbow', color: 'linear-gradient(90deg, #FFDEE2, #FEF7CD, #F2FCE2, #E5DEFF)', price: 150, owned: false },
];

// Default rewards
const defaultRewards: Reward[] = [
  { id: 'coffee', name: 'Coffee Break', description: 'Take a 15 minute coffee break', price: 50, image: '☕' },
  { id: 'snack', name: 'Snack Time', description: 'Enjoy your favorite snack', price: 100, image: '🍫' },
  { id: 'movie', name: 'Movie Night', description: 'Watch your favorite movie', price: 300, image: '🎬' },
  { id: 'book', name: 'Book Time', description: 'Read a chapter of your book', price: 200, image: '📚' },
  { id: 'nap', name: 'Power Nap', description: 'Take a 20 minute power nap', price: 250, image: '💤' },
];

// Default achievements
const defaultAchievements: Achievement[] = [
  { id: 'first-task', title: 'First Bite', description: 'Complete your first task', icon: '🧁', isUnlocked: false },
  { id: 'five-tasks', title: 'Cake Enthusiast', description: 'Complete 5 tasks', icon: '🍰', isUnlocked: false, progress: 0, goal: 5 },
  { id: 'ten-tasks', title: 'Master Baker', description: 'Complete 10 tasks', icon: '👨‍🍳', isUnlocked: false, progress: 0, goal: 10 },
  { id: 'first-timer', title: 'Focus Time', description: 'Complete a timer session', icon: '⏱️', isUnlocked: false },
  { id: 'streak-3', title: 'Consistent Baker', description: 'Maintain a 3-day streak', icon: '🔥', isUnlocked: false, progress: 0, goal: 3 },
  { id: 'streak-7', title: 'Dedication', description: 'Maintain a 7-day streak', icon: '🏆', isUnlocked: false, progress: 0, goal: 7 },
  { id: 'flavor-collector', title: 'Flavor Collector', description: 'Own 3 different cake flavors', icon: '🎨', isUnlocked: false, progress: 1, goal: 3 },
];

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load data from localStorage or use defaults
  const [tasks, setTasks] = useState<Task[]>(() => {
    const saved = localStorage.getItem('cakecrumb-tasks');
    try {
      const parsed = saved ? JSON.parse(saved) : [];
      return parsed.map((task: any) => ({
        ...task,
        createdAt: new Date(task.createdAt),
        completedAt: task.completedAt ? new Date(task.completedAt) : null,
        deletedAt: task.deletedAt ? new Date(task.deletedAt) : null,
      }));
    } catch (e) {
      console.error('Failed to parse tasks from localStorage', e);
      return [];
    }
  });
  
  const [timerSessions, setTimerSessions] = useState<TimerSession[]>(() => {
    const saved = localStorage.getItem('cakecrumb-timers');
    try {
      const parsed = saved ? JSON.parse(saved) : [];
      return parsed.map((timer: any) => ({
        ...timer,
        startedAt: new Date(timer.startedAt),
        completedAt: timer.completedAt ? new Date(timer.completedAt) : null,
      }));
    } catch (e) {
      console.error('Failed to parse timers from localStorage', e);
      return [];
    }
  });
  
  const [coins, setCoins] = useState<number>(() => {
    const saved = localStorage.getItem('cakecrumb-coins');
    return saved ? parseInt(saved, 10) : 100;
  });
  
  const [berries, setBerries] = useState<number>(() => {
    const saved = localStorage.getItem('cakecrumb-berries');
    return saved ? parseInt(saved, 10) : 50;
  });
  
  const [cakeFlavors, setCakeFlavors] = useState<CakeFlavor[]>(() => {
    const saved = localStorage.getItem('cakecrumb-flavors');
    return saved ? JSON.parse(saved) : defaultCakeFlavors;
  });
  
  const [rewards, setRewards] = useState<Reward[]>(() => {
    const saved = localStorage.getItem('cakecrumb-rewards');
    return saved ? JSON.parse(saved) : defaultRewards;
  });
  
  const [achievements, setAchievements] = useState<Achievement[]>(() => {
    const saved = localStorage.getItem('cakecrumb-achievements');
    return saved ? JSON.parse(saved) : defaultAchievements;
  });
  
  const [userStats, setUserStats] = useState<UserStats>(() => {
    const saved = localStorage.getItem('cakecrumb-user-stats');
    return saved ? JSON.parse(saved) : {
      level: 1,
      experience: 0,
      experienceToNextLevel: 100,
      streak: 0,
      lastActiveDate: null,
    };
  });
  
  const [currentAnimation, setCurrentAnimation] = useState<{
    type: 'eat' | 'rot' | null;
    taskId: string | null;
  }>({ type: null, taskId: null });
  
  // Save to localStorage whenever state changes
  useEffect(() => {
    localStorage.setItem('cakecrumb-tasks', JSON.stringify(tasks));
  }, [tasks]);
  
  useEffect(() => {
    localStorage.setItem('cakecrumb-timers', JSON.stringify(timerSessions));
  }, [timerSessions]);
  
  useEffect(() => {
    localStorage.setItem('cakecrumb-coins', coins.toString());
  }, [coins]);
  
  useEffect(() => {
    localStorage.setItem('cakecrumb-berries', berries.toString());
  }, [berries]);
  
  useEffect(() => {
    localStorage.setItem('cakecrumb-flavors', JSON.stringify(cakeFlavors));
  }, [cakeFlavors]);
  
  useEffect(() => {
    localStorage.setItem('cakecrumb-rewards', JSON.stringify(rewards));
  }, [rewards]);
  
  useEffect(() => {
    localStorage.setItem('cakecrumb-achievements', JSON.stringify(achievements));
  }, [achievements]);
  
  useEffect(() => {
    localStorage.setItem('cakecrumb-user-stats', JSON.stringify(userStats));
  }, [userStats]);
  
  // Check and update streak on component mount
  useEffect(() => {
    checkAndUpdateStreak();
  }, []);
  
  // Task functions
  const addTask = (task: Omit<Task, 'id' | 'completed' | 'deleted' | 'createdAt' | 'completedAt' | 'deletedAt'>) => {
    const newTask: Task = {
      ...task,
      id: Date.now().toString(),
      completed: false,
      deleted: false,
      createdAt: new Date(),
      completedAt: null,
      deletedAt: null,
    };
    setTasks([...tasks, newTask]);
    
    // Award XP for creating a task
    gainExperience(5);
  };
  
  const completeTask = (id: string) => {
    setTasks(tasks.map(task => 
      task.id === id 
        ? { ...task, completed: true, completedAt: new Date() } 
        : task
    ));
    
    // Get the task to determine coin reward
    const task = tasks.find(t => t.id === id);
    if (task) {
      // Different coins based on difficulty
      let coinsEarned = 0;
      let xpEarned = 0;
      
      switch (task.difficulty) {
        case 'easy':
          coinsEarned = 20;
          xpEarned = 10;
          break;
        case 'medium':
          coinsEarned = 50;
          xpEarned = 25;
          break;
        case 'hard':
          coinsEarned = 100;
          xpEarned = 50;
          break;
      }
      
      addCoins(coinsEarned);
      gainExperience(xpEarned);
      
      // Check for achievements
      const completedTasks = tasks.filter(t => t.completed).length + 1; // +1 for current task
      
      // First task achievement
      if (completedTasks === 1) {
        unlockAchievement('first-task');
      }
      
      // Track progress for multiple task achievements
      incrementAchievementProgress('five-tasks', 1);
      incrementAchievementProgress('ten-tasks', 1);
      
      // Show the eat animation
      setCurrentAnimation({ type: 'eat', taskId: id });
    }
  };
  
  const deleteTask = (id: string) => {
    setTasks(tasks.map(task => 
      task.id === id 
        ? { ...task, deleted: true, deletedAt: new Date() } 
        : task
    ));
    
    // Show the rot animation
    setCurrentAnimation({ type: 'rot', taskId: id });
  };
  
  // Timer functions
  const startTimer = (taskId: string, duration: number) => {
    const id = Date.now().toString();
    const newTimer: TimerSession = {
      id,
      taskId,
      duration,
      startedAt: new Date(),
      completedAt: null,
    };
    
    setTimerSessions([...timerSessions, newTimer]);
    return id;
  };
  
  const completeTimer = (id: string) => {
    setTimerSessions(timerSessions.map(timer => 
      timer.id === id 
        ? { ...timer, completedAt: new Date() } 
        : timer
    ));
    
    // Get the timer to determine berry reward
    const timer = timerSessions.find(t => t.id === id);
    if (timer) {
      // Berries are based on duration - 5 berries per 5 minutes
      const berriesEarned = Math.ceil(timer.duration / 5) * 5;
      const xpEarned = Math.ceil(timer.duration / 5) * 3;
      
      addBerries(berriesEarned);
      gainExperience(xpEarned);
      
      // Unlock timer achievement
      unlockAchievement('first-timer');
    }
  };
  
  // Currency functions
  const addCoins = (amount: number) => {
    setCoins(prev => prev + amount);
  };
  
  const addBerries = (amount: number) => {
    setBerries(prev => prev + amount);
  };
  
  // Shop functions
  const purchaseCakeFlavor = (id: string) => {
    const flavor = cakeFlavors.find(f => f.id === id);
    if (!flavor || flavor.owned || berries < flavor.price) {
      return false;
    }
    
    setBerries(prev => prev - flavor.price);
    setCakeFlavors(cakeFlavors.map(f => 
      f.id === id ? { ...f, owned: true } : f
    ));
    
    // Check for flavor collector achievement
    const ownedFlavors = cakeFlavors.filter(f => f.owned).length + 1; // +1 for the just purchased one
    incrementAchievementProgress('flavor-collector', 1);
    
    return true;
  };
  
  const addCustomCakeFlavor = (flavor: Omit<CakeFlavor, 'id' | 'owned' | 'isCustom'>) => {
    const newFlavor: CakeFlavor = {
      ...flavor,
      id: `custom-${Date.now()}`,
      owned: true,
      isCustom: true,
    };
    
    setCakeFlavors([...cakeFlavors, newFlavor]);
    
    // Check for flavor collector achievement
    incrementAchievementProgress('flavor-collector', 1);
  };
  
  const purchaseReward = (id: string) => {
    const reward = rewards.find(r => r.id === id);
    if (!reward || coins < reward.price) {
      return false;
    }
    
    setCoins(prev => prev - reward.price);
    return true;
  };
  
  const addCustomReward = (reward: Omit<Reward, 'id' | 'isCustom'>) => {
    const newReward: Reward = {
      ...reward,
      id: `custom-${Date.now()}`,
      isCustom: true,
    };
    
    setRewards([...rewards, newReward]);
  };
  
  // Achievement functions
  const unlockAchievement = (id: string) => {
    const achievement = achievements.find(a => a.id === id);
    if (!achievement || achievement.isUnlocked) return;
    
    setAchievements(achievements.map(a => 
      a.id === id ? { ...a, isUnlocked: true, progress: a.goal } : a
    ));
    
    // Reward XP for unlocking an achievement
    gainExperience(25);
  };
  
  const incrementAchievementProgress = (id: string, amount: number) => {
    const achievement = achievements.find(a => a.id === id);
    if (!achievement || achievement.isUnlocked || achievement.progress === undefined || achievement.goal === undefined) return;
    
    const newProgress = (achievement.progress + amount);
    const isComplete = newProgress >= achievement.goal;
    
    setAchievements(achievements.map(a => 
      a.id === id 
        ? { 
            ...a, 
            progress: newProgress, 
            isUnlocked: isComplete 
          } 
        : a
    ));
    
    // If achievement is completed by this increment, reward XP
    if (isComplete) {
      gainExperience(25);
    }
  };
  
  // User stats functions
  const gainExperience = (amount: number) => {
    const newExperience = userStats.experience + amount;
    let newLevel = userStats.level;
    let newExperienceToNextLevel = userStats.experienceToNextLevel;
    
    // Level up if enough XP
    if (newExperience >= userStats.experienceToNextLevel) {
      newLevel += 1;
      
      // Formula for XP needed for next level - increases with each level
      newExperienceToNextLevel = Math.floor(100 * (1.2 ** newLevel));
      
      // Reward for leveling up
      addCoins(newLevel * 50);
      addBerries(newLevel * 10);
    }
    
    setUserStats({
      ...userStats,
      level: newLevel,
      experience: newExperience > userStats.experienceToNextLevel ? newExperience - userStats.experienceToNextLevel : newExperience,
      experienceToNextLevel: newExperienceToNextLevel,
    });
  };
  
  const checkAndUpdateStreak = () => {
    const today = new Date().toISOString().split('T')[0];
    
    if (!userStats.lastActiveDate) {
      // First time user - start streak
      setUserStats({
        ...userStats,
        streak: 1,
        lastActiveDate: today,
      });
      return;
    }
    
    if (userStats.lastActiveDate === today) {
      // Already marked as active today
      return;
    }
    
    const lastActive = new Date(userStats.lastActiveDate);
    const currentDate = new Date(today);
    
    // Calculate days between
    const timeDiff = currentDate.getTime() - lastActive.getTime();
    const dayDiff = Math.floor(timeDiff / (1000 * 3600 * 24));
    
    if (dayDiff === 1) {
      // Consecutive day - increase streak
      const newStreak = userStats.streak + 1;
      setUserStats({
        ...userStats,
        streak: newStreak,
        lastActiveDate: today,
      });
      
      // Check streak achievements
      if (newStreak === 3) {
        unlockAchievement('streak-3');
      }
      if (newStreak === 7) {
        unlockAchievement('streak-7');
      }
      
      // Bonus for maintaining streak
      addCoins(newStreak * 5);
    } else if (dayDiff > 1) {
      // Streak broken
      setUserStats({
        ...userStats,
        streak: 1,
        lastActiveDate: today,
      });
    }
  };
  
  // Animation control
  const clearAnimation = () => {
    setCurrentAnimation({ type: null, taskId: null });
  };
  
  const value = {
    tasks,
    addTask,
    completeTask,
    deleteTask,
    
    timerSessions,
    startTimer,
    completeTimer,
    
    coins,
    berries,
    addCoins,
    addBerries,
    
    cakeFlavors,
    purchaseCakeFlavor,
    addCustomCakeFlavor,
    
    rewards,
    purchaseReward,
    addCustomReward,
    
    achievements,
    unlockAchievement,
    incrementAchievementProgress,
    
    userStats,
    gainExperience,
    checkAndUpdateStreak,
    
    currentAnimation,
    clearAnimation,
  };
  
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
