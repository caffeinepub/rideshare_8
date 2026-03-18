# RideShare - Bike & Scooty Rental Marketplace

## Current State
New project, no existing code.

## Requested Changes (Diff)

### Add
- Vehicle listing system: owners can list their bikes/scooties with photos, description, price per day, location, vehicle type
- Browse/search page: filter by location, vehicle type, date availability
- Vehicle detail page: full info, photos, availability calendar, booking form
- Booking system: renters select start/end dates, calculate total cost, confirm booking
- Owner dashboard: manage listed vehicles, view incoming bookings, approve/reject
- Renter dashboard: view active and past bookings, booking status tracking
- User authentication: login/signup for both owners and renters
- Payment flow via Stripe for booking payments
- Image upload for vehicle photos via blob-storage
- Vehicle types: Bike, Scooty/Moped, Electric Scooter
- Booking statuses: Pending, Confirmed, Active, Completed, Cancelled

### Modify
- N/A (new project)

### Remove
- N/A (new project)

## Implementation Plan
1. Backend: Vehicle CRUD (create, list, get, update), Booking CRUD (create, get, update status), User role management (owner/renter), availability checking
2. Frontend: Landing page with hero + search, vehicle listings grid, vehicle detail page, booking flow, owner dashboard, renter dashboard, auth pages
3. Components: authorization (user roles), blob-storage (vehicle images), stripe (payments)
