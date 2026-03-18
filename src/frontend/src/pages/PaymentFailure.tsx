import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import { XCircle } from "lucide-react";
import { motion } from "motion/react";

export default function PaymentFailure() {
  return (
    <div className="min-h-screen bg-brand-light flex items-center justify-center px-4">
      <motion.div
        className="bg-white rounded-2xl shadow-hero p-10 max-w-md w-full text-center"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        data-ocid="payment.error_state"
      >
        <XCircle className="w-16 h-16 text-destructive mx-auto mb-4" />
        <h1 className="font-heading text-2xl font-bold mb-2">Payment Failed</h1>
        <p className="text-muted-foreground mb-6">
          Your payment could not be processed. Please try again or contact
          support.
        </p>
        <div className="flex gap-3 justify-center">
          <Link to="/browse">
            <Button
              className="bg-primary hover:bg-primary/90 text-primary-foreground"
              data-ocid="payment.retry.button"
            >
              Try Again
            </Button>
          </Link>
          <Link to="/">
            <Button variant="outline" data-ocid="payment.home.button">
              Go Home
            </Button>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
