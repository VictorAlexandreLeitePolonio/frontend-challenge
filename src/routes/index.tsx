import { createFileRoute } from '@tanstack/react-router'
import { PageContainer } from '@/components/layout/PageContainer'
import { nftListParamsSchema } from '@/schemas/nft'
export const Route = createFileRoute('/')({
  validateSearch: nftListParamsSchema,
  component: Page,
})

// Placeholder da fundação: tela implementada pelos agentes (docs/superpowers/plans/2026-10-25-agents.md).
function Page() {
  return (
    <PageContainer className="py-12">
      <h1 className="text-2xl font-bold">Início</h1>
      <p className="text-muted-foreground">Em construção.</p>
    </PageContainer>
  )
}
