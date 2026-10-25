import { createFileRoute, Link } from '@tanstack/react-router'
import { AuthFrame } from '@/components/auth/AuthFrame'
import { LoginForm } from '@/components/auth/LoginForm'
import { redirectSearchSchema } from '@/lib/redirect'

export const Route = createFileRoute('/login')({
  validateSearch: redirectSearchSchema,
  component: Page,
})

function Page() {
  const { redirect } = Route.useSearch()

  return (
    <AuthFrame
      mode="login"
      redirect={redirect}
      dialogTitle="Entrar na Kurio"
      mobileTitle="Entrar"
      subtitle="Entre para gerenciar sua carteira, coleção e perfil de criador."
      footer={
        <p>
          Novo na Kurio?{' '}
          <Link to="/signup" search={{ redirect }} className="text-accent-text hover:underline">
            Crie uma conta
          </Link>
        </p>
      }
    >
      <LoginForm redirect={redirect} />
    </AuthFrame>
  )
}
