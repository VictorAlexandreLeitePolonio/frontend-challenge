import { zodResolver } from '@hookform/resolvers/zod'
import { AlertTriangle } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { ApiError } from '@/api/client'
import { applyApiFieldErrors } from '@/components/auth/api-field-errors'
import { PasswordInput } from '@/components/auth/PasswordInput'
import { errorMessage } from '@/components/common/ErrorState'
import { FieldError } from '@/components/common/FieldError'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { useChangePassword } from '@/hooks/useAccount'
import { changePasswordInputSchema, type ChangePasswordInput } from '@/schemas/profile'

const fieldClass = 'h-12 rounded-xl border-border bg-background/40 md:h-10 md:rounded-sm'
const fieldNames = ['currentPassword', 'newPassword', 'confirmPassword'] as const

export function PasswordForm() {
  const changePassword = useChangePassword()
  const [formError, setFormError] = useState<string | null>(null)
  const form = useForm<ChangePasswordInput>({
    resolver: zodResolver(changePasswordInputSchema),
    defaultValues: { currentPassword: '', newPassword: '', confirmPassword: '' },
  })

  const onSubmit = form.handleSubmit((values) => {
    setFormError(null)
    changePassword.mutate(values, {
      onSuccess: () => {
        form.reset()
        toast.success('Senha alterada')
      },
      onError: (error) => {
        if (error instanceof ApiError && error.code === 'INVALID_CREDENTIALS') {
          form.setError('currentPassword', { type: 'server', message: 'Senha atual incorreta' })
          return
        }
        const applied = applyApiFieldErrors(error, form.setError, fieldNames)
        if (!applied) setFormError(errorMessage(error, 'Não foi possível alterar a senha. Tente novamente.'))
      },
    })
  })

  return (
    <form noValidate onSubmit={onSubmit} className="mt-12 flex flex-col gap-4 md:max-w-[417px]">
      <h2 className="text-base font-bold">Alterar senha</h2>

      {formError && (
        <div role="alert" className="flex items-start gap-2 rounded-sm border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          <AlertTriangle className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
          <span>{formError}</span>
        </div>
      )}

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="current-password">Senha atual</Label>
        <PasswordInput
          id="current-password"
          autoComplete="current-password"
          className={fieldClass}
          aria-invalid={Boolean(form.formState.errors.currentPassword)}
          aria-describedby={form.formState.errors.currentPassword ? 'current-password-error' : undefined}
          {...form.register('currentPassword')}
        />
        <FieldError id="current-password-error" message={form.formState.errors.currentPassword?.message} />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="new-password">Nova senha</Label>
        <PasswordInput
          id="new-password"
          autoComplete="new-password"
          className={fieldClass}
          aria-invalid={Boolean(form.formState.errors.newPassword)}
          aria-describedby={form.formState.errors.newPassword ? 'new-password-error' : undefined}
          {...form.register('newPassword')}
        />
        <FieldError id="new-password-error" message={form.formState.errors.newPassword?.message} />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="confirm-new-password">Confirmar nova senha</Label>
        <PasswordInput
          id="confirm-new-password"
          autoComplete="new-password"
          className={fieldClass}
          aria-invalid={Boolean(form.formState.errors.confirmPassword)}
          aria-describedby={form.formState.errors.confirmPassword ? 'confirm-new-password-error' : undefined}
          {...form.register('confirmPassword')}
        />
        <FieldError id="confirm-new-password-error" message={form.formState.errors.confirmPassword?.message} />
      </div>

      <Button type="submit" disabled={changePassword.isPending} className="mt-2 h-10 w-fit px-6">
        {changePassword.isPending ? 'Alterando…' : 'Alterar senha'}
      </Button>
    </form>
  )
}
