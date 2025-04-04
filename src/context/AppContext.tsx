
import React, { createContext, useState, useContext, useEffect } from 'react';

export type CakeFlavor = {
  id: string;
  name: string;
  color: string;
  price: number;
  owned: boolean;
};

export type Reward = {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
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
  
  rewards: Reward[];
  purchaseReward: (id: string) => boolean;
  
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
      switch (task.difficulty) {
        case 'easy':
          coinsEarned = 20;
          break;
        case 'medium':
          coinsEarned = 50;
          break;
        case 'hard':
          coinsEarned = 100;
          break;
      }
      
      addCoins(coinsEarned);
      
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
      addBerries(berriesEarned);
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
    
    return true;
  };
  
  const purchaseReward = (id: string) => {
    const reward = rewards.find(r => r.id === id);
    if (!reward || coins < reward.price) {
      return false;
    }
    
    setCoins(prev => prev - reward.price);
    return true;
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
    
    rewards,
    purchaseReward,
    
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
