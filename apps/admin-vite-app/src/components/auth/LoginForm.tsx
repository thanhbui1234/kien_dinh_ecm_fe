import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { LoginSchema, LoginInput } from 'shared-api';
import { Button, Input, Label, Card, CardContent, CardDescription, CardHeader, CardTitle, Spinner } from 'shared-ui';
import { useLogin } from '@/queries/auth/useLogin';

export function LoginForm() {
  const loginMutation = useLogin();

  const { register, handleSubmit, formState: { errors } } = useForm<LoginInput>({
    resolver: zodResolver(LoginSchema as any),
  });

  const onSubmit = (data: LoginInput) => {
    loginMutation.mutate(data);
  };

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
            {errors.email && <p className="text-xs text-red-500 font-medium">{errors.email.message}</p>}
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
            {errors.password && <p className="text-xs text-red-500 font-medium">{errors.password.message}</p>}
          </div>
          <Button 
            type="submit" 
            className="w-full mt-2 h-10 font-semibold shadow-lg shadow-blue-500/20 bg-blue-600 hover:bg-blue-700 text-white transition-all hover:scale-[1.02]" 
            disabled={loginMutation.isPending}
          >
            {loginMutation.isPending ? <Spinner className="mr-2 h-4 w-4" /> : null}
            Sign In
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
