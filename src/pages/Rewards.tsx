
import { useState } from "react";
import { useAppContext } from "@/context/AppContext";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Gift, Coins, PartyPopper, AlertTriangle, Plus, Star } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Reward } from "@/context/AppContext";

const addRewardSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().min(1, "Description is required"),
  price: z.coerce.number().min(1, "Price must be at least 1"),
  image: z.string().min(1, "Emoji is required"),
});

// Define the form values type to match what's required by addCustomReward
type AddRewardFormValues = Omit<Reward, "id" | "isCustom">;

const Rewards = () => {
  const { rewards, coins, purchaseReward, addCustomReward, userStats } = useAppContext();
  const { toast } = useToast();
  const [redeemingReward, setRedeemingReward] = useState<any | null>(null);
  const [showDialog, setShowDialog] = useState(false);
  const [showAddRewardDialog, setShowAddRewardDialog] = useState(false);
  
  const form = useForm<z.infer<typeof addRewardSchema>>({
    resolver: zodResolver(addRewardSchema),
    defaultValues: {
      name: "",
      description: "",
      price: 100,
      image: "🎁",
    },
  });
  
  // Experience to next level progress
  const levelProgress = Math.round((userStats.experience / userStats.experienceToNextLevel) * 100);
  
  const handlePurchase = (id: string) => {
    const reward = rewards.find(r => r.id === id);
    if (!reward) return;
    
    if (coins < reward.price) {
      toast({
        title: "Not Enough Coins",
        description: `You need ${reward.price - coins} more coins to redeem this reward.`,
        variant: "destructive",
      });
      return;
    }
    
    setRedeemingReward(reward);
    setShowDialog(true);
  };
  
  const confirmRedemption = () => {
    if (!redeemingReward) return;
    
    const success = purchaseReward(redeemingReward.id);
    if (success) {
      toast({
        title: "Reward Redeemed!",
        description: `Enjoy your ${redeemingReward.name}!`,
      });
      setShowDialog(false);
      setRedeemingReward(null);
    }
  };
  
  const onSubmitAddReward = (values: z.infer<typeof addRewardSchema>) => {
    // Ensure values passed to addCustomReward meet the required type
    const rewardData: AddRewardFormValues = {
      name: values.name,
      description: values.description,
      price: values.price,
      image: values.image,
    };
    
    addCustomReward(rewardData);
    toast({
      title: "Reward Added!",
      description: `${values.name} has been added to your rewards shop.`,
    });
    setShowAddRewardDialog(false);
    form.reset();
  };
  
  return (
    <div className="container mx-auto py-6">
      {/* Menu header with decorative elements */}
      <div className="relative bg-bakery-peach/30 p-8 rounded-2xl mb-8 shadow-md max-w-4xl mx-auto">
        <div className="absolute inset-0 opacity-10 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICAgIDxnIGZpbGw9Im5vbmUiIGZpbGwtcnVsZT0iZXZlbm9kZCI+CiAgICAgICAgPGcgZmlsbD0iI0ZGRiIgZmlsbC1vcGFjaXR5PSIxIj4KICAgICAgICAgICAgPHBhdGggZD0iTTM2IDM0aDR2MWgtNHYtMXptLS0yaDN2MWgtM3YtMXptLTEwIDJoM3YxaC0zdi0xem0tMyAxaDN2MWgtM3YtMXptLTMgMGgzdjFoLTN2LTF6bTIxLTNoM3YxaC0zdi0xem0tNCAxaDR2MWgtNHYtMXptLTEzLTFoM3YxaC0zdi0xem0tNCAwaDN2MWgtM3YtMXptMTkgMGgzdjFoLTN2LTF6Ii8+CiAgICAgICAgPC9nPgogICAgPC9nPgo8L3N2Zz4=')]"></div>
        
        {/* Decorative corners */}
        <div className="absolute top-0 left-0 w-16 h-16 border-t-4 border-l-4 border-bakery-pink rounded-tl-2xl"></div>
        <div className="absolute top-0 right-0 w-16 h-16 border-t-4 border-r-4 border-bakery-pink rounded-tr-2xl"></div>
        <div className="absolute bottom-0 left-0 w-16 h-16 border-b-4 border-l-4 border-bakery-pink rounded-bl-2xl"></div>
        <div className="absolute bottom-0 right-0 w-16 h-16 border-b-4 border-r-4 border-bakery-pink rounded-br-2xl"></div>
        
        <div className="text-center relative z-10">
          <h1 className="text-4xl font-bold text-primary mb-3">Sweet Rewards Menu</h1>
          <p className="text-muted-foreground mb-5">Treat yourself after completing your tasks!</p>
          
          <div className="inline-flex items-center px-6 py-3 bg-bakery-yellow/40 rounded-full border-2 border-bakery-yellow/60 shadow-md">
            <Coins size={20} className="text-amber-500 mr-3 drop-shadow-sm" strokeWidth={1.5} />
            <span className="font-bold text-lg">{coins} Coins Available</span>
          </div>
        </div>
      </div>
      
      <div className="max-w-md mx-auto mb-8">
        <div className="flex justify-between items-center text-sm mb-1">
          <div className="flex items-center gap-1">
            <Star size={14} className="text-amber-500 drop-shadow-sm" strokeWidth={1.5} />
            <span>Level {userStats.level}</span>
          </div>
          <span>XP: {userStats.experience} / {userStats.experienceToNextLevel}</span>
        </div>
        <Progress value={levelProgress} className="h-3" />
        <p className="text-xs text-center mt-1 text-muted-foreground">
          Level up to earn bonus coins and berries!
        </p>
      </div>
      
      <div className="dashboard-section max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold flex items-center">
            <Gift className="mr-2 text-pink-500 drop-shadow-sm" strokeWidth={1.5} />
            Menu Options
          </h2>
          
          <Button onClick={() => setShowAddRewardDialog(true)} variant="outline" className="flex items-center gap-2">
            <Plus size={16} className="text-green-500" />
            <span>Add Custom Reward</span>
          </Button>
        </div>
        
        {/* Menu items in a decorative paper-like background */}
        <div className="relative p-6 bg-amber-50 rounded-xl border border-amber-100 shadow-inner">
          {/* Menu texture */}
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICAgIDxnIGZpbGw9Im5vbmUiIGZpbGwtcnVsZT0iZXZlbm9kZCI+CiAgICAgICAgPGcgZmlsbD0iIzAwMCIgZmlsbC1vcGFjaXR5PSIwLjAyIj4KICAgICAgICAgICAgPHBhdGggZD0iTTIwIDM1YzguMjg0IDAgMTUtNi43MTYgMTUtMTUgMC04LjI4NC02LjcxNi0xNS0xNS0xNS04LjI4NCAwLTE1IDYuNzE2LTE1IDE1IDAgOC4yODQgNi43MTYgMTUgMTUgMTV6bTAgMmMtOS45NDEgMC0xOC04LjA1OS0xOC0xOFMxMC4wNTkgMSAyMCAxYzkuOTQxIDAgMTggOC4wNTkgMTggMThzLTguMDU5IDE4LTE4IDE4eiIvPgogICAgICAgIDwvZz4KICAgIDwvZz4KPC9zdmc+')] opacity-50"></div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {rewards.map((reward) => (
              <RewardCard
                key={reward.id}
                reward={reward}
                onPurchase={handlePurchase}
                canAfford={coins >= reward.price}
              />
            ))}
          </div>
        </div>
        
        <div className="mt-8 p-4 border border-bakery-yellow bg-bakery-yellow/30 rounded-lg">
          <h3 className="font-bold flex items-center mb-2">
            <AlertTriangle size={18} className="mr-2 text-amber-500" strokeWidth={1.5} />
            How to Earn Coins
          </h3>
          <p className="text-sm">
            Complete your cake tasks to earn coins. Different difficulty levels give different
            amounts of coins!
          </p>
        </div>
      </div>
      
      {/* Confirmation Dialog */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <PartyPopper className="mr-2 text-primary" size={20} />
              Redeem Reward
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to redeem this reward? This will deduct {redeemingReward?.price} coins from your balance.
            </DialogDescription>
          </DialogHeader>
          
          {redeemingReward && (
            <div className="py-4 flex items-center gap-4">
              <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center bg-muted rounded-lg text-2xl">
                {redeemingReward.image}
              </div>
              <div>
                <h4 className="font-bold">{redeemingReward.name}</h4>
                <p className="text-sm text-muted-foreground">{redeemingReward.description}</p>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDialog(false)}>
              Cancel
            </Button>
            <Button onClick={confirmRedemption}>
              Redeem Now
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Add Custom Reward Dialog */}
      <Dialog open={showAddRewardDialog} onOpenChange={setShowAddRewardDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <Gift className="mr-2 text-primary" size={20} />
              Add Custom Reward
            </DialogTitle>
            <DialogDescription>
              Create your own reward to motivate yourself!
            </DialogDescription>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmitAddReward)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Reward Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Movie Night" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Watch your favorite movie" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Price (coins)</FormLabel>
                      <FormControl>
                        <Input type="number" min="1" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="image"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Emoji</FormLabel>
                      <FormControl>
                        <Input placeholder="🎬" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setShowAddRewardDialog(false)}>
                  Cancel
                </Button>
                <Button type="submit">Add Reward</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

const RewardCard = ({ 
  reward, 
  onPurchase, 
  canAfford 
}: { 
  reward: any; 
  onPurchase: (id: string) => void; 
  canAfford: boolean;
}) => {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow border-dashed border-2 border-bakery-peach/50">
      {/* Menu item with decorative elements */}
      <div className="p-4 h-24 flex items-center justify-center bg-gradient-to-r from-bakery-lavender/40 to-bakery-pink/40 relative">
        {/* Price tag effect */}
        <div className="absolute -top-1 -right-1 w-16 h-16">
          <div className="absolute transform rotate-45 bg-bakery-yellow w-16 h-8 -translate-y-1/2 translate-x-1/2 flex items-center justify-center shadow-sm">
            <span className="font-bold text-xs">{reward.price}</span>
          </div>
        </div>
        
        <span className="text-5xl filter drop-shadow-md">{reward.image}</span>
      </div>
      
      <CardContent className="pt-4 bg-white relative">
        {/* Decorative dotted line */}
        <div className="absolute left-0 right-0 top-0 border-t-2 border-dashed border-gray-200"></div>
        
        <div className="flex justify-between items-center mb-1">
          <h3 className="font-bold text-lg">{reward.name}</h3>
        </div>
        
        <div className="flex items-center gap-1 mb-2">
          <Coins size={16} className="text-amber-500 drop-shadow-sm" strokeWidth={1.5} />
          <span>{reward.price} Coins</span>
        </div>
        
        <p className="text-sm text-muted-foreground">
          {reward.description}
        </p>
      </CardContent>
      
      <CardFooter className="pt-0 bg-white">
        <Button 
          onClick={() => onPurchase(reward.id)} 
          className="w-full"
          disabled={!canAfford}
          variant={canAfford ? "default" : "outline"}
        >
          {canAfford ? "Order Now" : "Not Enough Coins"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default Rewards;
