import z from "zod";

export const searchSchema = z.object({
    phoneNumber: z
        .string()
        .trim()
        .min(11, 'Номер от 11 до 16 цифр')
        .max(16, 'Номер от 11 до 16 цифр')
        .regex(/^\d+$/, 'Только цифры, без плюса и пробелов'),
});

export type TSearchValues = z.infer<typeof searchSchema>;