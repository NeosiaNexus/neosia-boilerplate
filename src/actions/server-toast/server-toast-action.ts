'use server';

import { cookies } from 'next/headers';
import { z } from 'zod';

import { actionClient } from '@/lib/actions';

const inputSchema = z.object({
  message: z.string(),
  type: z.enum(['success', 'error', 'warning', 'info']),
});

const outputSchema = z.object({
  success: z.boolean(),
});

const serverToast = actionClient
  .inputSchema(inputSchema)
  .outputSchema(outputSchema)
  .action(async ({ parsedInput: { message, type } }) => {
    const cookieStore = await cookies();
    const id = crypto.randomUUID();

    cookieStore.set(`toast-${id}`, JSON.stringify({ message, type }), {
      path: '/',
      httpOnly: true,
      maxAge: 60 * 60 * 24,
    });

    return {
      success: true,
    };
  });

export default serverToast;
