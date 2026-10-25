import { zodResolver } from '@hookform/resolvers/zod'
import { AlertTriangle } from 'lucide-react'
import { useState } from 'react'
import { Controller, useForm, type DefaultValues } from 'react-hook-form'
import { toast } from 'sonner'
import { applyApiFieldErrors } from '@/components/auth/api-field-errors'
import { errorMessage } from '@/components/common/ErrorState'
import { FieldError } from '@/components/common/FieldError'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useCreateWallet, useUpdateWallet } from '@/hooks/useAccount'
import { NETWORK_LABELS, networkSchema } from '@/schemas/common'
import { WALLET_PROVIDER_LABELS, walletInputSchema, walletProviderSchema, type Wallet, type WalletInput, type WalletSlot } from '@/schemas/wallet'

const fieldClass = 'h-12 rounded-xl border-border bg-background/40 md:h-10 md:rounded-sm'
const selectClass = `${fieldClass} data-[size=default]:h-12 md:data-[size=default]:h-10`
const FIELD_NAMES = ['displayName', 'nickname', 'network', 'profileName', 'address', 'secondaryAddress', 'provider', 'referralCode', 'email', 'ensName'] as const

type WalletFormValues = Omit<WalletInput, 'slot'>

interface FieldProps {
  id: string
  label: string
  optional?: boolean
  error?: string
  children: React.ReactNode
}

function Field({ id, label, optional = false, error, children }: FieldProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <Label htmlFor={id}>
        {label} {optional ? <span className="text-xs font-normal text-muted-foreground">(opcional)</span> : <span className="text-primary" aria-hidden="true">*</span>}
      </Label>
      {children}
      <FieldError id={`${id}-error`} message={error} />
    </div>
  )
}

function defaultsFor(wallet: Wallet | undefined): DefaultValues<WalletFormValues> {
  if (!wallet) {
    return {
      displayName: '',
      nickname: '',
      network: undefined,
      profileName: '',
      address: '',
      secondaryAddress: '',
      provider: undefined,
      referralCode: '',
      email: '',
      ensName: '',
    }
  }
  return {
    displayName: wallet.displayName,
    nickname: wallet.nickname,
    network: wallet.network,
    profileName: wallet.profileName,
    address: wallet.address,
    secondaryAddress: wallet.secondaryAddress ?? '',
    provider: wallet.provider,
    referralCode: wallet.referralCode,
    email: wallet.email,
    ensName: wallet.ensName,
  }
}

interface WalletFormProps {
  slot: WalletSlot
  wallet?: Wallet
  onSaved: (wallet: Wallet) => void
  onCancel?: () => void
}

export function WalletForm({ slot, wallet, onSaved, onCancel }: WalletFormProps) {
  const createWallet = useCreateWallet()
  const updateWallet = useUpdateWallet()
  const [formError, setFormError] = useState<string | null>(null)
  const form = useForm<WalletFormValues>({
    resolver: zodResolver(walletInputSchema.omit({ slot: true })),
    defaultValues: defaultsFor(wallet),
  })
  const pending = createWallet.isPending || updateWallet.isPending

  const onSubmit = form.handleSubmit((values) => {
    setFormError(null)
    const onSuccess = (saved: Wallet) => {
      toast.success(wallet ? 'Carteira atualizada' : 'Carteira salva')
      onSaved(saved)
    }
    const onError = (error: unknown) => {
      const applied = applyApiFieldErrors(error, form.setError, FIELD_NAMES)
      if (!applied) setFormError(errorMessage(error, 'Não foi possível salvar a carteira. Tente novamente.'))
    }

    if (wallet) updateWallet.mutate({ walletId: wallet.id, input: values }, { onSuccess, onError })
    else createWallet.mutate({ ...values, slot }, { onSuccess, onError })
  })

  return (
    <form noValidate onSubmit={onSubmit} className="mt-6 flex flex-col gap-6">
      {formError && (
        <div role="alert" className="flex items-start gap-2 rounded-sm border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          <AlertTriangle className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
          <span>{formError}</span>
        </div>
      )}

      <div className="grid gap-7 md:grid-cols-2">
        <Field id="wallet-display-name" label="Nome de exibição" error={form.formState.errors.displayName?.message}>
          <Input
            id="wallet-display-name"
            autoComplete="name"
            className={fieldClass}
            aria-invalid={Boolean(form.formState.errors.displayName)}
            aria-describedby={form.formState.errors.displayName ? 'wallet-display-name-error' : undefined}
            {...form.register('displayName')}
          />
        </Field>

        <Field id="wallet-nickname" label="Apelido da carteira" error={form.formState.errors.nickname?.message}>
          <Input
            id="wallet-nickname"
            className={fieldClass}
            aria-invalid={Boolean(form.formState.errors.nickname)}
            aria-describedby={form.formState.errors.nickname ? 'wallet-nickname-error' : undefined}
            {...form.register('nickname')}
          />
        </Field>

        <Field id="wallet-network" label="Rede" error={form.formState.errors.network?.message}>
          <Controller
            control={form.control}
            name="network"
            render={({ field, fieldState }) => (
              <Select
                value={field.value ?? ''}
                onValueChange={(value) => {
                  const parsed = networkSchema.safeParse(value)
                  if (parsed.success) field.onChange(parsed.data)
                }}
              >
                <SelectTrigger
                  id="wallet-network"
                  onBlur={field.onBlur}
                  className={selectClass}
                  aria-invalid={Boolean(fieldState.error)}
                  aria-describedby={fieldState.error ? 'wallet-network-error' : undefined}
                >
                  <SelectValue placeholder="Selecione uma rede" />
                </SelectTrigger>
                <SelectContent>
                  {networkSchema.options.map((network) => (
                    <SelectItem key={network} value={network}>
                      {NETWORK_LABELS[network]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        </Field>

        <Field id="wallet-profile-name" label="Nome do perfil" error={form.formState.errors.profileName?.message}>
          <Input
            id="wallet-profile-name"
            className={fieldClass}
            aria-invalid={Boolean(form.formState.errors.profileName)}
            aria-describedby={form.formState.errors.profileName ? 'wallet-profile-name-error' : undefined}
            {...form.register('profileName')}
          />
        </Field>

        <Field id="wallet-address" label="Endereço da carteira" error={form.formState.errors.address?.message}>
          <Input
            id="wallet-address"
            placeholder="Endereço 0x da carteira"
            className={fieldClass}
            aria-invalid={Boolean(form.formState.errors.address)}
            aria-describedby={form.formState.errors.address ? 'wallet-address-error' : undefined}
            {...form.register('address')}
          />
        </Field>

        <div className="flex flex-col justify-end gap-1.5">
          <Label htmlFor="wallet-secondary-address" className="sr-only">
            ENS ou carteira secundária (opcional)
          </Label>
          <Input
            id="wallet-secondary-address"
            placeholder="ENS ou carteira secundária (opcional)"
            className={fieldClass}
            aria-invalid={Boolean(form.formState.errors.secondaryAddress)}
            aria-describedby={form.formState.errors.secondaryAddress ? 'wallet-secondary-address-error' : undefined}
            {...form.register('secondaryAddress')}
          />
          <FieldError id="wallet-secondary-address-error" message={form.formState.errors.secondaryAddress?.message} />
        </div>

        <Field id="wallet-provider" label="Tipo de carteira" error={form.formState.errors.provider?.message}>
          <Controller
            control={form.control}
            name="provider"
            render={({ field, fieldState }) => (
              <Select
                value={field.value ?? ''}
                onValueChange={(value) => {
                  const parsed = walletProviderSchema.safeParse(value)
                  if (parsed.success) field.onChange(parsed.data)
                }}
              >
                <SelectTrigger
                  id="wallet-provider"
                  onBlur={field.onBlur}
                  className={selectClass}
                  aria-invalid={Boolean(fieldState.error)}
                  aria-describedby={fieldState.error ? 'wallet-provider-error' : undefined}
                >
                  <SelectValue placeholder="Selecione uma carteira" />
                </SelectTrigger>
                <SelectContent>
                  {walletProviderSchema.options.map((provider) => (
                    <SelectItem key={provider} value={provider}>
                      {WALLET_PROVIDER_LABELS[provider]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        </Field>

        <Field id="wallet-referral" label="Código de indicação" error={form.formState.errors.referralCode?.message}>
          <Input
            id="wallet-referral"
            className={fieldClass}
            aria-invalid={Boolean(form.formState.errors.referralCode)}
            aria-describedby={form.formState.errors.referralCode ? 'wallet-referral-error' : undefined}
            {...form.register('referralCode')}
          />
        </Field>

        <Field id="wallet-email" label="E-mail" error={form.formState.errors.email?.message}>
          <Input
            id="wallet-email"
            type="email"
            autoComplete="email"
            className={fieldClass}
            aria-invalid={Boolean(form.formState.errors.email)}
            aria-describedby={form.formState.errors.email ? 'wallet-email-error' : undefined}
            {...form.register('email')}
          />
        </Field>

        <Field id="wallet-ens" label="Nome ENS" error={form.formState.errors.ensName?.message}>
          <div className="relative">
            <Input
              id="wallet-ens"
              placeholder="seunome"
              className={`${fieldClass} pr-14`}
              aria-invalid={Boolean(form.formState.errors.ensName)}
              aria-describedby={form.formState.errors.ensName ? 'wallet-ens-error' : undefined}
              {...form.register('ensName')}
            />
            <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-sm text-muted-foreground" aria-hidden="true">
              .eth
            </span>
          </div>
        </Field>
      </div>

      <div className="flex flex-wrap gap-3">
        <Button type="submit" disabled={pending} className="h-10 px-6">
          {pending ? 'Salvando…' : 'Salvar carteira'}
        </Button>
        {onCancel && (
          <Button type="button" variant="ghost" onClick={onCancel} disabled={pending}>
            Cancelar
          </Button>
        )}
      </div>
    </form>
  )
}
