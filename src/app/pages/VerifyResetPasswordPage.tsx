import { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router";
import { Activity, ArrowLeft, ShieldCheck, Eye, EyeOff } from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";

export default function VerifyResetPasswordPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const emailFromState = location.state?.email || "";
  const emailFromStorage = sessionStorage.getItem('forgotPasswordEmail') || "";
  const email = emailFromState || emailFromStorage;
  
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [otpError, setOtpError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    // If no email, redirect back to forgot password
    if (!email) {
      navigate("/forgot-password");
    }
  }, [email, navigate]);

  useEffect(() => {
    // Focus first input on mount
    inputRefs.current[0]?.focus();
  }, []);

  const handleChange = (index: number, value: string) => {
    // Only allow numbers
    if (value && !/^\d$/.test(value)) {
      return;
    }

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    setOtpError("");
    setError("");

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").slice(0, 6);
    
    if (!/^\d+$/.test(pastedData)) {
      return;
    }

    const newOtp = [...otp];
    for (let i = 0; i < pastedData.length && i < 6; i++) {
      newOtp[i] = pastedData[i];
    }
    setOtp(newOtp);
    
    // Focus last filled input or first empty
    const nextIndex = Math.min(pastedData.length, 5);
    inputRefs.current[nextIndex]?.focus();
  };

  const validatePassword = (password: string) => {
    const requirements = [];
    if (password.length < 8) requirements.push("at least 8 characters");
    if (!/[A-Z]/.test(password)) requirements.push("one uppercase letter");
    if (!/[a-z]/.test(password)) requirements.push("one lowercase letter");
    if (!/\d/.test(password)) requirements.push("one number");
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) requirements.push("one special character");
    
    return requirements;
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setOtpError("");
    setPasswordError("");

    const otpValue = otp.join("");

    // Validate OTP
    if (otpValue.length !== 6) {
      setOtpError("Please enter all 6 digits");
      return;
    }

    if (otpValue !== "123456") {
      setOtpError("Invalid OTP. Please use: 123456");
      return;
    }

    // Validate passwords
    if (!newPassword) {
      setPasswordError("New password is required");
      return;
    }

    const missingRequirements = validatePassword(newPassword);
    if (missingRequirements.length > 0) {
      setPasswordError(`Password must contain: ${missingRequirements.join(", ")}`);
      return;
    }

    if (!confirmPassword) {
      setPasswordError("Please confirm your password");
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError("Passwords do not match");
      return;
    }

    // In a real app, this would make an API call to reset the password
    console.log("Password reset successful for:", email);
    console.log("OTP:", otpValue);
    
    // Navigate to login page
    navigate("/", { replace: true });
  };

  const handleResendOTP = () => {
    setOtp(["", "", "", "", "", ""]);
    setOtpError("");
    setError("");
    inputRefs.current[0]?.focus();
    // In a real app, this would make an API call to resend OTP
    console.log("Resending OTP to:", email);
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
          <h2 className="text-3xl font-semibold mb-4">Reset Your Password</h2>
          <p className="text-blue-100 text-lg leading-relaxed">
            Enter the 6-digit verification code sent to your email and create a new secure password for your account.
          </p>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-background">
        <div className="w-full max-w-md">
          {/* Logo for mobile */}
          <div className="flex lg:hidden items-center gap-2 mb-8 justify-center">
            <Activity className="w-8 h-8 text-primary" strokeWidth={2.5} />
            <h1 className="text-2xl font-semibold text-foreground">SpineCloudIQ</h1>
          </div>

          <div className="bg-card rounded-xl shadow-lg border border-border p-8">
            {/* Back Button */}
            <button
              onClick={() => navigate("/forgot-password")}
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>

            <div className="mb-8">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <ShieldCheck className="w-6 h-6 text-primary" />
              </div>
              <h2 className="text-2xl font-semibold text-foreground mb-2">Reset Password</h2>
              <p className="text-muted-foreground">
                Enter the OTP sent to
              </p>
              <p className="text-sm font-medium text-foreground mt-1">{email}</p>
            </div>

            <form onSubmit={handleChangePassword} className="space-y-6">
              {/* OTP Input */}
              <div className="space-y-2">
                <Label>Enter OTP</Label>
                <div className="flex gap-2 justify-between">
                  {otp.map((digit, index) => (
                    <Input
                      key={index}
                      ref={(el) => (inputRefs.current[index] = el)}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleChange(index, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(index, e)}
                      onPaste={index === 0 ? handlePaste : undefined}
                      className={`w-full h-14 text-center text-2xl font-semibold ${
                        otpError ? "border-destructive" : ""
                      } bg-input-background border`}
                    />
                  ))}
                </div>
                {otpError && (
                  <p className="text-sm text-destructive">{otpError}</p>
                )}
                {/* Resend OTP */}
                <div className="text-right">
                  <button
                    type="button"
                    onClick={handleResendOTP}
                    className="text-sm text-primary hover:text-primary/80 font-medium"
                  >
                    Resend OTP
                  </button>
                </div>
              </div>

              {/* New Password Field */}
              <div className="space-y-2">
                <Label htmlFor="newPassword">New Password</Label>
                <div className="relative">
                  <Input
                    id="newPassword"
                    type={showNewPassword ? "text" : "password"}
                    placeholder="Enter new password"
                    value={newPassword}
                    onChange={(e) => {
                      setNewPassword(e.target.value);
                      setPasswordError("");
                      setError("");
                    }}
                    className={`${passwordError ? "border-destructive" : ""} bg-input-background border pr-10`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showNewPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Confirm Password Field */}
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Re-enter new password"
                    value={confirmPassword}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value);
                      setPasswordError("");
                      setError("");
                    }}
                    className={`${passwordError ? "border-destructive" : ""} bg-input-background border pr-10`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
                {passwordError && (
                  <p className="text-sm text-destructive">{passwordError}</p>
                )}
              </div>

              {/* Password Requirements */}
              <div className="bg-muted/50 rounded-lg p-4">
                <p className="text-xs font-medium text-muted-foreground mb-2">
                  Password must contain:
                </p>
                <ul className="text-xs text-muted-foreground space-y-1">
                  <li className={newPassword.length >= 8 ? "text-emerald-600" : ""}>
                    • At least 8 characters
                  </li>
                  <li className={/[A-Z]/.test(newPassword) ? "text-emerald-600" : ""}>
                    • One uppercase letter
                  </li>
                  <li className={/[a-z]/.test(newPassword) ? "text-emerald-600" : ""}>
                    • One lowercase letter
                  </li>
                  <li className={/\d/.test(newPassword) ? "text-emerald-600" : ""}>
                    • One number
                  </li>
                  <li className={/[!@#$%^&*(),.?":{}|<>]/.test(newPassword) ? "text-emerald-600" : ""}>
                    • One special character
                  </li>
                </ul>
              </div>

              {/* Change Password Button */}
              <Button
                type="submit"
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                size="lg"
              >
                Change Password
              </Button>
            </form>

            {/* Help Text */}
            <div className="mt-8 pt-6 border-t border-border">
              <p className="text-xs text-muted-foreground text-center">
                For demo purposes, use OTP: <span className="font-medium text-foreground">123456</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
