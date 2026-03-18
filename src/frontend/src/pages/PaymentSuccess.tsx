import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import { CheckCircle2 } from "lucide-react";
import { motion } from "motion/react";
import { useEffect } from "react";

export default function PaymentSuccess() {
  useEffect(() => {
    document.title = "Payment Successful – RideShare";
  }, []);

  return (
    <div className="min-h-screen bg-brand-light flex items-center justify-center px-4">
      <motion.div
        className="bg-white rounded-2xl shadow-hero p-10 max-w-md w-full text-center"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        data-ocid="payment.success_state"
      >
        <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
        <h1 className="font-heading text-2xl font-bold mb-2">
          Payment Successful!
        </h1>
        <p className="text-muted-foreground mb-6">
          Your booking is confirmed. You can view your booking details in My
          Bookings.
        </p>
        <div className="flex gap-3 justify-center">
          <Link to="/bookings">
            <Button
              className="bg-primary hover:bg-primary/90 text-primary-foreground"
              data-ocid="payment.view_bookings.button"
            >
              View Bookings
            </Button>
          </Link>
          <Link to="/browse">
            <Button variant="outline" data-ocid="payment.browse.button">
              Browse More
            </Button>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
