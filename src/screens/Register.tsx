import { zodResolver } from '@hookform/resolvers/zod';
import { FormProvider, useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { Button } from '../components/ui/button';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '../components/ui/form';
import { Input } from '../components/ui/input';
import AuthService from '../services/AuthService';
import { AxiosError } from 'axios';
import { useToast } from '@/hooks/use-toast.ts';

const formSchema = z.object({
  username: z.string().min(2, {
    message: 'Обов`язкове поле.',
  }),
  email: z.string().min(1, { message: 'Обов`язкове поле.' }).email('Не валідна пошта.'),
  password: z.string().min(2, {
    message: 'Обов`язкове поле.',
  }),
});

export function Register() {
  const { toast } = useToast();

  const navigate = useNavigate();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: '',
      email: '',
      password: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const { status } = await AuthService.signUp(values);
      if (status === 201) navigate('/login');
    } catch (error) {
      if (error instanceof AxiosError && error.response) {
        toast({
          title: 'Помилка реєстрації',
          description: error.response.data.detail,
          variant: 'destructive',
        });
      }
    }
  }
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="max-w-sm space-y-6">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold">Реєстрація у системі</h1>
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
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Пошта</FormLabel>
                  <FormControl>
                    <Input placeholder="myemail@gmail.com" {...field} />
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
              Зараєстуватися
            </Button>
            <p className="text-center dark:text-gray-400 ">
              Вже є акаунт?{' '}
              <Link to="/login" className="underline font-bold">
                Увійти
              </Link>
            </p>
          </form>
        </FormProvider>
      </div>
    </div>
  );
}
