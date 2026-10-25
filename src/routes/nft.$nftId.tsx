import { createFileRoute } from '@tanstack/react-router'
import { PageContainer } from '@/components/layout/PageContainer'
import { z } from 'zod'
import { editionIdSchema } from '@/schemas/nft'
export const Route = createFileRoute('/nft/$nftId')({
  validateSearch: z.object({ edition: editionIdSchema.optional().catch(undefined) }),
  component: Page,
})

// Placeholder da fundação: tela implementada pelos agentes (docs/superpowers/plans/2026-10-25-agents.md).
function Page() {
  return (
    <PageContainer className="py-12">
      <h1 className="text-2xl font-bold">Detalhe do NFT</h1>
      <p className="text-muted-foreground">Em construção.</p>
    </PageContainer>
  )
}
