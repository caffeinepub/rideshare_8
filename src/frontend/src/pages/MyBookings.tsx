import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bike, CalendarDays } from "lucide-react";
import { motion } from "motion/react";
import { useInternetIdentity } from "../hooks/useInternetIdentity";

interface LocalBooking {
  id: string;
  vehicle: string;
  location: string;
  startDate: string;
  endDate: string;
  totalCost: number;
  status: "confirmed" | "pending" | "completed";
}

const sampleBookings: LocalBooking[] = [
  {
    id: "BK001",
    vehicle: "Royal Enfield Classic 350",
    location: "Bangalore",
    startDate: "2026-03-20",
    endDate: "2026-03-23",
    totalCost: 3780,
    status: "confirmed",
  },
  {
    id: "BK002",
    vehicle: "Ather 450X",
    location: "Hyderabad",
    startDate: "2026-03-25",
    endDate: "2026-03-26",
    totalCost: 840,
    status: "pending",
  },
  {
    id: "BK003",
    vehicle: "Honda Activa 6G",
    location: "Mumbai",
    startDate: "2026-02-10",
    endDate: "2026-02-12",
    totalCost: 1050,
    status: "completed",
  },
];

const statusColor: Record<string, string> = {
  confirmed: "bg-green-100 text-green-700",
  pending: "bg-yellow-100 text-yellow-700",
  completed: "bg-muted text-muted-foreground",
};

export default function MyBookings() {
  const { identity } = useInternetIdentity();

  if (!identity) {
    return (
      <div className="min-h-screen bg-brand-light flex items-center justify-center">
        <Card className="max-w-md w-full mx-4 shadow-card">
          <CardContent className="p-8 text-center">
            <CalendarDays className="w-12 h-12 text-primary mx-auto mb-4" />
            <h2 className="font-heading text-xl font-bold mb-2">
              Login Required
            </h2>
            <p className="text-muted-foreground">
              Please login to view your bookings.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-light">
      <div className="bg-primary text-primary-foreground py-10">
        <div className="container mx-auto px-4">
          <h1 className="font-heading text-3xl font-bold mb-1">My Bookings</h1>
          <p className="text-primary-foreground/70">
            Track your rental history and upcoming bookings
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {sampleBookings.length === 0 ? (
          <div className="text-center py-20" data-ocid="bookings.empty_state">
            <CalendarDays className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
            <h3 className="font-heading text-xl font-semibold mb-2">
              No bookings yet
            </h3>
            <p className="text-muted-foreground">
              Start by browsing and booking a vehicle.
            </p>
          </div>
        ) : (
          <div className="space-y-4" data-ocid="bookings.list">
            {sampleBookings.map((booking, i) => (
              <motion.div
                key={booking.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: i * 0.08 }}
                data-ocid={`bookings.item.${i + 1}`}
              >
                <Card className="shadow-xs hover:shadow-card transition-shadow">
                  <CardContent className="p-5">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center shrink-0">
                          <Bike className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-heading font-semibold">
                            {booking.vehicle}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {booking.location}
                          </p>
                          <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                            <CalendarDays className="w-3 h-3" />
                            {booking.startDate} → {booking.endDate}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 sm:flex-col sm:items-end">
                        <span
                          className={`text-xs font-medium px-2 py-1 rounded-full capitalize ${statusColor[booking.status]}`}
                        >
                          {booking.status}
                        </span>
                        <p className="font-heading font-bold text-accent">
                          ₹{booking.totalCost.toLocaleString("en-IN")}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          #{booking.id}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
