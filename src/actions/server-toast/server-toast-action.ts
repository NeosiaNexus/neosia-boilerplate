'use server';

import { cookies } from 'next/headers';

type ToastType = 'success' | 'error' | 'warning' | 'info';

const serverToast = async (
  message: string,
  type: ToastType = 'success',
  description?: string,
): Promise<void> => {
  const cookieStore = await cookies();
  const id = crypto.randomUUID();

  cookieStore.set(`toast-${id}`, JSON.stringify({ message, type, description }), {
    path: '/',
    httpOnly: true,
    maxAge: 60 * 60 * 24,
  });
};

export default serverToast;
