import { Button } from "@/components/ui/button";
import { useQueryClient } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { Bike, Menu, X } from "lucide-react";
import { useState } from "react";
import { useInternetIdentity } from "../hooks/useInternetIdentity";

export default function Navbar() {
  const { login, clear, loginStatus, identity } = useInternetIdentity();
  const queryClient = useQueryClient();
  const [menuOpen, setMenuOpen] = useState(false);

  const isAuthenticated = !!identity;
  const isLoggingIn = loginStatus === "logging-in";

  const handleAuth = async () => {
    if (isAuthenticated) {
      await clear();
      queryClient.clear();
    } else {
      try {
        await login();
      } catch (error: any) {
        if (error.message === "User is already authenticated") {
          await clear();
          setTimeout(() => login(), 300);
        }
      }
    }
  };

  const navLinks = [
    { label: "Rent", to: "/browse" },
    { label: "List Your Vehicle", to: "/dashboard" },
    { label: "My Bookings", to: "/bookings" },
    { label: "How it Works", to: "/#how-it-works" },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-border shadow-xs">
      <nav className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link
          to="/"
          className="flex items-center gap-2 font-heading font-bold text-xl text-primary"
        >
          <Bike className="w-6 h-6 text-accent" />
          <span>RideShare</span>
        </Link>

        <div className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
              data-ocid={`nav.${link.label.toLowerCase().replace(/ /g, "_")}.link`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-2">
          {isAuthenticated ? (
            <>
              <span className="text-sm text-muted-foreground">
                {identity.getPrincipal().toString().slice(0, 8)}...
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={handleAuth}
                data-ocid="nav.logout.button"
              >
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={handleAuth}
                disabled={isLoggingIn}
                data-ocid="nav.login.button"
              >
                {isLoggingIn ? "Logging in..." : "Login"}
              </Button>
              <Button
                size="sm"
                onClick={handleAuth}
                disabled={isLoggingIn}
                className="bg-accent hover:bg-accent/90 text-accent-foreground"
                data-ocid="nav.signup.button"
              >
                Sign Up
              </Button>
            </>
          )}
        </div>

        <button
          type="button"
          className="md:hidden p-2 text-primary"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </nav>

      {menuOpen && (
        <div className="md:hidden bg-white border-t border-border px-4 py-4 flex flex-col gap-3">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="text-sm font-medium text-foreground hover:text-primary py-1"
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <div className="flex gap-2 pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                handleAuth();
                setMenuOpen(false);
              }}
              disabled={isLoggingIn}
              className="flex-1"
            >
              {isAuthenticated
                ? "Logout"
                : isLoggingIn
                  ? "Logging in..."
                  : "Login"}
            </Button>
            {!isAuthenticated && (
              <Button
                size="sm"
                onClick={() => {
                  handleAuth();
                  setMenuOpen(false);
                }}
                disabled={isLoggingIn}
                className="flex-1 bg-accent hover:bg-accent/90 text-accent-foreground"
              >
                Sign Up
              </Button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
