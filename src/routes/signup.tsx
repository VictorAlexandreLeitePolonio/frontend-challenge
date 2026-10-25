import { createFileRoute, Link } from '@tanstack/react-router'
import { AuthFrame } from '@/components/auth/AuthFrame'
import { SignupForm } from '@/components/auth/SignupForm'
import { redirectSearchSchema } from '@/lib/redirect'

export const Route = createFileRoute('/signup')({
  validateSearch: redirectSearchSchema,
  component: Page,
})

function Page() {
  const { redirect } = Route.useSearch()

  return (
    <AuthFrame
      mode="signup"
      redirect={redirect}
      dialogTitle="Criar conta na Kurio"
      mobileTitle="Criar perfil de colecionador"
      subtitle="Crie seu perfil de colecionador e conecte uma carteira quando quiser."
      footer={
        <p>
          Já tem uma conta?{' '}
          <Link to="/login" search={{ redirect }} className="text-accent-text hover:underline">
            Entre
          </Link>
        </p>
      }
    >
      <SignupForm redirect={redirect} />
    </AuthFrame>
  )
}
