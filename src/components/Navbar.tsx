
import { Link, useLocation } from "react-router-dom";
import { Cake, Home, RefrigeratorIcon, ShoppingBag, Gift, Coins } from "lucide-react";
import { useAppContext } from "@/context/AppContext";

const Navbar = () => {
  const location = useLocation();
  const { coins, berries } = useAppContext();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };
  
  return (
    <header className="py-3 px-4 bg-white bg-opacity-80 backdrop-blur-sm border-b border-bakery-pink shadow-sm">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center gap-3">
          <Cake className="h-8 w-8 text-primary" />
          <h1 className="text-2xl font-bold text-primary">CakeCrumb</h1>
        </div>
        
        <nav className="hidden md:flex items-center space-x-1">
          <NavLink to="/" isActive={isActive("/")} icon={<Home size={20} />} label="Tasks" />
          <NavLink to="/fridge" isActive={isActive("/fridge")} icon={<RefrigeratorIcon size={20} />} label="Fridge" />
          <NavLink to="/bakery" isActive={isActive("/bakery")} icon={<ShoppingBag size={20} />} label="Bakery" />
          <NavLink to="/rewards" isActive={isActive("/rewards")} icon={<Gift size={20} />} label="Rewards" />
        </nav>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1 bg-bakery-yellow px-3 py-1 rounded-full">
            <Coins size={16} className="text-amber-500" />
            <span className="font-medium">{coins}</span>
          </div>
          
          <div className="flex items-center gap-1 bg-bakery-pink px-3 py-1 rounded-full">
            <span className="text-pink-500">🍓</span>
            <span className="font-medium">{berries}</span>
          </div>
        </div>
      </div>
      
      {/* Mobile Navigation Bar at the bottom */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-bakery-pink p-2 md:hidden z-40">
        <div className="flex justify-around">
          <MobileNavLink to="/" isActive={isActive("/")} icon={<Home size={20} />} label="Tasks" />
          <MobileNavLink to="/fridge" isActive={isActive("/fridge")} icon={<RefrigeratorIcon size={20} />} label="Fridge" />
          <MobileNavLink to="/bakery" isActive={isActive("/bakery")} icon={<ShoppingBag size={20} />} label="Bakery" />
          <MobileNavLink to="/rewards" isActive={isActive("/rewards")} icon={<Gift size={20} />} label="Rewards" />
        </div>
      </div>
    </header>
  );
};

const NavLink = ({ to, isActive, icon, label }: { to: string; isActive: boolean; icon: React.ReactNode; label: string }) => (
  <Link
    to={to}
    className={`px-4 py-2 rounded-full font-medium flex items-center gap-2 transition-colors ${
      isActive
        ? "bg-primary text-white"
        : "hover:bg-bakery-pink text-foreground"
    }`}
  >
    {icon}
    <span>{label}</span>
  </Link>
);

const MobileNavLink = ({ to, isActive, icon, label }: { to: string; isActive: boolean; icon: React.ReactNode; label: string }) => (
  <Link
    to={to}
    className={`flex flex-col items-center p-1 rounded-lg ${
      isActive ? "text-primary" : "text-muted-foreground"
    }`}
  >
    {icon}
    <span className="text-xs mt-1">{label}</span>
  </Link>
);

export default Navbar;
