import { headers } from 'next/headers';
import { createSafeActionClient } from 'next-safe-action';

import { auth } from './auth';

export const actionClient = createSafeActionClient();

export const authAction = createSafeActionClient({
  handleServerError(error) {
    return error.message;
  },
}).use(async ({ next }) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user.id) {
    throw new Error('Vous devez être connecté pour effectuer cette action.');
  }

  return next({
    ctx: {
      session,
    },
  });
});
