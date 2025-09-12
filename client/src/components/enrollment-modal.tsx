import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Star, CreditCard } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface EnrollmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  classData: {
    id: string;
    title: string;
    price: string;
    teacher: string;
    rating?: number;
  } | null;
}

export function EnrollmentModal({ isOpen, onClose, classData }: EnrollmentModalProps) {
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvc, setCvc] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const enrollMutation = useMutation({
    mutationFn: async () => {
      if (!classData) throw new Error("No class data");
      
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const res = await apiRequest("POST", `/api/classes/${classData.id}/enroll`);
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: "Enrollment Successful!",
        description: "You have been enrolled in the class and payment was processed.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/enrollments"] });
      onClose();
      resetForm();
    },
    onError: (error: Error) => {
      toast({
        title: "Enrollment Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const resetForm = () => {
    setCardNumber("");
    setExpiry("");
    setCvc("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    enrollMutation.mutate();
  };

  if (!classData) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="glass-strong max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-bold mb-2">
            Enroll in Class
          </DialogTitle>
          <p className="text-center text-muted-foreground">
            Complete your enrollment and payment
          </p>
        </DialogHeader>

        {/* Class Details */}
        <Card className="glass mb-6">
          <CardContent className="p-4">
            <h3 className="font-semibold mb-2">{classData.title}</h3>
            <p className="text-sm text-muted-foreground mb-3">by {classData.teacher}</p>
            <div className="flex items-center justify-between">
              <span className="text-lg font-bold text-green-400">${classData.price}</span>
              {classData.rating && (
                <div className="flex items-center">
                  <Star className="w-4 h-4 text-yellow-400 mr-1 fill-current" />
                  <span className="text-sm">{classData.rating}</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Payment Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="cardNumber">Card Number</Label>
            <Input
              id="cardNumber"
              type="text"
              placeholder="4242 4242 4242 4242"
              value={cardNumber}
              onChange={(e) => setCardNumber(e.target.value)}
              className="glass"
              required
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="expiry">Expiry</Label>
              <Input
                id="expiry"
                type="text"
                placeholder="MM/YY"
                value={expiry}
                onChange={(e) => setExpiry(e.target.value)}
                className="glass"
                required
              />
            </div>
            <div>
              <Label htmlFor="cvc">CVC</Label>
              <Input
                id="cvc"
                type="text"
                placeholder="123"
                value={cvc}
                onChange={(e) => setCvc(e.target.value)}
                className="glass"
                required
              />
            </div>
          </div>

          <div className="flex space-x-4 pt-4">
            <Button 
              type="button" 
              variant="outline" 
              className="flex-1 glass" 
              onClick={onClose}
              disabled={enrollMutation.isPending}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600"
              disabled={enrollMutation.isPending}
            >
              <CreditCard className="w-4 h-4 mr-2" />
              {enrollMutation.isPending ? "Processing..." : "Pay & Enroll"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
