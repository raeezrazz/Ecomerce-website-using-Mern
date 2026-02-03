import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
// import { useGoogleLogin } from '@react-oauth/google'; // Commented out - Google OAuth not configured
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { UserCircle, ArrowLeft, Mail } from 'lucide-react';
import { userLogin, userRegister, verifyOtp, resendOtp, googleLogin } from '@/api/userApi';
import { setCredentials } from '@/store/Slice/userSlice';

export default function Auth() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { toast } = useToast();
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [signupName, setSignupName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupPhone, setSignupPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [showOtpPage, setShowOtpPage] = useState(false);
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [timer, setTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);
  const otpInputRefs = useRef<(HTMLInputElement | null)[]>([]);
  
  // Error states for form validation
  const [loginErrors, setLoginErrors] = useState<{ email?: string; password?: string }>({});
  const [signupErrors, setSignupErrors] = useState<{ name?: string; email?: string; phone?: string; password?: string }>({});

  // Timer effect
  useEffect(() => {
    if (showOtpPage && timer > 0) {
      const interval = setInterval(() => {
        setTimer((prev) => {
          if (prev <= 1) {
            setCanResend(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [showOtpPage, timer]);

  // Auto-focus first OTP input
  useEffect(() => {
    if (showOtpPage && otpInputRefs.current[0]) {
      otpInputRefs.current[0]?.focus();
    }
  }, [showOtpPage]);

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return; // Only allow single digit
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      otpInputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpInputRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').slice(0, 6);
    const newOtp = [...otp];
    pastedData.split('').forEach((char, index) => {
      if (index < 6 && /^\d$/.test(char)) {
        newOtp[index] = char;
      }
    });
    setOtp(newOtp);
    const nextIndex = Math.min(pastedData.length, 5);
    otpInputRefs.current[nextIndex]?.focus();
  };

  const handleResendOtp = async () => {
    try {
      setLoading(true);
      await resendOtp(signupEmail);
      setTimer(30);
      setCanResend(false);
      setOtp(['', '', '', '', '', '']);
      toast({
        title: "OTP Resent",
        description: "A new OTP has been sent to your email.",
      });
      if (otpInputRefs.current[0]) {
        otpInputRefs.current[0].focus();
      }
    } catch (err: unknown) {
      const error = err as { response?: { data?: { error?: string } } };
      toast({
        title: "Error",
        description: error?.response?.data?.error || "Failed to resend OTP",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    const otpString = otp.join('');
    
    if (otpString.length !== 6) {
      toast({
        title: "Invalid OTP",
        description: "Please enter all 6 digits",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      const response = await verifyOtp(
        signupName,
        signupEmail,
        signupPhone,
        signupPassword,
        otpString
      );

      // Save tokens
      localStorage.setItem("userToken", response.accessToken);
      localStorage.setItem("refreshToken", response.refreshToken);
      localStorage.setItem("userData", JSON.stringify(response.data));
      localStorage.setItem("accessToken", response.accessToken); // For backward compatibility
      
      // Save userInfo to localStorage for Redux persistence
      const userInfo = {
        _id: response.data.id,
        name: response.data.name,
        email: response.data.email,
      };
      localStorage.setItem("userInfo", JSON.stringify(userInfo));
      
      // Dispatch to Redux store
      dispatch(setCredentials(userInfo));

      toast({
        title: "Account created",
        description: "Welcome to our store!",
      });

      navigate("/");
    } catch (err: unknown) {
      const error = err as { response?: { data?: { error?: string } } };
      toast({
        title: "Verification failed",
        description: error?.response?.data?.error || "Invalid OTP. Please try again.",
        variant: "destructive",
      });
      setOtp(['', '', '', '', '', '']);
      if (otpInputRefs.current[0]) {
        otpInputRefs.current[0].focus();
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLoginSuccess = async (tokenResponse: any) => {
    // Dummy implementation - Google OAuth not configured
    toast({
      title: "Google Login Not Available",
      description: "Google authentication is not configured yet. Please use email/password to login.",
      variant: "default",
    });
    setLoading(false);
    
    /* 
    // Uncomment when Google OAuth is configured
    try {
      setLoading(true);
      const response = await googleLogin(tokenResponse.access_token);

      // Save tokens
      localStorage.setItem("userToken", response.accessToken);
      localStorage.setItem("refreshToken", response.refreshToken);
      localStorage.setItem("userData", JSON.stringify(response.data));
      localStorage.setItem("accessToken", response.accessToken);
      
      // Save userInfo to localStorage for Redux persistence
      const userInfo = {
        _id: response.data.id,
        name: response.data.name,
        email: response.data.email,
      };
      localStorage.setItem("userInfo", JSON.stringify(userInfo));
      
      // Dispatch to Redux store
      dispatch(setCredentials(userInfo));

      toast({
        title: "Welcome!",
        description: `Hello ${response.data.name}`,
      });

      navigate("/");
    } catch (err: unknown) {
      const error = err as { response?: { data?: { error?: string } } };
      toast({
        title: "Google login failed",
        description: error?.response?.data?.error || "Failed to authenticate with Google",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
    */
  };

  const handleGoogleLoginError = () => {
    toast({
      title: "Google login cancelled",
      description: "You cancelled the Google login process",
      variant: "destructive",
    });
  };

  // Dummy Google login hook - will show message instead of actual login
  const googleLoginHook = () => {
    handleGoogleLoginSuccess({ access_token: 'dummy' });
  };

  // Uncomment when Google OAuth is configured:
  // const googleLoginHook = useGoogleLogin({
  //   onSuccess: (tokenResponse) => handleGoogleLoginSuccess(tokenResponse),
  //   onError: handleGoogleLoginError,
  //   flow: 'auth-code',
  // });

  const validateLogin = (): boolean => {
    const errors: { email?: string; password?: string } = {};
    
    // Email validation
    if (!loginEmail.trim()) {
      errors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(loginEmail)) {
      errors.email = "Please enter a valid email address";
    }
    
    // Password validation
    if (!loginPassword) {
      errors.password = "Password is required";
    } else if (loginPassword.length < 6) {
      errors.password = "Password must be at least 6 characters";
    }
    
    setLoginErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Clear previous errors
    setLoginErrors({});
  
    // Validate form
    if (!validateLogin()) {
      const firstError = Object.values(loginErrors)[0];
      if (firstError) {
        toast({
          title: "Validation Error",
          description: firstError,
          variant: "destructive",
        });
      }
      return;
    }
  
    setLoading(true);
  
    try {
      const response = await userLogin(loginEmail.trim().toLowerCase(), loginPassword);
  
      // Save tokens
      localStorage.setItem("userToken", response.accessToken);
      localStorage.setItem("refreshToken", response.refreshToken);
      localStorage.setItem("userData", JSON.stringify(response.data));
      localStorage.setItem("accessToken", response.accessToken);
      
      // Save userInfo to localStorage for Redux persistence
      const userInfo = {
        _id: response.data.id,
        name: response.data.name,
        email: response.data.email,
        role: response.data.role || 'user',
      };
      localStorage.setItem("userInfo", JSON.stringify(userInfo));
      
      // Dispatch to Redux store
      dispatch(setCredentials(userInfo));

      toast({
        title: "Welcome back!",
        description: `Hello ${response.data.name}`,
      });
  
      // Clear form
      setLoginEmail('');
      setLoginPassword('');
      setLoginErrors({});
      
      navigate("/");
    } catch (err: any) {
      const error = err as { response?: { data?: { error?: string; success?: boolean } } };
      const errorMessage = error?.response?.data?.error || "An unexpected error occurred. Please try again.";
      
      // Set field-specific errors
      if (errorMessage.toLowerCase().includes("email") || errorMessage.toLowerCase().includes("user not found")) {
        setLoginErrors({ email: errorMessage });
      } else if (errorMessage.toLowerCase().includes("password") || errorMessage.toLowerCase().includes("invalid")) {
        setLoginErrors({ password: errorMessage });
      } else if (errorMessage.toLowerCase().includes("verify")) {
        setLoginErrors({ email: errorMessage });
      }
      
      toast({
        title: "Login Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  
  const validateSignup = (): boolean => {
    const errors: { name?: string; email?: string; phone?: string; password?: string } = {};
    
    // Name validation
    if (!signupName.trim()) {
      errors.name = "Name is required";
    } else if (signupName.trim().length < 2) {
      errors.name = "Name must be at least 2 characters";
    } else if (!/^[a-zA-Z\s]+$/.test(signupName.trim())) {
      errors.name = "Name can only contain letters and spaces";
    }
    
    // Email validation
    if (!signupEmail.trim()) {
      errors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(signupEmail)) {
      errors.email = "Please enter a valid email address";
    }
    
    // Phone validation
    if (!signupPhone.trim()) {
      errors.phone = "Phone number is required";
    } else if (!/^\d{10}$/.test(signupPhone.trim())) {
      errors.phone = "Phone number must be exactly 10 digits";
    }
    
    // Password validation
    if (!signupPassword) {
      errors.password = "Password is required";
    } else if (signupPassword.length < 6) {
      errors.password = "Password must be at least 6 characters";
    } else if (signupPassword.length > 50) {
      errors.password = "Password must be less than 50 characters";
    }
    
    setSignupErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Clear previous errors
    setSignupErrors({});
  
    // Validate form
    if (!validateSignup()) {
      const firstError = Object.values(signupErrors)[0];
      if (firstError) {
        toast({
          title: "Validation Error",
          description: firstError,
          variant: "destructive",
        });
      }
      return;
    }
  
    setLoading(true);
  
    try {
      await userRegister(
        signupName.trim(),
        signupEmail.trim().toLowerCase(),
        signupPhone.trim(),
        signupPassword
      );
      
      toast({
        title: "OTP Sent",
        description: "Please check your email for the verification code.",
      });
      
      setShowOtpPage(true);
      setTimer(30);
      setCanResend(false);
    } catch (err: any) {
      const error = err as { response?: { data?: { error?: string; success?: boolean } } };
      const errorMessage = error?.response?.data?.error || "Registration failed. Please try again.";
      
      // Set field-specific errors
      if (errorMessage.toLowerCase().includes("email") && errorMessage.toLowerCase().includes("already")) {
        setSignupErrors({ email: "This email is already registered. Please use a different email or try logging in." });
      } else if (errorMessage.toLowerCase().includes("email")) {
        setSignupErrors({ email: errorMessage });
      } else if (errorMessage.toLowerCase().includes("phone")) {
        setSignupErrors({ phone: errorMessage });
      } else if (errorMessage.toLowerCase().includes("password")) {
        setSignupErrors({ password: errorMessage });
      }
      
      toast({
        title: "Registration Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (showOtpPage) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 via-background to-primary/5 px-3 sm:px-4 py-4 sm:py-8 w-full">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1 text-center p-4 sm:p-6">
            <div className="flex justify-center mb-3 sm:mb-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Mail className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
              </div>
            </div>
            <CardTitle className="text-xl sm:text-2xl font-bold">Verify Your Email</CardTitle>
            <CardDescription className="text-sm sm:text-base">
              We've sent a 6-digit code to <strong className="break-all">{signupEmail}</strong>
            </CardDescription>
          </CardHeader>
          <CardContent className="p-4 sm:p-6 pt-0">
            <form onSubmit={handleVerifyOtp} className="space-y-4 sm:space-y-6">
              <div className="space-y-2">
                <Label className="text-center block text-sm sm:text-base">Enter Verification Code</Label>
                <div className="flex justify-center gap-2 sm:gap-2">
                  {otp.map((digit, index) => (
                    <Input
                      key={index}
                      ref={(el) => (otpInputRefs.current[index] = el)}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(index, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(index, e)}
                      onPaste={handleOtpPaste}
                      className="w-10 h-10 sm:w-12 sm:h-12 text-center text-base sm:text-lg font-semibold"
                      required
                    />
                  ))}
                </div>
              </div>

              <div className="space-y-3 sm:space-y-4">
                <Button type="submit" className="w-full text-sm sm:text-base" disabled={loading}>
                  {loading ? 'Verifying...' : 'Verify OTP'}
                </Button>

                <div className="text-center space-y-2">
                  {timer > 0 ? (
                    <p className="text-xs sm:text-sm text-muted-foreground">
                      Resend OTP in <span className="font-semibold text-primary">{timer}s</span>
                    </p>
                  ) : (
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full text-sm sm:text-base"
                      onClick={handleResendOtp}
                      disabled={loading || !canResend}
                    >
                      Resend OTP
                    </Button>
                  )}
                </div>

                <Button
                  type="button"
                  variant="ghost"
                  className="w-full text-sm sm:text-base"
                  onClick={() => {
                    setShowOtpPage(false);
                    setOtp(['', '', '', '', '', '']);
                    setTimer(30);
                    setCanResend(false);
                  }}
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Sign Up
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 via-background to-primary/5 px-3 sm:px-4 py-4 sm:py-8 w-full">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center p-4 sm:p-6">
          <div className="flex justify-center mb-3 sm:mb-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-primary/10 flex items-center justify-center">
              <UserCircle className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
            </div>
          </div>
          <CardTitle className="text-xl sm:text-2xl font-bold">Welcome</CardTitle>
          <CardDescription className="text-sm sm:text-base">Sign in to your account or create a new one</CardDescription>
        </CardHeader>
        <CardContent className="p-4 sm:p-6 pt-0">
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2 h-9 sm:h-10">
              <TabsTrigger value="login" className="text-xs sm:text-sm">Login</TabsTrigger>
              <TabsTrigger value="signup" className="text-xs sm:text-sm">Sign Up</TabsTrigger>
            </TabsList>
            
            <TabsContent value="login">
              <form onSubmit={handleLogin} className="space-y-3 sm:space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="login-email" className="text-sm sm:text-base">Email</Label>
                  <Input
                    id="login-email"
                    type="email"
                    placeholder="your@email.com"
                    value={loginEmail}
                    onChange={(e) => {
                      setLoginEmail(e.target.value);
                      if (loginErrors.email) {
                        setLoginErrors({ ...loginErrors, email: undefined });
                      }
                    }}
                    className={`text-sm sm:text-base ${loginErrors.email ? "border-red-500" : ""}`}
                    required
                  />
                  {loginErrors.email && (
                    <p className="text-xs sm:text-sm text-red-500 mt-1">{loginErrors.email}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="login-password" className="text-sm sm:text-base">Password</Label>
                  <Input
                    id="login-password"
                    type="password"
                    placeholder="••••••••"
                    value={loginPassword}
                    onChange={(e) => {
                      setLoginPassword(e.target.value);
                      if (loginErrors.password) {
                        setLoginErrors({ ...loginErrors, password: undefined });
                      }
                    }}
                    className={`text-sm sm:text-base ${loginErrors.password ? "border-red-500" : ""}`}
                    required
                  />
                  {loginErrors.password && (
                    <p className="text-xs sm:text-sm text-red-500 mt-1">{loginErrors.password}</p>
                  )}
                </div>
                <Button type="submit" className="w-full text-sm sm:text-base" disabled={loading}>
                  {loading ? 'Signing in...' : 'Sign In'}
                </Button>
                
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <Separator />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
                  </div>
                </div>

                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={() => googleLoginHook()}
                  disabled={loading}
                >
                  <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                    <path
                      fill="currentColor"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="currentColor"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  Continue with Google
                </Button>
              </form>
            </TabsContent>
            
            <TabsContent value="signup">
              <form onSubmit={handleSignup} className="space-y-3 sm:space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signup-name" className="text-sm sm:text-base">Full Name</Label>
                  <Input
                    id="signup-name"
                    type="text"
                    placeholder="John Doe"
                    value={signupName}
                    onChange={(e) => {
                      setSignupName(e.target.value);
                      if (signupErrors.name) {
                        setSignupErrors({ ...signupErrors, name: undefined });
                      }
                    }}
                    className={`text-sm sm:text-base ${signupErrors.name ? "border-red-500" : ""}`}
                    required
                  />
                  {signupErrors.name && (
                    <p className="text-xs sm:text-sm text-red-500 mt-1">{signupErrors.name}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-email" className="text-sm sm:text-base">Email</Label>
                  <Input
                    id="signup-email"
                    type="email"
                    placeholder="your@email.com"
                    value={signupEmail}
                    onChange={(e) => {
                      setSignupEmail(e.target.value);
                      if (signupErrors.email) {
                        setSignupErrors({ ...signupErrors, email: undefined });
                      }
                    }}
                    className={`text-sm sm:text-base ${signupErrors.email ? "border-red-500" : ""}`}
                    required
                  />
                  {signupErrors.email && (
                    <p className="text-xs sm:text-sm text-red-500 mt-1">{signupErrors.email}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-phone" className="text-sm sm:text-base">Phone Number</Label>
                  <Input
                    id="signup-phone"
                    type="tel"
                    placeholder="1234567890"
                    maxLength={10}
                    value={signupPhone}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, ''); // Only allow digits
                      setSignupPhone(value);
                      if (signupErrors.phone) {
                        setSignupErrors({ ...signupErrors, phone: undefined });
                      }
                    }}
                    className={`text-sm sm:text-base ${signupErrors.phone ? "border-red-500" : ""}`}
                    required
                  />
                  {signupErrors.phone && (
                    <p className="text-xs sm:text-sm text-red-500 mt-1">{signupErrors.phone}</p>
                  )}
                  <p className="text-xs text-muted-foreground">Enter 10-digit phone number</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-password" className="text-sm sm:text-base">Password</Label>
                  <Input
                    id="signup-password"
                    type="password"
                    placeholder="••••••••"
                    value={signupPassword}
                    onChange={(e) => {
                      setSignupPassword(e.target.value);
                      if (signupErrors.password) {
                        setSignupErrors({ ...signupErrors, password: undefined });
                      }
                    }}
                    className={`text-sm sm:text-base ${signupErrors.password ? "border-red-500" : ""}`}
                    required
                  />
                  {signupErrors.password && (
                    <p className="text-xs sm:text-sm text-red-500 mt-1">{signupErrors.password}</p>
                  )}
                  <p className="text-xs text-muted-foreground">Must be at least 6 characters</p>
                </div>
                <Button type="submit" className="w-full text-sm sm:text-base" disabled={loading}>
                  {loading ? 'Creating account...' : 'Create Account'}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
