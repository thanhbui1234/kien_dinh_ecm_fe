import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { LoginSchema, LoginInput, AUTH_REASONS, AUTH_MESSAGES } from 'shared-api';
import { Button, Input, Label, Card, CardContent, CardDescription, CardHeader, CardTitle, Spinner } from 'shared-ui';
import { useLogin } from '@/queries/auth/useLogin';
import { getDeviceInfo } from '@/lib/device-id';
import { toast } from '@/utils/toast';
import { AlertCircle, ShieldAlert } from 'lucide-react';

export function LoginForm() {
  const loginMutation = useLogin();
  const [searchParams] = useSearchParams();
  const [isGettingDevice, setIsGettingDevice] = useState(false);
  const [bannerMessage, setBannerMessage] = useState<string | null>(null);

  useEffect(() => {
    const reason = searchParams.get('reason');
    if (reason === AUTH_REASONS.KICKED) {
      const msg = AUTH_MESSAGES.KICKED_TOAST;
      toast.warning(msg);
      setBannerMessage(msg);
      window.history.replaceState({}, '', window.location.pathname);
    } else if (reason === AUTH_REASONS.LOCKED) {
      const msg = AUTH_MESSAGES.LOCKED_TOAST;
      toast.error(msg);
      setBannerMessage(msg);
      window.history.replaceState({}, '', window.location.pathname);
    }
  }, [searchParams]);

  const { register, handleSubmit, formState: { errors } } = useForm<LoginInput>({
    resolver: zodResolver(LoginSchema as any),
  });

  const onSubmit = async (data: LoginInput) => {
    setIsGettingDevice(true);
    setBannerMessage(null);
    try {
      const deviceInfo = await getDeviceInfo();
      loginMutation.mutate({
        ...data,
        deviceId: deviceInfo.deviceId,
        fingerprint: deviceInfo.fingerprint,
      });
    } catch (err) {
      loginMutation.mutate(data);
    } finally {
      setIsGettingDevice(false);
    }
  };

  const isSubmitting = loginMutation.isPending || isGettingDevice;

  return (
    <Card className="mx-auto max-w-sm w-full bg-white/70 dark:bg-zinc-950/70 backdrop-blur-xl border border-white/20 dark:border-white/10 shadow-2xl">
      <CardHeader>
        <CardTitle className="text-3xl font-extrabold bg-gradient-to-br from-zinc-900 to-zinc-500 bg-clip-text text-transparent dark:from-zinc-100 dark:to-zinc-500">
          Welcome back
        </CardTitle>
        <CardDescription className="text-zinc-500 font-medium">
          Enter your credentials to access your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        {bannerMessage && (
          <div className="mb-4 flex items-start gap-2.5 rounded-lg border border-red-200 bg-red-50 p-3 text-xs text-red-700 dark:border-red-900/50 dark:bg-red-950/50 dark:text-red-300">
            <ShieldAlert className="h-4 w-4 shrink-0 text-red-600 dark:text-red-400 mt-0.5" />
            <div className="flex-1 font-medium">{bannerMessage}</div>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-5">
          <div className="grid gap-2">
            <Label htmlFor="email" className="font-semibold text-zinc-700 dark:text-zinc-300">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="name@example.com"
              className="bg-white/50 dark:bg-zinc-900/50 backdrop-blur-sm transition-all focus-visible:ring-blue-500 h-10"
              {...register('email')}
            />
            {errors.email && <p className="text-xs text-red-500 font-medium flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {errors.email.message}</p>}
          </div>
          <div className="grid gap-2">
            <div className="flex items-center">
              <Label htmlFor="password" className="font-semibold text-zinc-700 dark:text-zinc-300">Password</Label>
              <Link to="#" className="ml-auto inline-block text-xs font-medium text-zinc-500 hover:text-blue-600 transition-colors">
                Forgot password?
              </Link>
            </div>
            <Input 
              id="password" 
              type="password" 
              className="bg-white/50 dark:bg-zinc-900/50 backdrop-blur-sm transition-all focus-visible:ring-blue-500 h-10"
              {...register('password')} 
            />
            {errors.password && <p className="text-xs text-red-500 font-medium flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {errors.password.message}</p>}
          </div>
          <Button 
            type="submit" 
            className="w-full mt-2 h-10 font-semibold shadow-lg shadow-blue-500/20 bg-blue-600 hover:bg-blue-700 text-white transition-all hover:scale-[1.02]" 
            disabled={isSubmitting}
          >
            {isSubmitting ? <Spinner className="mr-2 h-4 w-4" /> : null}
            Sign In
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
