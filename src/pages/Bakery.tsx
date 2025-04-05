
import { useState } from "react";
import { useAppContext } from "@/context/AppContext";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShoppingBag, Check, Cake, AlertTriangle, Info, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Progress } from "@/components/ui/progress";
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
import { CakeFlavor } from "@/context/AppContext";

const addFlavorSchema = z.object({
  name: z.string().min(1, "Name is required"),
  color: z.string().min(1, "Color is required"),
  price: z.coerce.number().min(0, "Price must be at least 0"),
});

// Define the form values type to match what's required by addCustomCakeFlavor
type AddFlavorFormValues = Omit<CakeFlavor, "id" | "owned" | "isCustom">;

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
  
  const ownedFlavors = cakeFlavors.filter(f => f.owned).length;
  const totalFlavors = cakeFlavors.length;
  const collectionProgress = Math.round((ownedFlavors / totalFlavors) * 100);
  
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
    // Ensure values passed to addCustomCakeFlavor meet the required type
    const flavorData: AddFlavorFormValues = {
      name: values.name,
      color: values.color,
      price: values.price,
    };
    
    addCustomCakeFlavor(flavorData);
    toast({
      title: "Flavor Added!",
      description: `${values.name} has been added to your flavors.`,
    });
    setShowAddFlavorDialog(false);
    form.reset();
  };
  
  return (
    <div className="container mx-auto py-6">
      {/* Bakery storefront header */}
      <div className="relative mb-12 rounded-2xl overflow-hidden bg-gradient-to-b from-bakery-pink to-bakery-peach p-8 shadow-lg">
        <div className="absolute inset-0 opacity-10 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICAgIDxnIGZpbGw9Im5vbmUiIGZpbGwtcnVsZT0iZXZlbm9kZCI+CiAgICAgICAgPGcgZmlsbD0iI0ZGRiIgZmlsbC1vcGFjaXR5PSIxIj4KICAgICAgICAgICAgPHBhdGggZD0iTTM2IDM0aDR2MWgtNHYtMXptLS0yaDN2MWgtM3YtMXptLTEwIDJoM3YxaC0zdi0xem0tMyAxaDN2MWgtM3YtMXptLTMgMGgzdjFoLTN2LTF6bTIxLTNoM3YxaC0zdi0xem0tNCAxaDR2MWgtNHYtMXptLTEzLTFoM3YxaC0zdi0xem0tNCAwaDN2MWgtM3YtMXptMTkgMGgzdjFoLTN2LTF6Ii8+CiAgICAgICAgPC9nPgogICAgPC9nPgo8L3N2Zz4=')]"></div>
        <div className="text-center relative z-10">
          <h1 className="text-4xl font-bold text-white drop-shadow-md mb-4">The Cake Bakery</h1>
          <p className="text-white/90 text-lg mb-4">Purchase new cake flavors with your berries</p>
          <div className="mt-4 inline-flex items-center px-6 py-3 bg-white rounded-full shadow-md">
            <span className="text-pink-500 text-xl mr-3">🍓</span>
            <span className="font-bold text-lg">{berries} Berries Available</span>
          </div>
        </div>
        
        {/* Decorative bakery awning */}
        <div className="absolute top-0 left-0 right-0 h-8 bg-bakery-pink/70 border-b-4 border-dashed border-white/30"></div>
      </div>
      
      <div className="max-w-md mx-auto mb-8">
        <div className="flex justify-between text-sm mb-1">
          <span>Flavor Collection</span>
          <span>{ownedFlavors} / {totalFlavors}</span>
        </div>
        <Progress value={collectionProgress} className="h-3" />
      </div>
      
      <div className="dashboard-section">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold flex items-center">
            <ShoppingBag className="mr-2 text-amber-600 drop-shadow-sm" />
            Cake Flavors
          </h2>
          
          <div className="flex items-center gap-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Info size={20} className="text-blue-500" />
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
              <Plus size={16} className="text-green-500" />
              <span>Add Custom Flavor</span>
            </Button>
          </div>
        </div>
        
        {/* Bakery display case */}
        <div className="relative p-6 mb-6 rounded-xl bg-amber-50 shadow-inner border border-amber-200">
          {/* Bakery glass effect */}
          <div className="absolute inset-x-0 top-0 h-10 bg-gradient-to-b from-white/40 to-transparent"></div>
          
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
        </div>
        
        <div className="mt-8 p-4 border border-bakery-yellow bg-bakery-yellow/30 rounded-lg">
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
        <DialogContent className="bg-white">
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
                  className="w-full h-16 rounded-md flex items-center justify-center shadow-inner"
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
    <Card className="overflow-hidden hover:shadow-lg transition-shadow border-2 border-transparent hover:border-bakery-pink/50">
      <div className="p-4 h-24 flex items-center justify-center relative" style={{
        background: typeof flavor.color === 'string' ? flavor.color : '#FEF7CD',
        boxShadow: "inset 0 -10px 10px -10px rgba(0,0,0,0.1)"
      }}>
        {/* Cake plate effect */}
        <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 w-24 h-6 bg-white/40 rounded-full blur-md"></div>
        
        <Cake 
          size={40} 
          className="text-white drop-shadow-md filter saturate-150 relative z-10" 
          strokeWidth={1.5}
        />
      </div>
      
      <CardContent className="pt-6 bg-white">
        <div className="flex justify-between items-center mb-1">
          <h3 className="font-bold text-lg">{flavor.name}</h3>
          {flavor.owned && (
            <div className="flex items-center gap-1 text-green-600 text-sm">
              <Check size={16} strokeWidth={2.5} className="drop-shadow-sm" />
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
        <CardFooter className="pt-0 bg-white">
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
