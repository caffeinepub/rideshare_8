import { Link } from "@tanstack/react-router";
import { Bike, Mail, MapPin, Phone } from "lucide-react";

export default function Footer() {
  const year = new Date().getFullYear();
  const hostname =
    typeof window !== "undefined" ? window.location.hostname : "";
  const caffeineUrl = `https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(hostname)}`;

  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Bike className="w-6 h-6 text-accent" />
              <span className="font-heading font-bold text-xl">RideShare</span>
            </div>
            <p className="text-sm text-primary-foreground/70">
              India's trusted two-wheeler rental marketplace. Ride anywhere,
              anytime.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-heading font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm text-primary-foreground/70">
              <li>
                <Link
                  to="/browse"
                  className="hover:text-accent transition-colors"
                >
                  Browse Vehicles
                </Link>
              </li>
              <li>
                <Link
                  to="/dashboard"
                  className="hover:text-accent transition-colors"
                >
                  List Your Vehicle
                </Link>
              </li>
              <li>
                <Link
                  to="/bookings"
                  className="hover:text-accent transition-colors"
                >
                  My Bookings
                </Link>
              </li>
            </ul>
          </div>

          {/* Vehicle Types */}
          <div>
            <h4 className="font-heading font-semibold mb-4">Vehicle Types</h4>
            <ul className="space-y-2 text-sm text-primary-foreground/70">
              <li>Motorcycles & Bikes</li>
              <li>Scooters & Scooty</li>
              <li>Electric Vehicles</li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-heading font-semibold mb-4">Contact</h4>
            <ul className="space-y-2 text-sm text-primary-foreground/70">
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4" /> support@rideshare.in
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4" /> +91 98765 43210
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="w-4 h-4" /> Bangalore, India
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-primary-foreground/20 mt-8 pt-6 flex flex-col md:flex-row justify-between items-center gap-2 text-sm text-primary-foreground/60">
          <p>
            © {year}. Built with ❤️ using{" "}
            <a
              href={caffeineUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-accent transition-colors"
            >
              caffeine.ai
            </a>
          </p>
          <p>© {year} RideShare. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
