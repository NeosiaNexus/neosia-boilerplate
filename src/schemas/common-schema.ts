import { z } from 'zod';

export const pathSchema = z
  .string()
  .min(1, 'Le chemin ne peut pas être vide')
  // eslint-disable-next-line no-useless-escape
  .regex(/^(?!\/)(?!.*\/$)(?!.*\.\.)(?!.*\/\/)[^\/]+(?:\/[^\/]+)*$/, 'Chemin cloud invalide');
