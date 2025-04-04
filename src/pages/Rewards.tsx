
import { useState } from "react";
import { useAppContext } from "@/context/AppContext";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Gift, Coins, PartyPopper, AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

const Rewards = () => {
  const { rewards, coins, purchaseReward } = useAppContext();
  const { toast } = useToast();
  const [redeemingReward, setRedeemingReward] = useState<any | null>(null);
  const [showDialog, setShowDialog] = useState(false);
  
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
  
  return (
    <div className="container mx-auto py-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-primary mb-2">Rewards Shop</h1>
        <p className="text-muted-foreground">Treat yourself after completing your tasks!</p>
        <div className="mt-4 inline-flex items-center px-4 py-2 bg-bakery-yellow rounded-full">
          <Coins size={16} className="text-amber-500 mr-2" />
          <span className="font-bold">{coins} Coins Available</span>
        </div>
      </div>
      
      <div className="dashboard-section">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold flex items-center">
            <Gift className="mr-2" />
            Available Rewards
          </h2>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {rewards.map((reward) => (
            <RewardCard
              key={reward.id}
              reward={reward}
              onPurchase={handlePurchase}
              canAfford={coins >= reward.price}
            />
          ))}
        </div>
        
        <div className="mt-8 p-4 border border-bakery-yellow bg-bakery-yellow/20 rounded-lg">
          <h3 className="font-bold flex items-center mb-2">
            <AlertTriangle size={18} className="mr-2 text-amber-500" />
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
    <Card className="overflow-hidden">
      <div className="p-4 h-24 flex items-center justify-center bg-gradient-to-r from-bakery-lavender/50 to-bakery-pink/50">
        <span className="text-5xl">{reward.image}</span>
      </div>
      
      <CardContent className="pt-4">
        <div className="flex justify-between items-center mb-1">
          <h3 className="font-bold text-lg">{reward.name}</h3>
        </div>
        
        <div className="flex items-center gap-1 mb-2">
          <Coins size={16} className="text-amber-500" />
          <span>{reward.price} Coins</span>
        </div>
        
        <p className="text-sm text-muted-foreground">
          {reward.description}
        </p>
      </CardContent>
      
      <CardFooter className="pt-0">
        <Button 
          onClick={() => onPurchase(reward.id)} 
          className="w-full"
          disabled={!canAfford}
          variant={canAfford ? "default" : "outline"}
        >
          {canAfford ? "Redeem Reward" : "Not Enough Coins"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default Rewards;
