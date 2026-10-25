import { z } from 'zod'

/** Só aceita caminhos internos ("/..."), nunca "//host" ou URLs absolutas (open redirect). */
export const redirectSearchSchema = z.object({
  redirect: z
    .string()
    .refine((value) => value.startsWith('/') && !value.startsWith('//'), 'redirect inválido')
    .optional()
    .catch(undefined),
})
