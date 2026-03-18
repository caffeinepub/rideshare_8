import { VehicleType } from "../hooks/useQueries";

export interface MockVehicle {
  id: bigint;
  brand: string;
  model: string;
  vehicleType: VehicleType;
  year: string;
  rentalPricePerDay: bigint;
  location: string;
  available: boolean;
  imageUrl: string;
}

export const mockVehicles: MockVehicle[] = [
  {
    id: BigInt(1),
    brand: "Royal Enfield",
    model: "Classic 350",
    vehicleType: VehicleType.bike,
    year: "2023",
    rentalPricePerDay: BigInt(1200),
    location: "Bangalore",
    available: true,
    imageUrl: "/assets/generated/vehicle-royal-enfield.dim_800x500.jpg",
  },
  {
    id: BigInt(2),
    brand: "Honda",
    model: "Activa 6G",
    vehicleType: VehicleType.scooty,
    year: "2023",
    rentalPricePerDay: BigInt(500),
    location: "Mumbai",
    available: true,
    imageUrl: "/assets/generated/vehicle-honda-activa.dim_800x500.jpg",
  },
  {
    id: BigInt(3),
    brand: "Ather",
    model: "450X",
    vehicleType: VehicleType.electric,
    year: "2024",
    rentalPricePerDay: BigInt(800),
    location: "Hyderabad",
    available: true,
    imageUrl: "/assets/generated/vehicle-ather-electric.dim_800x500.jpg",
  },
  {
    id: BigInt(4),
    brand: "Hero",
    model: "Splendor Plus",
    vehicleType: VehicleType.bike,
    year: "2022",
    rentalPricePerDay: BigInt(450),
    location: "Delhi",
    available: true,
    imageUrl: "/assets/generated/vehicle-hero-splendor.dim_800x500.jpg",
  },
  {
    id: BigInt(5),
    brand: "TVS",
    model: "Jupiter 125",
    vehicleType: VehicleType.scooty,
    year: "2023",
    rentalPricePerDay: BigInt(550),
    location: "Chennai",
    available: true,
    imageUrl: "/assets/generated/vehicle-tvs-jupiter.dim_800x500.jpg",
  },
  {
    id: BigInt(6),
    brand: "Bajaj",
    model: "Pulsar 150",
    vehicleType: VehicleType.bike,
    year: "2023",
    rentalPricePerDay: BigInt(700),
    location: "Pune",
    available: true,
    imageUrl: "/assets/generated/vehicle-bajaj-pulsar.dim_800x500.jpg",
  },
];
