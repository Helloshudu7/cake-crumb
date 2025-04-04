
import { useState } from "react";
import { useAppContext } from "@/context/AppContext";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShoppingBag, Check, Cake, AlertTriangle, Info } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const Bakery = () => {
  const { cakeFlavors, berries, purchaseCakeFlavor } = useAppContext();
  const { toast } = useToast();
  
  const handlePurchase = (id: string) => {
    const flavor = cakeFlavors.find(f => f.id === id);
    if (!flavor) return;
    
    if (flavor.owned) {
      toast({
        title: "Already Owned",
        description: `You already own the ${flavor.name} cake flavor!`,
        variant: "default",
      });
      return;
    }
    
    if (berries < flavor.price) {
      toast({
        title: "Not Enough Berries",
        description: `You need ${flavor.price - berries} more berries to buy this flavor.`,
        variant: "destructive",
      });
      return;
    }
    
    const success = purchaseCakeFlavor(id);
    if (success) {
      toast({
        title: "Purchase Successful!",
        description: `You've unlocked the ${flavor.name} cake flavor!`,
      });
    }
  };
  
  return (
    <div className="container mx-auto py-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-primary mb-2">The Bakery</h1>
        <p className="text-muted-foreground">Purchase new cake flavors with your berries</p>
        <div className="mt-4 inline-flex items-center px-4 py-2 bg-bakery-pink rounded-full">
          <span className="text-pink-500 mr-2">🍓</span>
          <span className="font-bold">{berries} Berries Available</span>
        </div>
      </div>
      
      <div className="dashboard-section">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold flex items-center">
            <ShoppingBag className="mr-2" />
            Cake Flavors
          </h2>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Info size={20} />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p className="max-w-xs">
                  Cake flavors are categories for your tasks. Purchase new flavors
                  to better organize your tasks!
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {cakeFlavors.map((flavor) => (
            <FlavorCard
              key={flavor.id}
              flavor={flavor}
              onPurchase={handlePurchase}
              canAfford={berries >= flavor.price}
            />
          ))}
        </div>
        
        <div className="mt-8 p-4 border border-bakery-yellow bg-bakery-yellow/20 rounded-lg">
          <h3 className="font-bold flex items-center mb-2">
            <AlertTriangle size={18} className="mr-2 text-amber-500" />
            How to Earn Berries
          </h3>
          <p className="text-sm">
            Use the timer feature on your tasks to earn berries. You'll earn 5 berries
            for every 5 minutes of focused work!
          </p>
        </div>
      </div>
    </div>
  );
};

const FlavorCard = ({ 
  flavor, 
  onPurchase, 
  canAfford 
}: { 
  flavor: any; 
  onPurchase: (id: string) => void; 
  canAfford: boolean;
}) => {
  return (
    <Card className="overflow-hidden">
      <div className="p-4 h-20 flex items-center justify-center" style={{
        background: typeof flavor.color === 'string' ? flavor.color : '#FEF7CD',
        boxShadow: "inset 0 -10px 10px -10px rgba(0,0,0,0.1)"
      }}>
        <Cake size={40} className="text-white drop-shadow-md" />
      </div>
      
      <CardContent className="pt-4">
        <div className="flex justify-between items-center mb-1">
          <h3 className="font-bold text-lg">{flavor.name}</h3>
          {flavor.owned && (
            <div className="flex items-center gap-1 text-green-600 text-sm">
              <Check size={16} />
              <span>Owned</span>
            </div>
          )}
        </div>
        
        {!flavor.owned && (
          <div className="flex items-center gap-1 mb-2">
            <span className="text-pink-500">🍓</span>
            <span>{flavor.price} Berries</span>
          </div>
        )}
        
        <p className="text-sm text-muted-foreground">
          Use this flavor to categorize your tasks.
        </p>
      </CardContent>
      
      {!flavor.owned && (
        <CardFooter className="pt-0">
          <Button 
            onClick={() => onPurchase(flavor.id)} 
            className="w-full"
            disabled={!canAfford}
            variant={canAfford ? "default" : "outline"}
          >
            {canAfford ? "Purchase" : "Not Enough Berries"}
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};

export default Bakery;
