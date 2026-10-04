import { z } from 'zod';

export const loginSchema = z.object({
	idInstance: z
		.string()
		.trim()
		.min(1, 'Укажите idInstance')
		.regex(/^\d+$/, 'idInstance состоит только из цифр'),
	apiTokenInstance: z
		.string()
		.trim()
		.min(1, 'Укажите apiTokenInstance')
		.min(20, 'Токен выглядит слишком коротким'),
});

export type TLoginFormValues = z.infer<typeof loginSchema>;
