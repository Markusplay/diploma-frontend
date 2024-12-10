import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, FormProvider } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { Button } from '../components/ui/button';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '../components/ui/form';
import { Input } from '../components/ui/input';
import AuthService from '../services/AuthService';
import { useToast } from '@/hooks/use-toast.ts';
import { AxiosError } from 'axios';

const formSchema = z.object({
  username: z.string().min(1, 'Username is required'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export function Login() {
  const { toast } = useToast();

  const navigate = useNavigate();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: '',
      password: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const formData = new FormData();
    formData.append('username', values.username);
    formData.append('password', values.password);

    try {
      const { data } = await AuthService.signIn(formData);

      localStorage.setItem('token', JSON.stringify(data.access_token));
      navigate('/');
    } catch (error) {
      if (error instanceof AxiosError && error.response) {
        toast({
          title: 'Помилка авторизації',
          description: error.response.data.detail,
          variant: 'destructive',
        });
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="max-w-sm space-y-6">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold">Вхід у систему</h1>
          <p className="text-gray-500 dark:text-gray-400">
            Введіть логін та пароль, щоб увійти у свій акаунт.
          </p>
        </div>
        <FormProvider {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Логін</FormLabel>
                  <FormControl>
                    <Input placeholder="johndoe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Пароль</FormLabel>
                  <FormControl>
                    <Input type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button className="w-full" type="submit">
              Увійти
            </Button>

            <p className="text-center dark:text-gray-400 ">
              Немає акаунту?{' '}
              <Link to="/register" className="underline font-bold">
                Зареєстуватися
              </Link>
            </p>
          </form>
        </FormProvider>
      </div>
    </div>
  );
}
