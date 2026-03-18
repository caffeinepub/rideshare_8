import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Search, SlidersHorizontal } from "lucide-react";
import { motion } from "motion/react";
import { useMemo, useState } from "react";
import VehicleCard from "../components/VehicleCard";
import { mockVehicles } from "../data/mockVehicles";
import { VehicleType, useGetAvailableVehicles } from "../hooks/useQueries";

const CITIES = [
  "All Cities",
  "Bangalore",
  "Mumbai",
  "Delhi",
  "Chennai",
  "Hyderabad",
  "Pune",
];
const SKELETON_KEYS = ["sk1", "sk2", "sk3", "sk4", "sk5", "sk6", "sk7", "sk8"];

export default function BrowsePage() {
  const [locationFilter, setLocationFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [cityFilter, setCityFilter] = useState("All Cities");

  const { data: backendVehicles, isLoading } = useGetAvailableVehicles();
  const allVehicles =
    backendVehicles && backendVehicles.length > 0
      ? backendVehicles
      : mockVehicles;

  const filtered = useMemo(() => {
    return allVehicles.filter((v) => {
      const matchLocation =
        !locationFilter ||
        v.location.toLowerCase().includes(locationFilter.toLowerCase());
      const matchType = typeFilter === "all" || v.vehicleType === typeFilter;
      const matchCity =
        cityFilter === "All Cities" || v.location === cityFilter;
      return matchLocation && matchType && matchCity;
    });
  }, [allVehicles, locationFilter, typeFilter, cityFilter]);

  return (
    <div className="min-h-screen bg-brand-light">
      <div className="bg-primary text-primary-foreground py-10">
        <div className="container mx-auto px-4">
          <h1 className="font-heading text-3xl font-bold mb-2">
            Browse Vehicles
          </h1>
          <p className="text-primary-foreground/70">
            Find the perfect two-wheeler for your journey
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div
          className="bg-white rounded-2xl shadow-xs p-4 mb-8 flex flex-col md:flex-row gap-3"
          data-ocid="browse.filters.panel"
        >
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search by location..."
              value={locationFilter}
              onChange={(e) => setLocationFilter(e.target.value)}
              className="pl-9"
              data-ocid="browse.location.search_input"
            />
          </div>
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger
              className="w-full md:w-44"
              data-ocid="browse.type.select"
            >
              <SlidersHorizontal className="w-4 h-4 mr-2 text-muted-foreground" />
              <SelectValue placeholder="Vehicle Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value={VehicleType.bike}>Bike</SelectItem>
              <SelectItem value={VehicleType.scooty}>Scooty</SelectItem>
              <SelectItem value={VehicleType.electric}>Electric</SelectItem>
            </SelectContent>
          </Select>
          <Select value={cityFilter} onValueChange={setCityFilter}>
            <SelectTrigger
              className="w-full md:w-44"
              data-ocid="browse.city.select"
            >
              <SelectValue placeholder="City" />
            </SelectTrigger>
            <SelectContent>
              {CITIES.map((c) => (
                <SelectItem key={c} value={c}>
                  {c}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2 mb-4">
          <span className="text-muted-foreground text-sm">
            {filtered.length} vehicles found
          </span>
          {typeFilter !== "all" && (
            <Badge variant="secondary" className="capitalize">
              {typeFilter}
            </Badge>
          )}
        </div>

        {isLoading ? (
          <div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            data-ocid="browse.loading_state"
          >
            {SKELETON_KEYS.map((key) => (
              <div key={key} className="rounded-xl overflow-hidden">
                <Skeleton className="h-48 w-full" />
                <div className="p-4 space-y-2">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                  <Skeleton className="h-8 w-full mt-4" />
                </div>
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20" data-ocid="browse.empty_state">
            <p className="text-muted-foreground text-lg">
              No vehicles found for your search criteria.
            </p>
          </div>
        ) : (
          <div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            data-ocid="browse.list"
          >
            {filtered.map((v, i) => {
              const imageUrl =
                "image" in v && v.image
                  ? (v.image as any).getDirectURL?.()
                  : "imageUrl" in v
                    ? (v as any).imageUrl
                    : undefined;
              return (
                <motion.div
                  key={v.id.toString()}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: i * 0.05 }}
                >
                  <VehicleCard
                    id={v.id}
                    brand={v.brand}
                    model={v.model}
                    vehicleType={v.vehicleType}
                    year={v.year}
                    rentalPricePerDay={v.rentalPricePerDay}
                    location={v.location}
                    imageUrl={imageUrl}
                    index={i + 1}
                  />
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
