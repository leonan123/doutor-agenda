'use client'

import { loadStripe } from '@stripe/stripe-js'
import { CheckCircle2Icon, Loader2Icon } from 'lucide-react'
import { useAction } from 'next-safe-action/hooks'

import { createStripeCheckout } from '@/_actions/create-stripe-checkout'
import { Badge } from '@/_components/ui/badge'
import { Button } from '@/_components/ui/button'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@/_components/ui/card'
import { Separator } from '@/_components/ui/separator'

interface SubscriptionPlanCardProps {
  active?: boolean
}

const features = [
  'Cadastro de até 3 médicos',
  'Agendamentos ilimitados',
  'Métricas básicas',
  'Cadastro de pacientes',
  'Confirmação manual',
  'Suporte via e-mail',
]

export default function SubscriptionPlanCard({
  active = false,
}: SubscriptionPlanCardProps) {
  const createStripeCheckoutAction = useAction(createStripeCheckout, {
    onSuccess: async ({ data }) => {
      if (!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY) {
        throw new Error('Stripe publishable key not found.')
      }

      if (!data?.sessionId) {
        throw new Error('Stripe checkout session id not found.')
      }

      const stripe = await loadStripe(
        process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
      )

      if (!stripe) {
        throw new Error('Stripe not found.')
      }

      await stripe.redirectToCheckout({
        sessionId: data.sessionId,
      })
    },
    onError: (error) => {
      console.error(error)
    },
  })

  function handleSubscribeClick() {
    createStripeCheckoutAction.execute()
  }

  return (
    <Card className="max-w-2xs">
      <CardHeader>
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold">Essential</h3>
          {active && (
            <Badge
              variant="secondary"
              className="bg-green-100 font-bold text-green-700 hover:bg-green-100"
            >
              Atual
            </Badge>
          )}
        </div>
        <p className="text-muted-foreground mb-4 text-xs">
          Para profissionais autônomos ou pequenas clínicas
        </p>
        <div className="flex items-baseline gap-1">
          <span className="text-2xl font-bold">R$59</span>
          <span className="text-muted-foreground text-sm">/mês</span>
        </div>
      </CardHeader>

      <div className="px-6">
        <Separator />
      </div>

      <CardContent>
        <ul className="space-y-4">
          {features.map((feature, index) => (
            <li
              key={index}
              className="flex items-center gap-1.5 text-xs font-semibold"
            >
              <CheckCircle2Icon
                size={16}
                className="mb-0.5 flex-shrink-0 text-green-500"
              />
              {feature}
            </li>
          ))}
        </ul>
      </CardContent>

      <div className="px-6">
        <Separator />
      </div>

      <CardFooter>
        <Button
          className="w-full"
          variant="outline"
          onClick={!active ? handleSubscribeClick : undefined}
          disabled={createStripeCheckoutAction.isPending}
        >
          {createStripeCheckoutAction.isPending && (
            <Loader2Icon className="animate-spin" />
          )}

          {active ? 'Gerenciar assinatura' : 'Fazer assinatura'}
        </Button>
      </CardFooter>
    </Card>
  )
}
