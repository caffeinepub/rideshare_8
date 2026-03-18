import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useParams } from "@tanstack/react-router";
import {
  Bike,
  CalendarDays,
  MapPin,
  ShoppingBag,
  Star,
  User,
  Zap,
} from "lucide-react";
import { motion } from "motion/react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { mockVehicles } from "../data/mockVehicles";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import {
  VehicleType,
  useCreateBooking,
  useCreateCheckoutSession,
  useGetVehicle,
} from "../hooks/useQueries";

const typeInfo = {
  [VehicleType.bike]: {
    label: "Bike",
    icon: <Bike className="w-4 h-4" />,
    color: "bg-primary/10 text-primary",
  },
  [VehicleType.scooty]: {
    label: "Scooty",
    icon: <ShoppingBag className="w-4 h-4" />,
    color: "bg-secondary/10 text-secondary",
  },
  [VehicleType.electric]: {
    label: "Electric",
    icon: <Zap className="w-4 h-4" />,
    color: "bg-accent/10 text-accent-foreground",
  },
};

export default function VehicleDetailPage() {
  const { id } = useParams({ from: "/vehicle/$id" });
  const { identity } = useInternetIdentity();
  const vehicleId = BigInt(id);

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [isBooking, setIsBooking] = useState(false);

  const { data: backendVehicle, isLoading } = useGetVehicle(vehicleId);
  const createBooking = useCreateBooking();
  const createCheckout = useCreateCheckoutSession();

  const mockVehicle = mockVehicles.find((v) => v.id === vehicleId);
  const vehicle = backendVehicle ?? mockVehicle;

  const days = useMemo(() => {
    if (!startDate || !endDate) return 0;
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diff = Math.ceil(
      (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24),
    );
    return diff > 0 ? diff : 0;
  }, [startDate, endDate]);

  const totalCost = vehicle ? Number(vehicle.rentalPricePerDay) * days : 0;

  const handleBook = async () => {
    if (!identity) {
      toast.error("Please login to book a vehicle");
      return;
    }
    if (!startDate || !endDate || days <= 0) {
      toast.error("Please select valid dates");
      return;
    }
    if (!vehicle) return;

    setIsBooking(true);
    try {
      const startTs = BigInt(new Date(startDate).getTime()) * BigInt(1_000_000);
      const endTs = BigInt(new Date(endDate).getTime()) * BigInt(1_000_000);
      const bookingId = await createBooking.mutateAsync({
        vehicleId: vehicle.id,
        startDate: startTs,
        endDate: endTs,
      });

      try {
        const session = await createCheckout.mutateAsync([
          {
            productName: `${vehicle.brand} ${vehicle.model}`,
            currency: "inr",
            quantity: BigInt(days),
            priceInCents: vehicle.rentalPricePerDay * BigInt(100),
            productDescription: `${days}-day rental from ${startDate} to ${endDate}`,
          },
        ]);
        if (!session?.url) throw new Error("No session URL");
        window.location.href = session.url;
      } catch {
        toast.success(`Booking #${bookingId.toString()} created successfully!`);
      }
    } catch (err: any) {
      toast.error(err.message ?? "Booking failed. Please try again.");
    } finally {
      setIsBooking(false);
    }
  };

  if (isLoading) {
    return (
      <div
        className="container mx-auto px-4 py-12 text-center"
        data-ocid="vehicle_detail.loading_state"
      >
        <p className="text-muted-foreground">Loading vehicle details...</p>
      </div>
    );
  }

  if (!vehicle) {
    return (
      <div
        className="container mx-auto px-4 py-12 text-center"
        data-ocid="vehicle_detail.error_state"
      >
        <p className="text-muted-foreground">Vehicle not found.</p>
      </div>
    );
  }

  const badge = typeInfo[vehicle.vehicleType] ?? typeInfo[VehicleType.bike];
  const imageUrl =
    "image" in vehicle && vehicle.image
      ? (vehicle.image as any).getDirectURL?.()
      : "imageUrl" in vehicle
        ? (vehicle as any).imageUrl
        : undefined;
  const ownerStr =
    "owner" in vehicle ? vehicle.owner.toString().slice(0, 12) : "Unknown";

  return (
    <div className="min-h-screen bg-brand-light py-10">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="rounded-2xl overflow-hidden bg-white shadow-card mb-6 h-80">
              {imageUrl ? (
                <img
                  src={imageUrl}
                  alt={`${vehicle.brand} ${vehicle.model}`}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-muted">
                  <Bike className="w-24 h-24 text-muted-foreground/30" />
                </div>
              )}
            </div>

            <Card className="shadow-card">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h1 className="font-heading text-3xl font-bold">
                      {vehicle.brand} {vehicle.model}
                    </h1>
                    <p className="text-muted-foreground">
                      {vehicle.year} Model
                    </p>
                  </div>
                  <span
                    className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${badge.color}`}
                  >
                    {badge.icon} {badge.label}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-muted-foreground mb-4">
                  <MapPin className="w-4 h-4" />
                  <span>{vehicle.location}</span>
                </div>

                <Separator className="my-4" />

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-brand-light rounded-xl p-3 text-center">
                    <p className="text-xs text-muted-foreground mb-1">
                      Per Day
                    </p>
                    <p className="font-heading font-bold text-2xl text-accent">
                      ₹{vehicle.rentalPricePerDay.toString()}
                    </p>
                  </div>
                  <div className="bg-brand-light rounded-xl p-3 text-center">
                    <p className="text-xs text-muted-foreground mb-1">
                      Availability
                    </p>
                    <p className="font-heading font-bold text-green-600">
                      {vehicle.available ? "Available" : "Not Available"}
                    </p>
                  </div>
                </div>

                <div className="mt-4 flex items-center gap-2 text-muted-foreground text-sm">
                  <User className="w-4 h-4" />
                  <span>Owner: {ownerStr}...</span>
                </div>

                <div className="mt-3 flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star key={s} className="w-4 h-4 fill-accent text-accent" />
                  ))}
                  <span className="text-sm text-muted-foreground ml-1">
                    4.8 (32 reviews)
                  </span>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Card className="shadow-card sticky top-24">
              <CardContent className="p-6">
                <h2 className="font-heading text-xl font-bold mb-4 flex items-center gap-2">
                  <CalendarDays className="w-5 h-5 text-accent" />
                  Book This Vehicle
                </h2>

                <div className="space-y-4">
                  <div>
                    <label
                      htmlFor="start-date"
                      className="text-sm font-medium text-foreground mb-1 block"
                    >
                      Start Date
                    </label>
                    <input
                      id="start-date"
                      type="date"
                      value={startDate}
                      min={new Date().toISOString().split("T")[0]}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                      data-ocid="booking.start_date.input"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="end-date"
                      className="text-sm font-medium text-foreground mb-1 block"
                    >
                      End Date
                    </label>
                    <input
                      id="end-date"
                      type="date"
                      value={endDate}
                      min={startDate || new Date().toISOString().split("T")[0]}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                      data-ocid="booking.end_date.input"
                    />
                  </div>

                  {days > 0 && (
                    <motion.div
                      className="bg-brand-light rounded-xl p-4 space-y-2"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                    >
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">
                          ₹{vehicle.rentalPricePerDay.toString()} × {days} day
                          {days > 1 ? "s" : ""}
                        </span>
                        <span>
                          ₹
                          {(
                            Number(vehicle.rentalPricePerDay) * days
                          ).toLocaleString("en-IN")}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">
                          Service fee
                        </span>
                        <span>
                          ₹
                          {Math.round(totalCost * 0.05).toLocaleString("en-IN")}
                        </span>
                      </div>
                      <Separator />
                      <div className="flex justify-between font-heading font-bold">
                        <span>Total</span>
                        <span className="text-accent">
                          ₹
                          {Math.round(totalCost * 1.05).toLocaleString("en-IN")}
                        </span>
                      </div>
                    </motion.div>
                  )}

                  <Button
                    className="w-full h-12 bg-accent hover:bg-accent/90 text-accent-foreground font-bold text-base"
                    onClick={handleBook}
                    disabled={isBooking || !vehicle.available}
                    data-ocid="booking.submit.button"
                  >
                    {isBooking
                      ? "Processing..."
                      : vehicle.available
                        ? "Book Now"
                        : "Not Available"}
                  </Button>

                  {!identity && (
                    <p className="text-xs text-center text-muted-foreground">
                      Login required to book a vehicle
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
