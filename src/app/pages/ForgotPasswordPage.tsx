import { useState } from "react";
import { useNavigate } from "react-router";
import { Activity, ArrowLeft, Mail } from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";

export default function ForgotPasswordPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSendOTP = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Prevent multiple submissions
    if (isSubmitting) {
      return;
    }
    
    setError("");
    setIsSubmitting(true);

    // Validation
    if (!email) {
      setError("Email is required");
      setIsSubmitting(false);
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address");
      setIsSubmitting(false);
      return;
    }

    // Trim and lowercase for comparison
    const normalizedEmail = email.trim().toLowerCase();
    
    // Check if email is the demo email
    if (normalizedEmail !== "superadmin@spinecloudiq.com") {
      setError("Email not found in our system. Please use: superadmin@spinecloudiq.com");
      setIsSubmitting(false);
      return;
    }

    // Store email in sessionStorage for the next page
    sessionStorage.setItem('forgotPasswordEmail', normalizedEmail);
    
    // In a real app, this would make an API call to send OTP
    console.log("Sending OTP to:", normalizedEmail);
    console.log("Demo OTP: 123456");
    
    // Navigate to verify and reset page
    navigate("/forgot-password/verify-reset", { 
      state: { email: normalizedEmail }
    });
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Gradient Background */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-[#1E5EFF] via-[#3B82F6] to-[#60A5FA] items-center justify-center p-12">
        <div className="max-w-md text-white">
          <div className="flex items-center gap-3 mb-8">
            <Activity className="w-12 h-12" strokeWidth={2.5} />
            <h1 className="text-4xl font-semibold">SpineCloudIQ</h1>
          </div>
          <h2 className="text-3xl font-semibold mb-4">Password Recovery</h2>
          <p className="text-blue-100 text-lg leading-relaxed">
            Enter your email address and we'll send you a one-time password (OTP) 
            to reset your password securely.
          </p>
        </div>
      </div>

      {/* Right Side - Forgot Password Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-background">
        <div className="w-full max-w-md">
          {/* Logo for mobile */}
          <div className="flex lg:hidden items-center gap-2 mb-8 justify-center">
            <Activity className="w-8 h-8 text-primary" strokeWidth={2.5} />
            <h1 className="text-2xl font-semibold text-foreground">SpineCloudIQ</h1>
          </div>

          <div className="bg-card rounded-xl shadow-lg border border-border p-8">
            {/* Back to Login */}
            <button
              onClick={() => navigate("/")}
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Login
            </button>

            <div className="mb-8">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <Mail className="w-6 h-6 text-primary" />
              </div>
              <h2 className="text-2xl font-semibold text-foreground mb-2">Forgot Password?</h2>
              <p className="text-muted-foreground">
                Enter your email address and we'll send you an OTP to reset your password.
              </p>
            </div>

            <form onSubmit={handleSendOTP} className="space-y-6">
              {/* Email Field */}
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`${error ? "border-destructive" : ""} bg-input-background border`}
                />
                {error && (
                  <p className="text-sm text-destructive">{error}</p>
                )}
              </div>

              {/* Send OTP Button */}
              <Button
                type="submit"
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                size="lg"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Sending OTP..." : "Send OTP"}
              </Button>
            </form>

            {/* Help Text */}
            <div className="mt-8 pt-6 border-t border-border">
              <p className="text-xs text-muted-foreground text-center">
                For demo purposes, use: <span className="font-medium text-foreground">superadmin@spinecloudiq.com</span>
                <br />
                OTP will be: <span className="font-medium text-foreground">123456</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}