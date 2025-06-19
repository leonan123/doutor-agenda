import { z } from 'zod'

import { patientSexEnum } from '@/_db/schema'

export const upsertPatientSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().trim().min(1, 'O nome é obrigatório'),
  email: z.string().email('Email inválido'),
  phoneNumber: z.string().min(1, 'O telefone é obrigatório'),
  sex: z.enum([patientSexEnum.enumValues[0], patientSexEnum.enumValues[1]], {
    errorMap: () => ({ message: 'O sexo é obrigatório' }),
  }),
})
