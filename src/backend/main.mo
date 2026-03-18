import Map "mo:core/Map";
import Array "mo:core/Array";
import Int "mo:core/Int";
import Iter "mo:core/Iter";
import Text "mo:core/Text";
import Nat "mo:core/Nat";
import Time "mo:core/Time";
import Runtime "mo:core/Runtime";
import Principal "mo:core/Principal";
import Storage "blob-storage/Storage";
import AccessControl "authorization/access-control";
import MixinStorage "blob-storage/Mixin";
import Order "mo:core/Order";
import MixinAuthorization "authorization/MixinAuthorization";
import Stripe "stripe/stripe";
import OutCall "http-outcalls/outcall";

actor {
  type UserProfile = {
    name : Text;
    contact : Text;
  };

  // Vehicle types
  type VehicleType = { #bike; #scooty; #electric };

  type Vehicle = {
    id : Nat;
    owner : Principal;
    vehicleType : VehicleType;
    brand : Text;
    model : Text;
    year : Text;
    rentalPricePerDay : Nat;
    image : ?Storage.ExternalBlob;
    available : Bool;
    location : Text;
  };

  type Booking = {
    id : Nat;
    vehicleId : Nat;
    renter : Principal;
    startDate : Time.Time;
    endDate : Time.Time;
    totalPrice : Nat;
    status : BookingStatus;
  };

  type BookingStatus = { #pending; #confirmed; #completed; #cancelled };

  type Review = {
    id : Nat;
    vehicleId : Nat;
    reviewer : Principal;
    rating : Nat;
    comment : Text;
  };

  type Transaction = {
    id : Nat;
    user : Principal;
    amount : Nat;
    timestamp : Time.Time;
    status : TransactionStatus;
  };

  type TransactionStatus = { #pending; #completed; #failed };

  // State variables
  var nextVehicleId = 1;
  var nextBookingId = 1;
  var nextReviewId = 1;
  var nextTransactionId = 1;

  // Prefabricated component mixins
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);
  include MixinStorage();

  // Storage
  let vehicles = Map.empty<Nat, Vehicle>();
  let bookings = Map.empty<Nat, Booking>();
  let reviews = Map.empty<Nat, Review>();
  let transactions = Map.empty<Nat, Transaction>();

  // Vehicle Management
  public shared ({ caller }) func addVehicle(vehicleType : VehicleType, brand : Text, model : Text, year : Text, rentalPricePerDay : Nat, image : ?Storage.ExternalBlob, location : Text) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Must be a registered user to add vehicles");
    };

    let newVehicle : Vehicle = {
      id = nextVehicleId;
      owner = caller;
      vehicleType;
      brand;
      model;
      year;
      rentalPricePerDay;
      image;
      available = true;
      location;
    };

    vehicles.add(nextVehicleId, newVehicle);
    nextVehicleId += 1;
    newVehicle.id;
  };

  public query func getVehicle(id : Nat) : async Vehicle {
    switch (vehicles.get(id)) {
      case (null) { Runtime.trap("Vehicle does not exist") };
      case (?vehicle) { vehicle };
    };
  };

  public query func getAllVehicles() : async [Vehicle] {
    vehicles.values().toArray();
  };

  public query func getAvailableVehicles() : async [Vehicle] {
    vehicles.values().toArray().filter(
      func(vehicle) { vehicle.available }
    );
  };

  // Booking Management
  public shared ({ caller }) func createBooking(vehicleId : Nat, startDate : Time.Time, endDate : Time.Time) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Must be a registered user to book vehicles");
    };

    let vehicle = switch (vehicles.get(vehicleId)) {
      case (null) { Runtime.trap("Vehicle does not exist") };
      case (?vehicle) { vehicle };
    };

    if (not vehicle.available) {
      Runtime.trap("Vehicle is not available for booking");
    };

    let totalDays = calculateTotalDays(startDate, endDate);
    let bookingId = nextBookingId;
    let newBooking : Booking = {
      id = bookingId;
      vehicleId;
      renter = caller;
      startDate;
      endDate;
      totalPrice = vehicle.rentalPricePerDay * totalDays;
      status = #pending;
    };

    bookings.add(bookingId, newBooking);
    nextBookingId += 1;
    bookingId;
  };

  func calculateTotalDays(start : Time.Time, end : Time.Time) : Nat {
    let duration = end - start;
    (duration / (24 * 60 * 60 * 1_000_000_000)).toNat();
  };

  public shared ({ caller }) func confirmBooking(bookingId : Nat) : async () {
    let booking = switch (bookings.get(bookingId)) {
      case (null) { Runtime.trap("Booking does not exist") };
      case (?booking) { booking };
    };

    let newBooking : Booking = {
      id = booking.id;
      vehicleId = booking.vehicleId;
      renter = booking.renter;
      startDate = booking.startDate;
      endDate = booking.endDate;
      totalPrice = booking.totalPrice;
      status = #confirmed;
    };

    // Mark vehicle as unavailable
    let vehicle = switch (vehicles.get(booking.vehicleId)) {
      case (null) { Runtime.trap("Vehicle does not exist") };
      case (?vehicle) { vehicle };
    };
    let updatedVehicle = { vehicle with available = false };
    vehicles.add(booking.vehicleId, updatedVehicle);

    bookings.add(bookingId, newBooking);
  };

  public shared ({ caller }) func completeBooking(bookingId : Nat) : async () {
    let booking = switch (bookings.get(bookingId)) {
      case (null) { Runtime.trap("Booking does not exist") };
      case (?booking) { booking };
    };

    let newBooking : Booking = {
      id = booking.id;
      vehicleId = booking.vehicleId;
      renter = booking.renter;
      startDate = booking.startDate;
      endDate = booking.endDate;
      totalPrice = booking.totalPrice;
      status = #completed;
    };

    // Mark vehicle as available again
    let vehicle = switch (vehicles.get(booking.vehicleId)) {
      case (null) { Runtime.trap("Vehicle does not exist") };
      case (?vehicle) { vehicle };
    };
    let updatedVehicle = { vehicle with available = true };
    vehicles.add(booking.vehicleId, updatedVehicle);

    bookings.add(bookingId, newBooking);
  };

  // Stripe integration
  var configuration : ?Stripe.StripeConfiguration = null;

  public query func isStripeConfigured() : async Bool {
    configuration != null;
  };

  public shared ({ caller }) func setStripeConfiguration(config : Stripe.StripeConfiguration) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };
    configuration := ?config;
  };

  func getStripeConfiguration() : Stripe.StripeConfiguration {
    switch (configuration) {
      case (null) { Runtime.trap("Stripe needs to be first configured") };
      case (?value) { value };
    };
  };

  public query func transform(input : OutCall.TransformationInput) : async OutCall.TransformationOutput {
    OutCall.transform(input);
  };

  public func getStripeSessionStatus(sessionId : Text) : async Stripe.StripeSessionStatus {
    await Stripe.getSessionStatus(getStripeConfiguration(), sessionId, transform);
  };

  public shared ({ caller }) func createCheckoutSession(items : [Stripe.ShoppingItem], successUrl : Text, cancelUrl : Text) : async Text {
    await Stripe.createCheckoutSession(getStripeConfiguration(), caller, items, successUrl, cancelUrl, transform);
  };
};
