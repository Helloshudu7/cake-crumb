
import { useState } from "react";
import { useAppContext } from "@/context/AppContext";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShoppingBag, Check, Cake, AlertTriangle, Info, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

const addFlavorSchema = z.object({
  name: z.string().min(1, "Name is required"),
  color: z.string().min(1, "Color is required"),
  price: z.coerce.number().min(0, "Price must be at least 0"),
});

const Bakery = () => {
  const { cakeFlavors, berries, purchaseCakeFlavor, addCustomCakeFlavor } = useAppContext();
  const { toast } = useToast();
  const [showAddFlavorDialog, setShowAddFlavorDialog] = useState(false);
  
  const form = useForm<z.infer<typeof addFlavorSchema>>({
    resolver: zodResolver(addFlavorSchema),
    defaultValues: {
      name: "",
      color: "#FFD1DC", // Light pink default
      price: 0,
    },
  });
  
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
  
  const onSubmitAddFlavor = (values: z.infer<typeof addFlavorSchema>) => {
    addCustomCakeFlavor(values);
    toast({
      title: "Flavor Added!",
      description: `${values.name} has been added to your flavors.`,
    });
    setShowAddFlavorDialog(false);
    form.reset();
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
          
          <div className="flex items-center gap-2">
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
            
            <Button onClick={() => setShowAddFlavorDialog(true)} variant="outline" className="flex items-center gap-2">
              <Plus size={16} />
              <span>Add Custom Flavor</span>
            </Button>
          </div>
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
      
      {/* Add Custom Flavor Dialog */}
      <Dialog open={showAddFlavorDialog} onOpenChange={setShowAddFlavorDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <Cake className="mr-2 text-primary" size={20} />
              Add Custom Flavor
            </DialogTitle>
            <DialogDescription>
              Create your own cake flavor to categorize your tasks!
            </DialogDescription>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmitAddFlavor)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Flavor Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Bubblegum" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="color"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Color</FormLabel>
                      <div className="flex items-center gap-2">
                        <Input type="color" {...field} className="w-12 h-10 p-1" />
                        <Input {...field} className="flex-1" />
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Berry Price (0 for free)</FormLabel>
                      <FormControl>
                        <Input type="number" min="0" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="pt-4">
                <p className="text-sm text-muted-foreground mb-2">Preview:</p>
                <div 
                  className="w-full h-16 rounded-md flex items-center justify-center"
                  style={{ backgroundColor: form.watch("color") }}
                >
                  <Cake size={32} className="text-white drop-shadow-md" />
                </div>
              </div>
              
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setShowAddFlavorDialog(false)}>
                  Cancel
                </Button>
                <Button type="submit">Add Flavor</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
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
