import { useState, useRef } from "react";
import { Camera, Mail, Phone, MapPin, Building2, Save, Lock, X, Check, ArrowLeft } from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";

// Profile page with visible borders - v2
interface ProfileData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: string;
  city: string;
  state: string;
  bio: string;
  avatarUrl: string;
}

type PasswordStep = "idle" | "verify-email" | "otp-verification" | "new-password" | "success";

const US_STATES = [
  "Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", "Connecticut",
  "Delaware", "Florida", "Georgia", "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa",
  "Kansas", "Kentucky", "Louisiana", "Maine", "Maryland", "Massachusetts", "Michigan",
  "Minnesota", "Mississippi", "Missouri", "Montana", "Nebraska", "Nevada", "New Hampshire",
  "New Jersey", "New Mexico", "New York", "North Carolina", "North Dakota", "Ohio",
  "Oklahoma", "Oregon", "Pennsylvania", "Rhode Island", "South Carolina", "South Dakota",
  "Tennessee", "Texas", "Utah", "Vermont", "Virginia", "Washington", "West Virginia",
  "Wisconsin", "Wyoming"
];

const US_CITIES = [
  "New York", "Los Angeles", "Chicago", "Houston", "Phoenix", "Philadelphia",
  "San Antonio", "San Diego", "Dallas", "San Jose", "Austin", "Jacksonville",
  "Fort Worth", "Columbus", "Charlotte", "San Francisco", "Indianapolis", "Seattle",
  "Denver", "Washington", "Boston", "El Paso", "Nashville", "Detroit", "Oklahoma City",
  "Portland", "Las Vegas", "Memphis", "Louisville", "Baltimore", "Milwaukee",
  "Albuquerque", "Tucson", "Fresno", "Mesa", "Sacramento", "Atlanta", "Kansas City",
  "Colorado Springs", "Omaha", "Raleigh", "Miami", "Long Beach", "Virginia Beach",
  "Oakland", "Minneapolis", "Tulsa", "Tampa", "Arlington", "New Orleans"
];

export default function ProfilePage() {
  const [profileData, setProfileData] = useState<ProfileData>({
    firstName: "John",
    lastName: "Admin",
    email: "admin@spinecloudiq.com",
    phone: "+1 (555) 123-4567",
    role: "Super Admin",
    city: "San Francisco",
    state: "California",
    bio: "Platform administrator with full system access and management capabilities.",
    avatarUrl: "",
  });

  const [tempProfile, setTempProfile] = useState<ProfileData>(profileData);
  const [isPasswordDrawerOpen, setIsPasswordDrawerOpen] = useState(false);
  const [passwordStep, setPasswordStep] = useState<PasswordStep>("idle");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [otpError, setOtpError] = useState("");
  const [countdown, setCountdown] = useState(0);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const otpInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleAvatarClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setTempProfile({ ...tempProfile, avatarUrl: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEdit = () => {
    setTempProfile(profileData);
  };

  const handleCancel = () => {
    setTempProfile(profileData);
  };

  const handleSave = () => {
    setProfileData(tempProfile);
    alert("Profile updated successfully!");
  };

  const handleChangePassword = () => {
    setIsPasswordDrawerOpen(true);
    setPasswordStep("verify-email");
  };

  const handleSendOTP = () => {
    // Simulate sending OTP
    setPasswordStep("otp-verification");
    setCountdown(60);
    alert(`OTP has been sent to ${profileData.email}`);
    
    // Countdown timer
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) {
      value = value[0];
    }

    if (!/^\d*$/.test(value)) {
      return;
    }

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    setOtpError("");

    // Auto-focus next input
    if (value && index < 5) {
      otpInputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpInputRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").slice(0, 6);
    if (!/^\d+$/.test(pastedData)) return;

    const newOtp = [...otp];
    for (let i = 0; i < pastedData.length && i < 6; i++) {
      newOtp[i] = pastedData[i];
    }
    setOtp(newOtp);
    setOtpError("");

    // Focus last filled input
    const lastIndex = Math.min(pastedData.length, 5);
    otpInputRefs.current[lastIndex]?.focus();
  };

  const handleVerifyOTP = () => {
    const otpValue = otp.join("");
    if (otpValue.length !== 6) {
      setOtpError("Please enter the complete 6-digit OTP");
      return;
    }

    // Simulate OTP verification (in real app, verify with backend)
    if (otpValue === "123456") {
      setPasswordStep("new-password");
      setOtpError("");
    } else {
      setOtpError("Invalid OTP. Please try again.");
    }
  };

  const handleResendOTP = () => {
    if (countdown > 0) return;
    
    setOtp(["", "", "", "", "", ""]);
    setOtpError("");
    setCountdown(60);
    alert(`New OTP has been sent to ${profileData.email}`);
    
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleUpdatePassword = () => {
    if (!currentPassword) {
      alert("Please enter your current password");
      return;
    }

    if (!newPassword || newPassword.length < 8) {
      alert("New password must be at least 8 characters long");
      return;
    }

    if (newPassword !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    // Simulate password update
    setPasswordStep("success");
    setTimeout(() => {
      setIsPasswordDrawerOpen(false);
      setPasswordStep("idle");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setOtp(["", "", "", "", "", ""]);
      setCountdown(0);
    }, 2000);
  };

  const closePasswordDrawer = () => {
    setIsPasswordDrawerOpen(false);
    setPasswordStep("idle");
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setOtp(["", "", "", "", "", ""]);
    setOtpError("");
    setCountdown(0);
  };

  return (
    <div className="h-full flex flex-col">
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-foreground mb-1">My Profile</h1>
        <p className="text-sm text-muted-foreground">
          Manage your personal information and security settings
        </p>
      </div>

      {/* Profile Content */}
      <div className="flex-1 overflow-auto">
        <div className="max-w-4xl">
          {/* Profile Card */}
          <div className="bg-card border border-border rounded-lg p-6 mb-6">
            {/* Profile Header */}
            <div className="flex items-start justify-between mb-6 pb-6 border-b border-border">
              <div className="flex items-center gap-6">
                <div className="relative group">
                  <Avatar className="w-24 h-24">
                    <AvatarImage src={tempProfile.avatarUrl} />
                    <AvatarFallback className="text-2xl bg-primary/10 text-primary">
                      {profileData.firstName[0]}{profileData.lastName[0]}
                    </AvatarFallback>
                  </Avatar>
                  <button
                    onClick={handleAvatarClick}
                    className="absolute inset-0 bg-black/60 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                  >
                    <Camera className="w-6 h-6 text-white" />
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </div>
                <div>
                  <h2 className="text-2xl font-semibold text-foreground mb-1">
                    {profileData.firstName} {profileData.lastName}
                  </h2>
                  <p className="text-sm text-muted-foreground mb-2">{profileData.email}</p>
                  <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-primary/10 text-primary border border-primary/20">
                    {profileData.role}
                  </span>
                </div>
              </div>

            </div>

            {/* Profile Fields */}
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="firstName" className="text-sm font-medium">
                  First Name *
                </Label>
                <Input
                  id="firstName"
                  value={tempProfile.firstName}
                  onChange={(e) => setTempProfile({ ...tempProfile, firstName: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="lastName" className="text-sm font-medium">
                  Last Name *
                </Label>
                <Input
                  id="lastName"
                  value={tempProfile.lastName}
                  onChange={(e) => setTempProfile({ ...tempProfile, lastName: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">
                  Email Address
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    value={profileData.email}
                    disabled
                    className="pl-10 bg-muted/30 cursor-not-allowed"
                  />
                </div>
                <p className="text-xs text-muted-foreground">Email address cannot be changed</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone" className="text-sm font-medium">
                  Phone Number *
                </Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="phone"
                    value={tempProfile.phone}
                    onChange={(e) => setTempProfile({ ...tempProfile, phone: e.target.value })}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="city" className="text-sm font-medium">
                  City *
                </Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground z-10 pointer-events-none" />
                  <select
                    id="city"
                    value={tempProfile.city}
                    onChange={(e) => setTempProfile({ ...tempProfile, city: e.target.value })}
                    style={{ borderColor: '#D1D5DB' }}
                    className={`w-full h-9 pl-10 pr-8 rounded-md border-2 bg-background text-sm focus:border-primary focus:outline-none focus:ring-[3px] focus:ring-primary/10 transition-[color,box-shadow,border-color] hover:border-[#9CA3AF] cursor-pointer`}
                  >
                    <option value="">Select a city</option>
                    {US_CITIES.map((city) => (
                      <option key={city} value={city}>
                        {city}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="state" className="text-sm font-medium">
                  State *
                </Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground z-10 pointer-events-none" />
                  <select
                    id="state"
                    value={tempProfile.state}
                    onChange={(e) => setTempProfile({ ...tempProfile, state: e.target.value })}
                    style={{ borderColor: '#D1D5DB' }}
                    className={`w-full h-9 pl-10 pr-8 rounded-md border-2 bg-background text-sm focus:border-primary focus:outline-none focus:ring-[3px] focus:ring-primary/10 transition-[color,box-shadow,border-color] hover:border-[#9CA3AF] cursor-pointer`}
                  >
                    <option value="">Select a state</option>
                    {US_STATES.map((state) => (
                      <option key={state} value={state}>
                        {state}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="col-span-2 space-y-2">
                <Label htmlFor="bio" className="text-sm font-medium">
                  Bio
                </Label>
                <textarea
                  id="bio"
                  value={tempProfile.bio}
                  onChange={(e) => setTempProfile({ ...tempProfile, bio: e.target.value })}
                  rows={3}
                  style={{ borderColor: '#D1D5DB' }}
                  className={`w-full px-3 py-2 rounded-md border-2 bg-background text-sm resize-none focus:border-primary focus:outline-none focus:ring-[3px] focus:ring-primary/10 transition-[color,box-shadow,border-color] hover:border-[#9CA3AF]`}
                  placeholder="Tell us about yourself..."
                />
              </div>
              <div className="col-span-2 flex items-center justify-end gap-3 mt-4 pt-6 border-t border-border">
                <Button variant="outline" onClick={handleCancel}>
                  Cancel
                </Button>
                <Button onClick={handleSave} className="gap-2">
                  <Save className="w-4 h-4" />
                  Save Changes
                </Button>
              </div>
            </div>
          </div>

          {/* Security Information */}
          <div className="bg-card border border-border rounded-lg p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">Security Information</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between py-3">
                <div>
                  <p className="text-sm font-medium text-foreground">Password</p>
                  <p className="text-xs text-muted-foreground">Last changed 30 days ago</p>
                </div>
                <Button onClick={handleChangePassword} variant="outline" size="sm" className="gap-2">
                  <Lock className="w-3.5 h-3.5" />
                  Change Password
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Password Change Drawer */}
      {isPasswordDrawerOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/50 z-40 animate-in fade-in duration-200"
            onClick={passwordStep === "success" ? undefined : closePasswordDrawer}
          />

          {/* Drawer Panel */}
          <div className="fixed right-0 top-0 h-full w-[500px] bg-background border-l border-border z-50 shadow-2xl animate-in slide-in-from-right duration-300 flex flex-col">
            {/* Drawer Header */}
            <div className="flex items-center justify-between p-6 border-b border-border">
              <div>
                <h2 className="text-xl font-semibold text-foreground">Change Password</h2>
                <p className="text-sm text-muted-foreground mt-1">
                  {passwordStep === "verify-email" && "Verify your email to continue"}
                  {passwordStep === "otp-verification" && "Enter the OTP sent to your email"}
                  {passwordStep === "new-password" && "Create your new password"}
                  {passwordStep === "success" && "Password updated successfully"}
                </p>
              </div>
              {passwordStep !== "success" && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={closePasswordDrawer}
                  className="h-8 w-8 p-0"
                >
                  <X className="w-5 h-5" />
                </Button>
              )}
            </div>

            {/* Drawer Content */}
            <div className="flex-1 overflow-y-auto p-6">
              {/* Step 1: Verify Email */}
              {passwordStep === "verify-email" && (
                <div className="space-y-6">
                  <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <Mail className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                      <div>
                        <h4 className="text-sm font-medium text-foreground mb-1">
                          Email Verification Required
                        </h4>
                        <p className="text-xs text-muted-foreground">
                          For security purposes, we need to verify your email address before you can
                          change your password. We'll send a 6-digit OTP to:
                        </p>
                        <p className="text-sm font-medium text-foreground mt-2">{profileData.email}</p>
                      </div>
                    </div>
                  </div>

                  <Button onClick={handleSendOTP} className="w-full gap-2">
                    <Mail className="w-4 h-4" />
                    Send OTP to Email
                  </Button>
                </div>
              )}

              {/* Step 2: OTP Verification */}
              {passwordStep === "otp-verification" && (
                <div className="space-y-6">
                  <div className="text-center">
                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                      <Mail className="w-8 h-8 text-primary" />
                    </div>
                    <p className="text-sm text-muted-foreground">
                      We've sent a 6-digit code to
                    </p>
                    <p className="text-sm font-medium text-foreground">{profileData.email}</p>
                  </div>

                  <div>
                    <Label className="text-sm font-medium mb-3 block text-center">
                      Enter OTP Code
                    </Label>
                    <div className="bg-card rounded-lg p-6" style={{ border: '2px solid #D1D5DB' }}>
                      <div className="flex items-center justify-center gap-3">
                        {otp.map((digit, index) => (
                          <input
                            key={index}
                            ref={(el) => { otpInputRefs.current[index] = el; }}
                            type="text"
                            inputMode="numeric"
                            maxLength={1}
                            value={digit}
                            onChange={(e) => handleOtpChange(index, e.target.value)}
                            onKeyDown={(e) => handleOtpKeyDown(index, e)}
                            onPaste={index === 0 ? handleOtpPaste : undefined}
                            style={{ borderColor: '#D1D5DB' }}
                            className="w-12 h-12 text-center text-lg font-semibold rounded-lg border-2 bg-background focus:border-primary focus:outline-none transition-colors hover:border-[#9CA3AF]"
                          />
                        ))}
                      </div>
                    </div>
                    {otpError && (
                      <p className="text-xs text-destructive text-center mt-2">{otpError}</p>
                    )}
                  </div>

                  <div className="text-center">
                    {countdown > 0 ? (
                      <p className="text-sm text-muted-foreground">
                        Resend code in <span className="font-medium text-foreground">{countdown}s</span>
                      </p>
                    ) : (
                      <button
                        onClick={handleResendOTP}
                        className="text-sm text-primary hover:underline font-medium"
                      >
                        Resend OTP
                      </button>
                    )}
                  </div>

                  <Button onClick={handleVerifyOTP} className="w-full">
                    Verify OTP
                  </Button>

                  <button
                    onClick={() => setPasswordStep("verify-email")}
                    className="w-full text-sm text-muted-foreground hover:text-foreground flex items-center justify-center gap-2"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Back to previous step
                  </button>
                </div>
              )}

              {/* Step 3: New Password */}
              {passwordStep === "new-password" && (
                <div className="space-y-5">
                  <div className="space-y-2">
                    <Label htmlFor="currentPassword" className="text-sm font-medium">
                      Current Password *
                    </Label>
                    <Input
                      id="currentPassword"
                      type="password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      placeholder="Enter your current password"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="newPassword" className="text-sm font-medium">
                      New Password *
                    </Label>
                    <Input
                      id="newPassword"
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Enter your new password"
                    />
                    <p className="text-xs text-muted-foreground">
                      Password must be at least 8 characters long
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword" className="text-sm font-medium">
                      Confirm New Password *
                    </Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Re-enter your new password"
                    />
                  </div>

                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                    <p className="text-xs text-amber-800">
                      <strong>Security Tips:</strong>
                    </p>
                    <ul className="text-xs text-amber-700 mt-2 space-y-1 list-disc list-inside">
                      <li>Use a mix of letters, numbers, and symbols</li>
                      <li>Avoid common words or personal information</li>
                      <li>Don't reuse passwords from other accounts</li>
                    </ul>
                  </div>

                  <Button onClick={handleUpdatePassword} className="w-full gap-2">
                    <Lock className="w-4 h-4" />
                    Update Password
                  </Button>
                </div>
              )}

              {/* Step 4: Success */}
              {passwordStep === "success" && (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="w-16 h-16 rounded-full bg-emerald-50 flex items-center justify-center mb-4">
                    <Check className="w-8 h-8 text-emerald-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    Password Updated Successfully!
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Your password has been changed. You can now use your new password to log in.
                  </p>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}