import { z } from 'zod';

export const pathSchema = z
  .string()
  .min(1, 'Le chemin ne peut pas être vide')
  // eslint-disable-next-line no-useless-escape
  .regex(
    /^(?!.*\.\.)(?!\/)(?!.*\/\/)(?!.*\/$)[A-Za-z0-9._-]+(?:\/[A-Za-z0-9._-]+)*$/,
    'Chemin invalide',
  );
