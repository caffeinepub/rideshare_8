import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "@tanstack/react-router";
import { Bike, MapPin, ShoppingBag, Zap } from "lucide-react";
import { VehicleType } from "../hooks/useQueries";

interface VehicleCardProps {
  id: bigint;
  brand: string;
  model: string;
  vehicleType: VehicleType;
  year: string;
  rentalPricePerDay: bigint;
  location: string;
  imageUrl?: string;
  index?: number;
}

const typeBadge = {
  [VehicleType.bike]: {
    label: "Bike",
    icon: <Bike className="w-3 h-3" />,
    color: "bg-primary/10 text-primary",
  },
  [VehicleType.scooty]: {
    label: "Scooty",
    icon: <ShoppingBag className="w-3 h-3" />,
    color: "bg-secondary/10 text-secondary",
  },
  [VehicleType.electric]: {
    label: "Electric",
    icon: <Zap className="w-3 h-3" />,
    color: "bg-accent/10 text-accent-foreground",
  },
};

export default function VehicleCard({
  id,
  brand,
  model,
  vehicleType,
  year,
  rentalPricePerDay,
  location,
  imageUrl,
  index = 1,
}: VehicleCardProps) {
  const navigate = useNavigate();
  const badge = typeBadge[vehicleType] ?? typeBadge[VehicleType.bike];

  return (
    <Card
      className="overflow-hidden hover:shadow-card transition-shadow duration-200 group"
      data-ocid={`vehicle.item.${index}`}
    >
      <div className="relative overflow-hidden h-48 bg-muted">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={`${brand} ${model}`}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted-foreground">
            <Bike className="w-16 h-16 opacity-30" />
          </div>
        )}
        <div
          className={`absolute top-3 left-3 flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${badge.color} bg-white/90 backdrop-blur-sm`}
        >
          {badge.icon}
          {badge.label}
        </div>
      </div>
      <CardContent className="p-4">
        <div className="mb-1">
          <h3 className="font-heading font-semibold text-foreground">
            {brand} {model}
          </h3>
          <p className="text-xs text-muted-foreground">{year}</p>
        </div>
        <div className="flex items-center gap-1 text-xs text-muted-foreground mb-3">
          <MapPin className="w-3 h-3" />
          {location}
        </div>
        <div className="flex items-center justify-between">
          <div>
            <span className="font-heading font-bold text-lg text-accent">
              ₹{rentalPricePerDay.toString()}
            </span>
            <span className="text-xs text-muted-foreground">/day</span>
          </div>
          <Button
            size="sm"
            className="bg-primary hover:bg-primary/90 text-primary-foreground"
            onClick={() =>
              navigate({ to: "/vehicle/$id", params: { id: id.toString() } })
            }
            data-ocid={`vehicle.view_details.button.${index}`}
          >
            View Details
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
