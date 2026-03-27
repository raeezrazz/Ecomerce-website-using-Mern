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
  type ApiError = { response?: { data?: { error?: string; success?: boolean } } };
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

  const handleGoogleLoginSuccess = async (_tokenResponse: { access_token: string }) => {
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
    const isValid = validateLogin();
    if (!isValid) {
      const nextErrors: { email?: string; password?: string } = {};
      if (!loginEmail.trim()) nextErrors.email = "Email is required";
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(loginEmail)) nextErrors.email = "Please enter a valid email address";
      if (!loginPassword) nextErrors.password = "Password is required";
      else if (loginPassword.length < 6) nextErrors.password = "Password must be at least 6 characters";
      const firstError = Object.values(nextErrors)[0];
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
    } catch (err: unknown) {
      const error = err as ApiError;
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
    const isValid = validateSignup();
    if (!isValid) {
      const nextErrors: { name?: string; email?: string; phone?: string; password?: string } = {};
      if (!signupName.trim()) nextErrors.name = "Name is required";
      else if (signupName.trim().length < 2) nextErrors.name = "Name must be at least 2 characters";
      else if (!/^[a-zA-Z\s]+$/.test(signupName.trim())) nextErrors.name = "Name can only contain letters and spaces";
      if (!signupEmail.trim()) nextErrors.email = "Email is required";
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(signupEmail)) nextErrors.email = "Please enter a valid email address";
      if (!signupPhone.trim()) nextErrors.phone = "Phone number is required";
      else if (!/^\d{10}$/.test(signupPhone.trim())) nextErrors.phone = "Phone number must be exactly 10 digits";
      if (!signupPassword) nextErrors.password = "Password is required";
      else if (signupPassword.length < 6) nextErrors.password = "Password must be at least 6 characters";
      else if (signupPassword.length > 50) nextErrors.password = "Password must be less than 50 characters";
      const firstError = Object.values(nextErrors)[0];
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
    } catch (err: unknown) {
      const error = err as ApiError;
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
      <div className="user-auth-mesh min-h-screen flex items-center justify-center px-3 sm:px-4 py-6 w-full">
        <Card className="w-full max-w-sm border-border/80 shadow-soft-lg bg-card/95 backdrop-blur-md motion-safe:animate-scale-in">
          <CardHeader className="space-y-1 text-center p-4">
            <div className="flex justify-center mb-2">
              <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center ring-2 ring-primary/10">
                <Mail className="w-4 h-4 text-primary" />
              </div>
            </div>
            <CardTitle className="text-lg font-semibold font-display">Verify email</CardTitle>
            <CardDescription className="text-xs">
              Code sent to <strong className="break-all">{signupEmail}</strong>
            </CardDescription>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <div className="space-y-2">
                <Label className="text-center block text-xs text-muted-foreground">6-digit code</Label>
                <div className="flex justify-center gap-1.5">
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
                      className="w-9 h-9 sm:w-10 sm:h-10 text-center text-sm font-semibold rounded-lg"
                      required
                    />
                  ))}
                </div>
              </div>

              <div className="space-y-2.5">
                <Button type="submit" className="w-full h-9 rounded-lg text-sm font-medium transition-transform hover:scale-[1.01] active:scale-[0.99]" disabled={loading}>
                  {loading ? 'Verifying...' : 'Verify'}
                </Button>

                <div className="text-center space-y-2">
                  {timer > 0 ? (
                    <p className="text-[11px] text-muted-foreground">
                      Resend in <span className="font-semibold text-primary tabular-nums">{timer}s</span>
                    </p>
                  ) : (
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full h-9 rounded-lg text-xs"
                      onClick={handleResendOtp}
                      disabled={loading || !canResend}
                    >
                      Resend code
                    </Button>
                  )}
                </div>

                <Button
                  type="button"
                  variant="ghost"
                  className="w-full h-8 text-xs"
                  onClick={() => {
                    setShowOtpPage(false);
                    setOtp(['', '', '', '', '', '']);
                    setTimer(30);
                    setCanResend(false);
                  }}
                >
                  <ArrowLeft className="w-3.5 h-3.5 mr-1.5" />
                  Back
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="user-auth-mesh min-h-screen flex items-center justify-center px-3 sm:px-4 py-6 w-full">
      <Card className="w-full max-w-sm border-border/80 shadow-soft-lg bg-card/95 backdrop-blur-md motion-safe:animate-scale-in">
        <CardHeader className="space-y-1 text-center p-4">
          <div className="flex justify-center mb-2">
            <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center ring-2 ring-primary/10">
              <UserCircle className="w-4 h-4 text-primary" />
            </div>
          </div>
          <CardTitle className="text-lg font-semibold font-display">Welcome</CardTitle>
          <CardDescription className="text-xs">Sign in or create an account</CardDescription>
        </CardHeader>
        <CardContent className="p-4 pt-0">
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2 h-8 p-0.5 rounded-lg">
              <TabsTrigger value="login" className="text-xs rounded-md data-[state=active]:shadow-sm">
                Login
              </TabsTrigger>
              <TabsTrigger value="signup" className="text-xs rounded-md data-[state=active]:shadow-sm">
                Sign up
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="login" className="mt-3">
              <form onSubmit={handleLogin} className="space-y-3">
                <div className="space-y-1.5">
                  <Label htmlFor="login-email" className="text-xs">
                    Email
                  </Label>
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
                    className={`h-9 rounded-lg text-sm ${loginErrors.email ? 'border-red-500' : ''}`}
                    required
                  />
                  {loginErrors.email && <p className="text-[11px] text-red-500">{loginErrors.email}</p>}
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="login-password" className="text-xs">
                    Password
                  </Label>
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
                    className={`h-9 rounded-lg text-sm ${loginErrors.password ? 'border-red-500' : ''}`}
                    required
                  />
                  {loginErrors.password && <p className="text-[11px] text-red-500">{loginErrors.password}</p>}
                </div>
                <Button
                  type="submit"
                  className="w-full h-9 rounded-lg text-sm font-medium transition-transform hover:scale-[1.01] active:scale-[0.99]"
                  disabled={loading}
                >
                  {loading ? 'Signing in...' : 'Sign in'}
                </Button>
                
                <div className="relative py-0.5">
                  <div className="absolute inset-0 flex items-center">
                    <Separator />
                  </div>
                  <div className="relative flex justify-center text-[10px] uppercase tracking-wider">
                    <span className="bg-card px-2 text-muted-foreground">Or</span>
                  </div>
                </div>

                <Button
                  type="button"
                  variant="outline"
                  className="w-full h-9 rounded-lg text-xs"
                  onClick={() => googleLoginHook()}
                  disabled={loading}
                >
                  <svg className="mr-2 h-3.5 w-3.5" viewBox="0 0 24 24">
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
                  Google
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="signup" className="mt-3">
              <form onSubmit={handleSignup} className="space-y-3">
                <div className="space-y-1.5">
                  <Label htmlFor="signup-name" className="text-xs">
                    Full name
                  </Label>
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
                    className={`h-9 rounded-lg text-sm ${signupErrors.name ? 'border-red-500' : ''}`}
                    required
                  />
                  {signupErrors.name && <p className="text-[11px] text-red-500">{signupErrors.name}</p>}
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="signup-email" className="text-xs">
                    Email
                  </Label>
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
                    className={`h-9 rounded-lg text-sm ${signupErrors.email ? 'border-red-500' : ''}`}
                    required
                  />
                  {signupErrors.email && <p className="text-[11px] text-red-500">{signupErrors.email}</p>}
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="signup-phone" className="text-xs">
                    Phone
                  </Label>
                  <Input
                    id="signup-phone"
                    type="tel"
                    placeholder="1234567890"
                    maxLength={10}
                    value={signupPhone}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, '');
                      setSignupPhone(value);
                      if (signupErrors.phone) {
                        setSignupErrors({ ...signupErrors, phone: undefined });
                      }
                    }}
                    className={`h-9 rounded-lg text-sm ${signupErrors.phone ? 'border-red-500' : ''}`}
                    required
                  />
                  {signupErrors.phone && <p className="text-[11px] text-red-500">{signupErrors.phone}</p>}
                  <p className="text-[10px] text-muted-foreground">10 digits</p>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="signup-password" className="text-xs">
                    Password
                  </Label>
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
                    className={`h-9 rounded-lg text-sm ${signupErrors.password ? 'border-red-500' : ''}`}
                    required
                  />
                  {signupErrors.password && <p className="text-[11px] text-red-500">{signupErrors.password}</p>}
                  <p className="text-[10px] text-muted-foreground">Min. 6 characters</p>
                </div>
                <Button
                  type="submit"
                  className="w-full h-9 rounded-lg text-sm font-medium transition-transform hover:scale-[1.01] active:scale-[0.99]"
                  disabled={loading}
                >
                  {loading ? 'Creating...' : 'Create account'}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
