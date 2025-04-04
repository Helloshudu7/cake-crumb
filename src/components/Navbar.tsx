
import { Link, useLocation } from "react-router-dom";
import { Cake, Home, ShoppingBag, Refrigerator, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAppContext } from "@/context/AppContext";

const Navbar = () => {
  const location = useLocation();
  const { coins, berries } = useAppContext();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };
  
  const navLinks = [
    { 
      path: "/", 
      label: "Dashboard", 
      icon: (props: any) => <Home {...props} className={cn(props.className, "text-blue-500")} /> 
    },
    { 
      path: "/fridge", 
      label: "Fridge", 
      icon: (props: any) => <Refrigerator {...props} className={cn(props.className, "text-cyan-600")} /> 
    },
    { 
      path: "/bakery", 
      label: "Bakery", 
      icon: (props: any) => <Cake {...props} className={cn(props.className, "text-pink-500")} /> 
    },
    { 
      path: "/rewards", 
      label: "Rewards", 
      icon: (props: any) => <ShoppingBag {...props} className={cn(props.className, "text-amber-600")} /> 
    },
    { 
      path: "/achievements", 
      label: "Achievements", 
      icon: (props: any) => <Award {...props} className={cn(props.className, "text-purple-600")} /> 
    },
  ];
  
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 hidden md:flex">
          <Link to="/" className="mr-6 flex items-center space-x-2">
            <Cake className="h-6 w-6 text-primary drop-shadow-sm" strokeWidth={1.5} />
            <span className="hidden font-bold sm:inline-block">
              CakeCrumb
            </span>
          </Link>
          
          <nav className="flex items-center space-x-4 text-sm font-medium">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={cn(
                  "transition-colors hover:text-foreground/80",
                  isActive(link.path) ? "text-foreground" : "text-foreground/60"
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
        
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <div className="w-full flex-1 md:w-auto md:flex-none">
            <div className="flex items-center gap-4">
              <div className="flex items-center px-3 py-1 rounded-full bg-bakery-yellow/20">
                <span className="text-amber-500 mr-1">💰</span>
                <span className="text-sm font-medium">{coins}</span>
              </div>
              
              <div className="flex items-center px-3 py-1 rounded-full bg-bakery-pink/20">
                <span className="text-pink-500 mr-1">🍓</span>
                <span className="text-sm font-medium">{berries}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <nav className="md:hidden">
        <div className="flex items-center justify-around pb-2">
          {navLinks.map((link) => (
            <Link key={link.path} to={link.path}>
              <Button
                variant="ghost"
                size="icon"
                className={cn(
                  "flex flex-col items-center justify-center h-auto py-2 gap-1",
                  isActive(link.path) ? "text-primary bg-primary/10" : ""
                )}
              >
                <link.icon size={18} strokeWidth={1.8} className="drop-shadow-sm" />
                <span className="text-xs">{link.label}</span>
              </Button>
            </Link>
          ))}
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
