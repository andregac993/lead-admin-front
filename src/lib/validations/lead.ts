import { z } from "zod";

// Helper para transformar strings vazias em undefined
const optionalString = z
  .string()
  .transform((val) => (val === "" ? undefined : val))
  .optional();

// Schema para criar lead
export const createLeadSchema = z.object({
  landingPageId: z.string().uuid("ID da landing page inválido"),
  name: z.string().min(1, "Nome é obrigatório"),
  email: z.string().min(1, "E-mail é obrigatório").email("E-mail inválido"),
  phone: optionalString,
  position: optionalString,
  dateOfBirth: optionalString,
  message: optionalString,
  utmSource: optionalString,
  utmMedium: optionalString,
  utmCampaign: optionalString,
  utmTerm: optionalString,
  utmContent: optionalString,
  gclid: optionalString,
  fbclid: optionalString,
});

// Schema para atualizar lead - flat structure conforme API espera
export const updateLeadSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório").optional(),
  email: z.string().email("E-mail inválido").optional(),
  phone: optionalString,
  position: optionalString,
  dateOfBirth: optionalString,
  message: optionalString,
  utmSource: optionalString,
  utmMedium: optionalString,
  utmCampaign: optionalString,
  utmTerm: optionalString,
  utmContent: optionalString,
  gclid: optionalString,
  fbclid: optionalString,
});

export type CreateLeadInput = z.infer<typeof createLeadSchema>;
export type UpdateLeadInput = z.infer<typeof updateLeadSchema>;
