'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2Icon } from 'lucide-react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

import { Button } from '@/_components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/_components/ui/card'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/_components/ui/form'
import { Input } from '@/_components/ui/input'
import { getAuthErrorMessage } from '@/_helpers/get-auth-error-message'
import { authClient } from '@/_lib/auth-client'

const signInSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, { message: 'O email é obrigatório' })
    .email({ message: 'O email é inválido' }),
  password: z
    .string()
    .trim()
    .min(8, { message: 'A senha deve ter pelo menos 8 caracteres' }),
})

type SignInData = z.infer<typeof signInSchema>

export function SignInForm() {
  const router = useRouter()
  const form = useForm<SignInData>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  async function handleSignInSubmit(data: SignInData) {
    const { error } = await authClient.signIn.email(
      {
        email: data.email,
        password: data.password,
      },
      {
        onSuccess: () => {
          router.push('/dashboard')
        },
      },
    )

    if (error && error.code) {
      const message = getAuthErrorMessage(error.code, 'ptBr')

      if (message) {
        toast.error(message)
        return
      }

      toast.error('Não foi possível fazer login')
    }
  }

  function handleGoogleSignIn() {
    authClient.signIn.social({
      provider: 'google',
      callbackURL: '/dashboard',
      scopes: ['email', 'profile'],
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Login</CardTitle>
        <CardDescription>Faça login para continuar.</CardDescription>
      </CardHeader>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleSignInSubmit)}
          className="space-y-8"
        >
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>

                  <FormControl>
                    <Input
                      type="email"
                      placeholder="Digite seu email"
                      {...field}
                    />
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
                  <FormLabel>Password</FormLabel>

                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Digite sua senha"
                      {...field}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>

          <CardFooter className="flex-col gap-3">
            <Button className="w-full">
              {form.formState.isSubmitting && (
                <Loader2Icon className="mr-2 animate-spin" />
              )}
              Entrar
            </Button>

            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={handleGoogleSignIn}
            >
              <Image
                src="/google-logo.svg"
                alt="Google"
                width={20}
                height={20}
              />
              Entrar com Google
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  )
}
