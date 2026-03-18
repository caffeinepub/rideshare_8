import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  type ExternalBlob,
  type ShoppingItem,
  type Vehicle,
  VehicleType,
} from "../backend";
import { useActor } from "./useActor";

export { VehicleType };
export type { Vehicle };

export function useGetAvailableVehicles() {
  const { actor, isFetching } = useActor();
  return useQuery<Vehicle[]>({
    queryKey: ["vehicles", "available"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAvailableVehicles();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetVehicle(id: bigint) {
  const { actor, isFetching } = useActor();
  return useQuery<Vehicle>({
    queryKey: ["vehicle", id.toString()],
    queryFn: async () => {
      if (!actor) throw new Error("Actor not available");
      return actor.getVehicle(id);
    },
    enabled: !!actor && !isFetching && id !== BigInt(0),
  });
}

export function useAddVehicle() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (params: {
      vehicleType: VehicleType;
      brand: string;
      model: string;
      year: string;
      rentalPricePerDay: bigint;
      image: ExternalBlob | null;
      location: string;
    }) => {
      if (!actor) throw new Error("Actor not available");
      return actor.addVehicle(
        params.vehicleType,
        params.brand,
        params.model,
        params.year,
        params.rentalPricePerDay,
        params.image,
        params.location,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vehicles"] });
    },
  });
}

export function useCreateBooking() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (params: {
      vehicleId: bigint;
      startDate: bigint;
      endDate: bigint;
    }) => {
      if (!actor) throw new Error("Actor not available");
      return actor.createBooking(
        params.vehicleId,
        params.startDate,
        params.endDate,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
    },
  });
}

export type CheckoutSession = {
  id: string;
  url: string;
};

export function useCreateCheckoutSession() {
  const { actor } = useActor();
  return useMutation({
    mutationFn: async (items: ShoppingItem[]): Promise<CheckoutSession> => {
      if (!actor) throw new Error("Actor not available");
      const baseUrl = `${window.location.protocol}//${window.location.host}`;
      const successUrl = `${baseUrl}/payment-success`;
      const cancelUrl = `${baseUrl}/payment-failure`;
      const result = await actor.createCheckoutSession(
        items,
        successUrl,
        cancelUrl,
      );
      const session = JSON.parse(result) as CheckoutSession;
      if (!session?.url) throw new Error("Stripe session missing url");
      return session;
    },
  });
}

export function useIsStripeConfigured() {
  const { actor, isFetching } = useActor();
  return useQuery<boolean>({
    queryKey: ["stripeConfigured"],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isStripeConfigured();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetAllVehicles() {
  const { actor, isFetching } = useActor();
  return useQuery<Vehicle[]>({
    queryKey: ["vehicles", "all"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllVehicles();
    },
    enabled: !!actor && !isFetching,
  });
}
