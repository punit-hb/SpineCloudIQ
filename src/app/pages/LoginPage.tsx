import { useState } from "react";
import { useNavigate } from "react-router";
import { Activity, AlertCircle } from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Checkbox } from "../components/ui/checkbox";
import { Alert, AlertDescription } from "../components/ui/alert";

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [errors, setErrors] = useState({ email: "", password: "", auth: "" });

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Reset errors
    setErrors({ email: "", password: "", auth: "" });
    
    // Validation
    let hasError = false;
    const newErrors = { email: "", password: "", auth: "" };
    
    if (!email) {
      newErrors.email = "Email is required";
      hasError = true;
    }
    
    if (!password) {
      newErrors.password = "Password is required";
      hasError = true;
    }
    
    if (hasError) {
      setErrors(newErrors);
      return;
    }
    
    // Check credentials
    if (email === "superadmin@spinecloudiq.com" && password === "Admin@123") {
      navigate("/dashboard");
    } else {
      setErrors({ ...newErrors, auth: "Invalid credentials. Please use the dummy credentials provided below." });
    }
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
          <h2 className="text-3xl font-semibold mb-4">Healthcare Management Platform</h2>
          <p className="text-blue-100 text-lg leading-relaxed">
            Streamline your healthcare operations with our comprehensive SaaS solution. 
            Manage subscriptions, monitor usage, and scale your practice effortlessly.
          </p>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-background">
        <div className="w-full max-w-md">
          {/* Logo for mobile */}
          <div className="flex lg:hidden items-center gap-2 mb-8 justify-center">
            <Activity className="w-8 h-8 text-primary" strokeWidth={2.5} />
            <h1 className="text-2xl font-semibold text-foreground">SpineCloudIQ</h1>
          </div>

          <div className="bg-card rounded-xl shadow-lg border border-border p-8">
            <div className="mb-8">
              <h2 className="text-2xl font-semibold text-foreground mb-2">Super Admin Login</h2>
              <p className="text-muted-foreground">Access your admin dashboard</p>
            </div>

            {/* Auth Error Alert */}
            {errors.auth && (
              <Alert variant="destructive" className="mb-6">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{errors.auth}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleLogin} className="space-y-6">
              {/* Email Field */}
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`${errors.email ? "border-destructive" : ""} bg-input-background border`}
                />
                {errors.email && (
                  <p className="text-sm text-destructive">{errors.email}</p>
                )}
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`${errors.password ? "border-destructive" : ""} bg-input-background border`}
                />
                {errors.password && (
                  <p className="text-sm text-destructive">{errors.password}</p>
                )}
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="remember"
                    checked={rememberMe}
                    onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                  />
                  <label
                    htmlFor="remember"
                    className="text-sm text-foreground cursor-pointer font-normal"
                  >
                    Remember me
                  </label>
                </div>
                <button
                  type="button"
                  onClick={() => navigate("/forgot-password")}
                  className="text-sm text-primary hover:text-primary/80 font-medium"
                >
                  Forgot Password?
                </button>
              </div>

              {/* Login Button */}
              <Button
                type="submit"
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                size="lg"
              >
                Login
              </Button>
            </form>

            {/* Dummy Credentials */}
            <div className="mt-8 pt-6 border-t border-border">
              <p className="text-xs text-muted-foreground mb-3 text-center">
                Use dummy credentials for prototype access
              </p>
              <div className="bg-secondary/50 rounded-lg p-4 space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Email:</span>
                  <span className="font-medium text-foreground">superadmin@spinecloudiq.com</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Password:</span>
                  <span className="font-medium text-foreground">Admin@123</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}