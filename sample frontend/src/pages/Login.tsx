import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { AuthToast } from '@/components/ui/auth-toast';
import { login } from '@/api/adminApi';
import { safeSetItem } from '@/lib/safeStorage';

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [loading, setLoading] = useState(false);

  const [toastMsg, setToastMsg] = useState<{
    title: string;
    description?: string;
    type?: 'success' | 'error';
  } | null>(null);

  const showToast = (
    title: string,
    description?: string,
    type: 'success' | 'error' = 'success'
  ) => {
    setToastMsg({ title, description, type });

    setTimeout(() => {
      setToastMsg(null);
    }, 3000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      showToast('Validation Error', 'Please fix the form errors', 'error');
      return;
    }

    setLoading(true);

    try {
      const response = await login(email, password);
      const accessToken = response?.accessToken;
      const refreshToken = response?.refreshToken;
      const user = response?.user;

      if (!accessToken || !user) {
        const msg =
          (response as { error?: string })?.error ||
          'Login failed. Invalid response from server.';

        showToast('Login Failed', msg, 'error');
        return;
      }

      safeSetItem('authToken', accessToken);
      if (refreshToken) {
        safeSetItem('refreshToken', refreshToken);
      }
      safeSetItem('adminUser', JSON.stringify(user));

      showToast('Success', 'Welcome Back!', 'success');

      setTimeout(() => {
        navigate('/admin');
      }, 1000);

    } catch (error: unknown) {
      const err = error as {
        response?: { data?: { error?: string; message?: string } };
        message?: string;
      };

      const message =
        err?.response?.data?.error ??
        err?.response?.data?.message ??
        (!err?.response
          ? 'Network error. Check your connection and try again.'
          : null) ??
        err?.message ??
        'Login failed. Please check your email and password.';

      showToast('Login Failed', String(message), 'error');
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    const newErrors: { email?: string; password?: string } = {};

    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Invalid email format';
    }

    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-primary via-primary/90 to-primary/80 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-primary text-primary-foreground font-bold text-2xl shadow-lg">
              RM
            </div>
          </div>
          <CardTitle className="text-2xl font-bold">RsMeters Admin</CardTitle>
          <CardDescription>
            Enter your credentials to access the admin panel
          </CardDescription>
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@rsmeters.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (errors.email) setErrors({ ...errors, email: '' });
                }}
                className={errors.email ? "border-red-500" : ""}
              />
              {errors.email && (
                <p className="text-sm text-red-500">{errors.email}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (errors.password) setErrors({ ...errors, password: '' });
                }}
                className={errors.password ? "border-red-500" : ""}
              />
              {errors.password && (
                <p className="text-sm text-red-500">{errors.password}</p>
              )}
            </div>
          </CardContent>

          <CardFooter className="flex flex-col gap-4">
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Logging in...' : 'Login'}
            </Button>

            <p className="text-sm text-muted-foreground text-center">
              Demo: Use any email and password
            </p>
          </CardFooter>
        </form>
      </Card>

      {toastMsg && (
        <AuthToast
          title={toastMsg.title}
          description={toastMsg.description}
          type={toastMsg.type}
        />
      )}
    </div>
  );
}