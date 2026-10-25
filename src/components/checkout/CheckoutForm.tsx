import { useEffect } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { FieldError } from '@/components/common/FieldError'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { checkoutFormSchema, type CheckoutFormValues } from './checkout-form-schema'

interface CheckoutFormProps {
  formId: string
  defaultValues: CheckoutFormValues
  disabled?: boolean
  onValuesChange: (values: Partial<CheckoutFormValues>) => void
  onSubmit: (values: CheckoutFormValues) => void
}

function RequiredMark() {
  return (
    <>
      <span className="text-primary" aria-hidden="true">
        *
      </span>
      <span className="sr-only">(obrigatório)</span>
    </>
  )
}

export function CheckoutForm({ formId, defaultValues, disabled, onValuesChange, onSubmit }: CheckoutFormProps) {
  const form = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutFormSchema),
    defaultValues,
    mode: 'onSubmit',
    reValidateMode: 'onChange',
  })

  const subscribe = form.subscribe

  useEffect(() => {
    return subscribe({
      formState: { values: true },
      callback: ({ values }) => onValuesChange(values),
    })
  }, [subscribe, onValuesChange])

  const errors = form.formState.errors

  return (
    <form
      id={formId}
      noValidate
      onSubmit={form.handleSubmit(onSubmit)}
      className="flex flex-col gap-6"
      aria-labelledby="checkout-form-heading"
    >
      <h2 id="checkout-form-heading" className="font-bold">
        Perfil do colecionador
      </h2>

      <fieldset disabled={disabled} className="grid gap-5 md:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="checkout-display-name">
            Nome de exibição <RequiredMark />
          </Label>
          <Input
            id="checkout-display-name"
            autoComplete="name"
            aria-required="true"
            aria-invalid={Boolean(errors.displayName)}
            aria-describedby={errors.displayName ? 'checkout-display-name-error' : undefined}
            className="h-11 md:h-10"
            {...form.register('displayName')}
          />
          <FieldError id="checkout-display-name-error" message={errors.displayName?.message} />
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="checkout-username">
            Nome de usuário <RequiredMark />
          </Label>
          <Input
            id="checkout-username"
            autoComplete="username"
            aria-required="true"
            aria-invalid={Boolean(errors.username)}
            aria-describedby={errors.username ? 'checkout-username-error' : undefined}
            className="h-11 md:h-10"
            {...form.register('username')}
          />
          <FieldError id="checkout-username-error" message={errors.username?.message} />
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="checkout-profile-name">
            Nome do perfil <RequiredMark />
          </Label>
          <Input
            id="checkout-profile-name"
            autoComplete="off"
            aria-required="true"
            aria-invalid={Boolean(errors.profileName)}
            aria-describedby={errors.profileName ? 'checkout-profile-name-error' : undefined}
            className="h-11 md:h-10"
            {...form.register('profileName')}
          />
          <FieldError id="checkout-profile-name-error" message={errors.profileName?.message} />
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="checkout-email">
            E-mail <RequiredMark />
          </Label>
          <Input
            id="checkout-email"
            type="email"
            autoComplete="email"
            aria-required="true"
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? 'checkout-email-error' : undefined}
            className="h-11 md:h-10"
            {...form.register('email')}
          />
          <FieldError id="checkout-email-error" message={errors.email?.message} />
        </div>

        <div className="flex flex-col gap-1.5 md:col-span-2">
          <Label htmlFor="checkout-note">Observação do colecionador (opcional)</Label>
          <Textarea
            id="checkout-note"
            maxLength={500}
            aria-describedby={errors.note ? 'checkout-note-hint checkout-note-error' : 'checkout-note-hint'}
            aria-invalid={Boolean(errors.note)}
            className="min-h-28"
            {...form.register('note')}
          />
          <p id="checkout-note-hint" className="text-xs text-muted-foreground">
            Máximo de 500 caracteres.
          </p>
          <FieldError id="checkout-note-error" message={errors.note?.message} />
        </div>
      </fieldset>
    </form>
  )
}
