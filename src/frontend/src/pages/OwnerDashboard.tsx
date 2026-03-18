import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Bike, Loader2, MapPin, Plus, Upload } from "lucide-react";
import { motion } from "motion/react";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { ExternalBlob } from "../backend";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import {
  VehicleType,
  useAddVehicle,
  useGetAllVehicles,
} from "../hooks/useQueries";

export default function OwnerDashboard() {
  const { identity } = useInternetIdentity();
  const addVehicle = useAddVehicle();
  const { data: vehicles, isLoading } = useGetAllVehicles();

  const [brand, setBrand] = useState("");
  const [model, setModel] = useState("");
  const [year, setYear] = useState("");
  const [vehicleType, setVehicleType] = useState<VehicleType>(VehicleType.bike);
  const [pricePerDay, setPricePerDay] = useState("");
  const [location, setLocation] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState("");
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!identity) {
      toast.error("Please login to list a vehicle");
      return;
    }
    if (!brand || !model || !year || !pricePerDay || !location) {
      toast.error("Please fill in all required fields");
      return;
    }

    let externalBlob: ExternalBlob | null = null;
    if (imageFile) {
      const bytes = new Uint8Array(await imageFile.arrayBuffer());
      externalBlob = ExternalBlob.fromBytes(bytes).withUploadProgress((pct) => {
        setUploadProgress(pct);
      });
    }

    try {
      await addVehicle.mutateAsync({
        vehicleType,
        brand,
        model,
        year,
        rentalPricePerDay: BigInt(Math.round(Number.parseFloat(pricePerDay))),
        image: externalBlob,
        location,
      });
      toast.success("Vehicle listed successfully!");
      setBrand("");
      setModel("");
      setYear("");
      setPricePerDay("");
      setLocation("");
      setImageFile(null);
      setImagePreview("");
      setUploadProgress(0);
    } catch (err: any) {
      toast.error(err.message ?? "Failed to list vehicle");
    }
  };

  if (!identity) {
    return (
      <div className="min-h-screen bg-brand-light flex items-center justify-center">
        <Card className="max-w-md w-full mx-4 shadow-card">
          <CardContent className="p-8 text-center">
            <Bike className="w-12 h-12 text-primary mx-auto mb-4" />
            <h2 className="font-heading text-xl font-bold mb-2">
              Login Required
            </h2>
            <p className="text-muted-foreground">
              Please login to access the owner dashboard and list your vehicles.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const myVehicles =
    vehicles?.filter(
      (v) => v.owner.toString() === identity.getPrincipal().toString(),
    ) ?? [];

  return (
    <div className="min-h-screen bg-brand-light">
      <div className="bg-primary text-primary-foreground py-10">
        <div className="container mx-auto px-4">
          <h1 className="font-heading text-3xl font-bold mb-1">
            Owner Dashboard
          </h1>
          <p className="text-primary-foreground/70">
            List and manage your two-wheelers
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="font-heading flex items-center gap-2">
                  <Plus className="w-5 h-5 text-accent" />
                  List a New Vehicle
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form
                  onSubmit={handleSubmit}
                  className="space-y-4"
                  data-ocid="add_vehicle.form"
                >
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label htmlFor="brand">Brand *</Label>
                      <Input
                        id="brand"
                        placeholder="e.g. Hero, Honda"
                        value={brand}
                        onChange={(e) => setBrand(e.target.value)}
                        required
                        data-ocid="add_vehicle.brand.input"
                      />
                    </div>
                    <div>
                      <Label htmlFor="model">Model *</Label>
                      <Input
                        id="model"
                        placeholder="e.g. Splendor"
                        value={model}
                        onChange={(e) => setModel(e.target.value)}
                        required
                        data-ocid="add_vehicle.model.input"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label htmlFor="year">Year *</Label>
                      <Input
                        id="year"
                        placeholder="2023"
                        value={year}
                        onChange={(e) => setYear(e.target.value)}
                        required
                        data-ocid="add_vehicle.year.input"
                      />
                    </div>
                    <div>
                      <Label htmlFor="vtype">Vehicle Type *</Label>
                      <Select
                        value={vehicleType}
                        onValueChange={(v) => setVehicleType(v as VehicleType)}
                      >
                        <SelectTrigger
                          id="vtype"
                          data-ocid="add_vehicle.type.select"
                        >
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value={VehicleType.bike}>Bike</SelectItem>
                          <SelectItem value={VehicleType.scooty}>
                            Scooty
                          </SelectItem>
                          <SelectItem value={VehicleType.electric}>
                            Electric
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label htmlFor="price">Price / Day (₹) *</Label>
                      <Input
                        id="price"
                        type="number"
                        placeholder="500"
                        value={pricePerDay}
                        onChange={(e) => setPricePerDay(e.target.value)}
                        required
                        min="1"
                        data-ocid="add_vehicle.price.input"
                      />
                    </div>
                    <div>
                      <Label htmlFor="location">Location *</Label>
                      <Input
                        id="location"
                        placeholder="Bangalore"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        required
                        data-ocid="add_vehicle.location.input"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="photo">Vehicle Photo</Label>
                    <button
                      type="button"
                      className="mt-1 w-full border-2 border-dashed border-border rounded-xl p-4 text-center cursor-pointer hover:border-primary transition-colors"
                      onClick={() => fileInputRef.current?.click()}
                      aria-label="Upload vehicle photo"
                      data-ocid="add_vehicle.dropzone"
                    >
                      {imagePreview ? (
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="mx-auto h-32 object-contain rounded"
                        />
                      ) : (
                        <div className="py-4">
                          <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                          <p className="text-sm text-muted-foreground">
                            Click to upload photo
                          </p>
                        </div>
                      )}
                      {uploadProgress > 0 && uploadProgress < 100 && (
                        <p className="text-xs text-muted-foreground mt-2">
                          Uploading: {uploadProgress}%
                        </p>
                      )}
                    </button>
                    <input
                      ref={fileInputRef}
                      id="photo"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageChange}
                      data-ocid="add_vehicle.upload_button"
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-semibold"
                    disabled={addVehicle.isPending}
                    data-ocid="add_vehicle.submit.button"
                  >
                    {addVehicle.isPending ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />{" "}
                        Listing...
                      </>
                    ) : (
                      "List Vehicle"
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="font-heading">
                  My Vehicles ({myVehicles.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <p
                    className="text-muted-foreground text-sm"
                    data-ocid="dashboard.vehicles.loading_state"
                  >
                    Loading...
                  </p>
                ) : myVehicles.length === 0 ? (
                  <div
                    className="text-center py-8"
                    data-ocid="dashboard.vehicles.empty_state"
                  >
                    <Bike className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
                    <p className="text-muted-foreground">
                      No vehicles listed yet.
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Add your first vehicle using the form.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {myVehicles.map((v, i) => (
                      <div
                        key={v.id.toString()}
                        className="flex items-center justify-between p-3 bg-brand-light rounded-xl"
                        data-ocid={`dashboard.vehicle.item.${i + 1}`}
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                            <Bike className="w-5 h-5 text-primary" />
                          </div>
                          <div>
                            <p className="font-medium text-sm">
                              {v.brand} {v.model}
                            </p>
                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                              <MapPin className="w-3 h-3" /> {v.location}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-accent text-sm">
                            ₹{v.rentalPricePerDay.toString()}/day
                          </p>
                          <Badge
                            variant={v.available ? "default" : "secondary"}
                            className="text-xs"
                          >
                            {v.available ? "Available" : "Rented"}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
