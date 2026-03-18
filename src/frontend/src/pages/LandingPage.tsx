import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useNavigate } from "@tanstack/react-router";
import { ArrowRight, CalendarCheck, Clock, Shield } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import VehicleCard from "../components/VehicleCard";
import { mockVehicles } from "../data/mockVehicles";
import { VehicleType, useGetAvailableVehicles } from "../hooks/useQueries";

export default function LandingPage() {
  const navigate = useNavigate();
  const [searchLocation, setSearchLocation] = useState("");
  const [vehicleTypeFilter, setVehicleTypeFilter] = useState("all");

  const { data: backendVehicles } = useGetAvailableVehicles();
  const displayVehicles = (
    backendVehicles && backendVehicles.length > 0
      ? backendVehicles
      : mockVehicles
  ).slice(0, 4);

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (searchLocation) params.set("location", searchLocation);
    if (vehicleTypeFilter && vehicleTypeFilter !== "all")
      params.set("type", vehicleTypeFilter);
    navigate({ to: "/browse", search: params.toString() as any });
  };

  const trustItems = [
    {
      icon: <Shield className="w-8 h-8 text-accent" />,
      title: "Verified Owners & Vehicles",
      desc: "Every vehicle and owner is verified for your safety and peace of mind.",
    },
    {
      icon: <CalendarCheck className="w-8 h-8 text-accent" />,
      title: "Easy & Secure Booking",
      desc: "Book in minutes with our secure payment system powered by Stripe.",
    },
    {
      icon: <Clock className="w-8 h-8 text-accent" />,
      title: "Flexible Rental Periods",
      desc: "Rent by the day, week, or month. Cancel anytime with free cancellation.",
    },
  ];

  return (
    <div>
      <section
        className="relative min-h-[600px] flex items-center"
        data-ocid="landing.section"
      >
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url('/assets/generated/hero-rideshare.dim_1600x900.jpg')`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/90 via-primary/70 to-primary/40" />

        <div className="relative container mx-auto px-4 py-20">
          <motion.div
            className="max-w-xl"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight">
              Rent a Bike or
              <br />
              <span className="text-accent">Scooty Near You</span>
            </h1>
            <p className="text-white/80 text-lg mb-8">
              India's trusted two-wheeler rental marketplace. Find bikes,
              scooters and electric vehicles from verified owners across major
              cities.
            </p>
          </motion.div>

          <motion.div
            className="bg-white rounded-2xl shadow-hero p-4 md:p-6 max-w-3xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-end">
              <div>
                <label
                  htmlFor="search-location"
                  className="text-xs font-medium text-muted-foreground mb-1 block"
                >
                  Location
                </label>
                <Input
                  id="search-location"
                  placeholder="Bangalore, Mumbai..."
                  value={searchLocation}
                  onChange={(e) => setSearchLocation(e.target.value)}
                  className="h-11"
                  data-ocid="search.location.input"
                />
              </div>
              <div>
                <label
                  htmlFor="search-type"
                  className="text-xs font-medium text-muted-foreground mb-1 block"
                >
                  Vehicle Type
                </label>
                <Select
                  value={vehicleTypeFilter}
                  onValueChange={setVehicleTypeFilter}
                >
                  <SelectTrigger
                    id="search-type"
                    className="h-11"
                    data-ocid="search.vehicle_type.select"
                  >
                    <SelectValue placeholder="All Types" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value={VehicleType.bike}>Bike</SelectItem>
                    <SelectItem value={VehicleType.scooty}>Scooty</SelectItem>
                    <SelectItem value={VehicleType.electric}>
                      Electric
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button
                className="h-11 bg-accent hover:bg-accent/90 text-accent-foreground font-semibold"
                onClick={handleSearch}
                data-ocid="search.submit.button"
              >
                Search Vehicles
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-16 bg-brand-light">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="font-heading text-3xl font-bold text-foreground">
                Popular Rentals
              </h2>
              <p className="text-muted-foreground mt-1">
                Top-rated vehicles from trusted owners
              </p>
            </div>
            <Button
              variant="outline"
              className="hidden md:flex items-center gap-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground"
              onClick={() => navigate({ to: "/browse" })}
              data-ocid="landing.browse_all.button"
            >
              View All <ArrowRight className="w-4 h-4" />
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {displayVehicles.map((v, i) => {
              const imageUrl =
                "image" in v && v.image
                  ? (v.image as any).getDirectURL?.()
                  : "imageUrl" in v
                    ? (v as any).imageUrl
                    : undefined;
              return (
                <motion.div
                  key={v.id.toString()}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.1 }}
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

          <div className="mt-6 text-center md:hidden">
            <Button
              variant="outline"
              className="border-primary text-primary"
              onClick={() => navigate({ to: "/browse" })}
            >
              View All Vehicles
            </Button>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white" id="how-it-works">
        <div className="container mx-auto px-4">
          <h2 className="font-heading text-3xl font-bold text-center text-foreground mb-12">
            Why Choose RideShare?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {trustItems.map((item, i) => (
              <motion.div
                key={item.title}
                className="text-center p-6 rounded-2xl bg-brand-light"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
              >
                <div className="flex justify-center mb-4">{item.icon}</div>
                <h3 className="font-heading font-semibold text-lg mb-2">
                  {item.title}
                </h3>
                <p className="text-muted-foreground text-sm">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-gradient-to-r from-primary to-secondary">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8 text-white">
            <div>
              <h2 className="font-heading text-3xl font-bold mb-2">
                Earn from your Two-Wheeler!
              </h2>
              <p className="text-white/80">
                List your bike or scooty and earn ₹5,000 - ₹20,000 per month
                from idle vehicles.
              </p>
            </div>
            <Button
              className="bg-accent hover:bg-accent/90 text-accent-foreground font-bold text-lg px-8 py-6 rounded-xl whitespace-nowrap"
              onClick={() => navigate({ to: "/dashboard" })}
              data-ocid="landing.list_now.button"
            >
              List Now →
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
