import { headers } from 'next/headers';
import { createSafeActionClient } from 'next-safe-action';

import { auth } from '@/lib/auth';
import ActionError from '@/lib/errors/ActionError';

const adminMiddleware = createSafeActionClient({
  handleServerError(error) {
    return error.message;
  },
}).use(async ({ next }) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user.id) {
    throw new ActionError('Vous devez être connecté pour effectuer cette action.');
  }

  if (!session.user.role?.split(',').includes('admin')) {
    throw new ActionError('Vous devez être administrateur pour effectuer cette action.');
  }

  return next({
    ctx: {
      session,
    },
  });
});

export default adminMiddleware;
