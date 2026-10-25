import { zodResolver } from '@hookform/resolvers/zod'
import { AlertTriangle, UserRound } from 'lucide-react'
import { useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { errorMessage } from '@/components/common/ErrorState'
import { FieldError } from '@/components/common/FieldError'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useUpdateProfile } from '@/hooks/useAccount'
import { avatarSchema, updateProfileInputSchema, type Profile, type UpdateProfileInput } from '@/schemas/profile'
import { applyApiFieldErrors } from '@/components/auth/api-field-errors'

const fieldClass = 'h-12 rounded-xl border-border bg-background/40 md:h-10 md:rounded-sm'
const AVATAR_TYPES = ['image/png', 'image/jpeg', 'image/webp', 'image/gif']
const AVATAR_MAX_BYTES = 1024 * 1024
const fieldNames = ['displayName', 'username', 'email', 'ensName', 'walletNickname', 'avatar'] as const

function toFormValues(profile: Profile): UpdateProfileInput {
  return {
    displayName: profile.displayName,
    username: profile.username,
    email: profile.email,
    ensName: profile.ensName,
    walletNickname: profile.walletNickname,
  }
}

function readAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => (typeof reader.result === 'string' ? resolve(reader.result) : reject(new Error('Falha ao ler a imagem')))
    reader.onerror = () => reject(reader.error ?? new Error('Falha ao ler a imagem'))
    reader.readAsDataURL(file)
  })
}

interface ProfileFormProps {
  profile: Profile
}

export function ProfileForm({ profile }: ProfileFormProps) {
  const updateProfile = useUpdateProfile()
  const fileInput = useRef<HTMLInputElement>(null)
  const [avatar, setAvatar] = useState<string | null>(profile.avatar)
  const [formError, setFormError] = useState<string | null>(null)
  const form = useForm<UpdateProfileInput>({
    resolver: zodResolver(updateProfileInputSchema),
    defaultValues: toFormValues(profile),
  })

  const avatarChanged = avatar !== profile.avatar
  const saveDisabled = updateProfile.isPending || (!form.formState.isDirty && !avatarChanged)

  const onSubmit = form.handleSubmit((values) => {
    setFormError(null)
    form.clearErrors('avatar')
    updateProfile.mutate(
      { ...values, avatar },
      {
        onSuccess: (next) => {
          form.reset(toFormValues(next))
          setAvatar(next.avatar)
          toast.success('Perfil atualizado')
        },
        onError: (error) => {
          const applied = applyApiFieldErrors(error, form.setError, fieldNames)
          if (!applied) setFormError(errorMessage(error, 'Não foi possível salvar o perfil. Tente novamente.'))
        },
      },
    )
  })

  async function handleFile(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file) return
    if (!AVATAR_TYPES.includes(file.type)) {
      form.setError('avatar', { type: 'manual', message: 'Use uma imagem PNG, JPEG, WebP ou GIF' })
      return
    }
    if (file.size > AVATAR_MAX_BYTES) {
      form.setError('avatar', { type: 'manual', message: 'A imagem deve ter no máximo 1 MB' })
      return
    }
    try {
      const dataUrl = await readAsDataUrl(file)
      const parsed = avatarSchema.safeParse(dataUrl)
      if (!parsed.success) {
        form.setError('avatar', { type: 'manual', message: parsed.error.issues[0]?.message ?? 'Imagem inválida' })
        return
      }
      form.clearErrors('avatar')
      setAvatar(parsed.data)
    } catch {
      form.setError('avatar', { type: 'manual', message: 'Não foi possível ler a imagem' })
    }
  }

  function removeAvatar() {
    form.clearErrors('avatar')
    setAvatar(null)
  }

  return (
    <form noValidate onSubmit={onSubmit} className="flex flex-col">
      {formError && (
        <div role="alert" className="mb-6 flex items-start gap-2 rounded-sm border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          <AlertTriangle className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
          <span>{formError}</span>
        </div>
      )}

      <div className="grid gap-7 md:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="profile-display-name">
            Nome de exibição <span className="text-primary" aria-hidden="true">*</span>
          </Label>
          <Input
            id="profile-display-name"
            className={fieldClass}
            aria-invalid={Boolean(form.formState.errors.displayName)}
            aria-describedby={form.formState.errors.displayName ? 'profile-display-name-error' : undefined}
            {...form.register('displayName')}
          />
          <FieldError id="profile-display-name-error" message={form.formState.errors.displayName?.message} />
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="profile-username">
            Nome de usuário <span className="text-primary" aria-hidden="true">*</span>
          </Label>
          <Input
            id="profile-username"
            autoComplete="username"
            className={fieldClass}
            aria-invalid={Boolean(form.formState.errors.username)}
            aria-describedby={form.formState.errors.username ? 'profile-username-error' : undefined}
            {...form.register('username')}
          />
          <FieldError id="profile-username-error" message={form.formState.errors.username?.message} />
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="profile-email">
            E-mail <span className="text-primary" aria-hidden="true">*</span>
          </Label>
          <Input
            id="profile-email"
            type="email"
            autoComplete="email"
            className={fieldClass}
            aria-invalid={Boolean(form.formState.errors.email)}
            aria-describedby={form.formState.errors.email ? 'profile-email-error' : undefined}
            {...form.register('email')}
          />
          <FieldError id="profile-email-error" message={form.formState.errors.email?.message} />
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="profile-ens">
            Nome ENS <span className="text-primary" aria-hidden="true">*</span>
          </Label>
          <div className="relative">
            <Input
              id="profile-ens"
              className={`${fieldClass} pr-14`}
              aria-invalid={Boolean(form.formState.errors.ensName)}
              aria-describedby={form.formState.errors.ensName ? 'profile-ens-error' : undefined}
              {...form.register('ensName')}
            />
            <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-sm text-muted-foreground" aria-hidden="true">
              .eth
            </span>
          </div>
          <FieldError id="profile-ens-error" message={form.formState.errors.ensName?.message} />
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="profile-wallet-nickname">
            Apelido da carteira <span className="text-primary" aria-hidden="true">*</span>
          </Label>
          <Input
            id="profile-wallet-nickname"
            className={fieldClass}
            aria-invalid={Boolean(form.formState.errors.walletNickname)}
            aria-describedby={form.formState.errors.walletNickname ? 'profile-wallet-nickname-error' : undefined}
            {...form.register('walletNickname')}
          />
          <FieldError id="profile-wallet-nickname-error" message={form.formState.errors.walletNickname?.message} />
        </div>

        <div className="flex flex-col gap-1.5">
          <p id="profile-avatar-label" className="text-sm font-medium">
            Avatar
          </p>
          <div role="group" aria-labelledby="profile-avatar-label" className="flex flex-wrap items-center gap-4">
            <span className="grid size-[50px] place-items-center overflow-hidden rounded-full border border-border-soft bg-surface-dark text-muted-foreground">
              {avatar ? (
                <img src={avatar} alt={avatarChanged ? 'Prévia do novo avatar' : 'Avatar atual'} className="size-full object-cover" />
              ) : (
                <UserRound className="size-6" aria-hidden="true" />
              )}
            </span>
            <input
              ref={fileInput}
              type="file"
              accept="image/*"
              className="sr-only"
              tabIndex={-1}
              aria-label="Selecionar imagem de avatar"
              onChange={handleFile}
            />
            <Button
              type="button"
              variant="outline"
              onClick={() => fileInput.current?.click()}
              aria-describedby={form.formState.errors.avatar ? 'avatar-help profile-avatar-error' : 'avatar-help'}
            >
              Alterar
            </Button>
            <Button type="button" variant="ghost" onClick={removeAvatar} disabled={!avatar}>
              Remover
            </Button>
          </div>
          <p id="avatar-help" className="text-xs text-muted-foreground">
            PNG, JPEG, WebP ou GIF até 1 MB.
          </p>
          <FieldError id="profile-avatar-error" message={form.formState.errors.avatar?.message} />
        </div>
      </div>

      <Button type="submit" disabled={saveDisabled} className="mt-8 h-10 w-fit px-8">
        {updateProfile.isPending ? 'Salvando…' : 'Salvar'}
      </Button>
    </form>
  )
}
